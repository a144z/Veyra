import { getPack, merchantUrl, type PackId } from './domain.js';

export const TOOL_NAMES = ['list_packs', 'inspect_card', 'open_demo_pack', 'propose_pack_purchase', 'get_setup_status'];
export const USDC = {
  'eip155:8453': '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  'solana:mainnet': 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
} as const;
export type Chain = keyof typeof USDC;
export type MerchantStatus = 'not-configured' | 'invalid-configuration' | 'not-checked' | 'challenge-valid' | 'challenge-mismatch' | 'request-failed';
export interface SetupReport {
  version: string;
  tools: string[];
  demoReady: true;
  merchantConfigured: boolean;
  merchantHost: string | null;
  merchantStatus: MerchantStatus;
  message: string;
  requiredNetworkHosts: string[];
  requiredVariables: string[];
  secretsRequired: false;
  hostedPermissionsVerified: false;
  paymentExecuted: false;
  nextSteps: string[];
}

export async function setupReport(input: { endpoint?: string; probe: boolean; pack: PackId; chain: Chain }, fetcher: typeof fetch = fetch): Promise<SetupReport> {
  const report: SetupReport = {
    version: '1.1.0', tools: [...TOOL_NAMES], demoReady: true, merchantConfigured: false,
    merchantHost: null, merchantStatus: 'not-configured', message: 'Demo and tool discovery need no variables, secrets, wallet, or network hosts.',
    requiredNetworkHosts: ['api.pokemontcg.io'], requiredVariables: [], secretsRequired: false,
    hostedPermissionsVerified: false, paymentExecuted: false,
    nextSteps: ['For live card metadata, allow api.pokemontcg.io in Network access.', 'For real purchases, provide a real x402 pack merchant; allow its exact hostname and set VEYRA_MERCHANT_URL.', 'In PayBox Test, choose Load tools after every upload or configuration change.'],
  };
  if (!input.endpoint) return report;
  let url: string;
  try { url = merchantUrl(input.endpoint, input.pack); }
  catch {
    return { ...report, merchantStatus: 'invalid-configuration', message: 'VEYRA_MERCHANT_URL must be a public HTTPS endpoint on port 443 with no credentials, query or fragment.' };
  }
  report.merchantConfigured = true;
  report.merchantHost = new URL(url).hostname;
  report.requiredNetworkHosts.push(report.merchantHost);
  report.requiredVariables = ['VEYRA_MERCHANT_URL'];
  report.merchantStatus = 'not-checked';
  report.message = 'Merchant URL is configured. Neither network permissions, its live challenge, nor fulfillment has been verified.';
  if (!input.probe) return report;
  try {
    // An explicit, bounded unpaid GET only. This never signs or submits a payment.
    const response = await fetcher(url, { signal: AbortSignal.timeout(3500), redirect: 'error' });
    if (response.status !== 402) {
      return { ...report, merchantStatus: 'challenge-mismatch', message: `Merchant returned HTTP ${response.status}; a payable pack endpoint must return 402 before payment.` };
    }
    const header = response.headers.get('PAYMENT-REQUIRED');
    const challenge = header ? JSON.parse(Buffer.from(header, 'base64').toString('utf8')) : await response.json();
    const rail = USDC[input.chain];
    const accepted = Array.isArray(challenge.accepts) && challenge.accepts.some((r: Record<string, unknown>) =>
      r.scheme === 'exact' && r.network === input.chain && typeof r.asset === 'string' &&
      (input.chain === 'eip155:8453' ? r.asset.toLowerCase() === rail : r.asset === rail) &&
      String(r.amount ?? r.maxAmountRequired) === getPack(input.pack).maxAmount &&
      typeof r.payTo === 'string' && r.payTo.length > 0,
    );
    if (![1, 2].includes(challenge.x402Version) || !accepted || (challenge.x402Version === 2 && challenge.resource?.url !== url)) {
      return { ...report, merchantStatus: 'challenge-mismatch', message: 'Challenge does not match the selected pack, USDC asset, exact price, network, or resource. No payment was attempted.' };
    }
    return { ...report, merchantStatus: 'challenge-valid', message: 'An unpaid live 402 challenge matches this pack. PayBox must independently validate, approve, and execute it. Inventory, custody, and fulfillment are not proven.' };
  } catch {
    return { ...report, merchantStatus: 'request-failed', message: 'Merchant probe failed. Check its exact network hostname, availability, HTTPS configuration, and 402 response. No payment was attempted.' };
  }
}
