import type {Pack} from './catalog';
import type {Collectible} from './pokemon';
export type PaymentMode='demo'|'live';
export class PaymentUncertainError extends Error {constructor(message:string){super(message);this.name='PaymentUncertainError'}}
export interface Receipt {id:string;mode:PaymentMode;amount:number;transaction:string|null;settledAt:string;card?:Collectible}
export interface Ledger {balance:number;day:string;spent:number;receipts:Receipt[]}
export interface Requirement {scheme:string;network:string;asset:string;amount:string;payTo:string;maxTimeoutSeconds:number;extra?:Record<string,unknown>}
export interface Challenge {x402Version:2;resource:{url:string;description:string;mimeType:string};accepts:Requirement[]}
export interface Bridge {
 // APPLICATION integration contract, not an official PayBox browser global.
 // A separately authenticated host delegates to PayBox pay_x402 and returns the signed header.
 payX402(input:{challenge:Challenge;accepted:Requirement}):Promise<{paymentSignature:string}>;
}
declare global {interface Window {veyraPaybox?:Bridge}}
export const dayKey=()=>new Date().toISOString().slice(0,10);
export const initialLedger=():Ledger=>({balance:25,day:dayKey(),spent:0,receipts:[]});
export function validateSpend(ledger:Ledger,amount:number,agent:boolean) {
 if(!Number.isFinite(amount)||amount<=0)throw new Error('Invalid pack price.');
 if(ledger.balance<amount)throw new Error('Your demo balance is too low. Reset the demo wallet in Settings.');
 const spent=ledger.day===dayKey()?ledger.spent:0;
 if(agent&&spent+amount>10)throw new Error('Daily agent allowance reached. Switch to manual mode or return tomorrow.');
}
export function debit(ledger:Ledger,receipt:Receipt,agent:boolean):Ledger {
 if(ledger.receipts.some(r=>r.id===receipt.id))return ledger;
 validateSpend(ledger,receipt.amount,agent);
 return {...ledger,balance:Math.round((ledger.balance-receipt.amount)*100)/100,day:dayKey(),spent:(ledger.day===dayKey()?ledger.spent:0)+receipt.amount,receipts:[receipt,...ledger.receipts]};
}
const delay=(ms:number)=>new Promise(r=>setTimeout(r,ms));
export async function demoPayment(pack:Pack,log:(s:string)=>void):Promise<Receipt> {
 log('[x402] Local challenge → 402 PAYMENT-REQUIRED');await delay(450);
 log(`[Policy] ${pack.price.toFixed(2)} USDC · allowance checked locally`);await delay(450);
 log('[PayBox demo] Simulating signature · no wallet connected');await delay(700);
 const receipt:Receipt={id:crypto.randomUUID(),mode:'demo',amount:pack.price,transaction:null,settledAt:new Date().toISOString()};
 log('[Receipt] Demo settlement complete · no on-chain transaction');return receipt;
}
export function validateChallenge(challenge:Challenge,pack:Pack):Requirement {
 if(challenge.x402Version!==2||!Array.isArray(challenge.accepts))throw new Error('Unsupported x402 challenge.');
 // Exact price, Base USDC asset, and network binding prevent signing a substituted payment.
 const selected=challenge.accepts.find(r=>r.scheme==='exact'&&r.network==='eip155:8453'&&r.asset?.toLowerCase()==='0x833589fcd6edb6e08f4c7c32d4f71b54bda02913'&&r.amount===String(Math.round(pack.price*1e6))&&/^0x[a-fA-F0-9]{40}$/.test(r.payTo));
 if(!selected)throw new Error('Merchant challenge does not match this pack price and Base USDC.');return selected;
}
export async function livePayment(pack:Pack,merchant:string,log:(s:string)=>void):Promise<Receipt> {
 if(!window.veyraPaybox)throw new Error('Live mode requires an authenticated PayBox host bridge. See docs/INTEGRATION.md.');
 const pendingKey='veyra.pending-payment';
 const pending=localStorage.getItem(pendingKey);if(pending)throw new PaymentUncertainError('A prior payment needs reconciliation. Do not pay again. Merchant request '+pending);
 const url=new URL(merchant);if(url.protocol!=='https:')throw new Error('Merchant URL must use HTTPS.');
 url.searchParams.set('pack',pack.id);
 log('[x402] Requesting merchant challenge');
 const requestId=crypto.randomUUID();const headers={'X-Request-Id':requestId};
 const first=await fetch(url,{headers,signal:AbortSignal.timeout(15000)});
 if(first.status!==402)throw new Error('Merchant must return HTTP 402 before payment.');
 const encoded=first.headers.get('PAYMENT-REQUIRED');if(!encoded)throw new Error('Merchant must expose PAYMENT-REQUIRED through CORS.');
 const challenge:Challenge=JSON.parse(atob(encoded));const accepted=validateChallenge(challenge,pack);
 if(challenge.resource.url!==url.toString())throw new Error('Challenge resource does not match the requested pack.');
 log('[PayBox] Waiting for wallet approval / settlement');
 // The authenticated host calls PayBox pay_x402. No PayBox keys are shipped in this static app.
 const signed=await window.veyraPaybox.payX402({challenge,accepted});
 if(!signed.paymentSignature)throw new Error('Payment signature missing.');
 localStorage.setItem(pendingKey,requestId);
 log('[x402] Retrying with PAYMENT-SIGNATURE');
 let paid:Response;
 try{paid=await fetch(url,{headers:{...headers,'PAYMENT-SIGNATURE':signed.paymentSignature},signal:AbortSignal.timeout(30000)});}catch{throw new PaymentUncertainError('Payment submission outcome is unknown. Do not pay again. Contact the merchant with request '+requestId);}
 if(!paid.ok)throw new PaymentUncertainError('Payment submitted; merchant delivery is unconfirmed. Do not pay again. Contact the merchant with request '+requestId);
 let body;try{body=await paid.json();}catch{throw new PaymentUncertainError('Merchant returned an unreadable receipt. Do not pay again. Request '+requestId);}
 // Merchant must verify settlement and allocate real inventory. API metadata alone cannot do that.
 if(body.settled!==true||typeof body.transaction!=='string'||!/^0x[a-fA-F0-9]{64}$/.test(body.transaction)||!body.receiptId||!body.card?.id)throw new PaymentUncertainError('Merchant settlement or card allocation is unverified. Do not pay again. Request '+requestId);
 localStorage.removeItem(pendingKey);
 log('[Blockchain] Merchant confirmed settlement');
 return {id:body.receiptId,mode:'live',amount:pack.price,transaction:body.transaction,settledAt:new Date().toISOString(),card:body.card};
}
