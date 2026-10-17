import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupReport, USDC } from '../plugin/src/setup';
const config = { pack: 'holo' as const, chain: 'eip155:8453' as const };

test('zero configuration still exposes all tools and requires no network call', async () => {
  const report = await setupReport({ ...config, probe: false }, async () => {throw new Error('Must not fetch during discovery');});
  assert.equal(report.tools.length, 5); assert.equal(report.demoReady, true);
  assert.equal(report.merchantConfigured, false); assert.equal(report.merchantStatus, 'not-configured');
  assert.equal(report.paymentExecuted, false); assert.deepEqual(report.requiredVariables, []);
});
test('configured URL is never described as a verified merchant before probing', async () => {
  const report=await setupReport({...config,endpoint:'https://merchant.example/rip',probe:false},async()=>{throw new Error('No implicit probe');});
  assert.equal(report.merchantStatus,'not-checked'); assert.equal(report.hostedPermissionsVerified,false);
  assert.deepEqual(report.requiredNetworkHosts,['api.pokemontcg.io','merchant.example']);
});
test('invalid merchant configuration does not hide the tool catalog', async () => {
  const report=await setupReport({...config,endpoint:'https://u:p@merchant.example/rip',probe:false});
  assert.equal(report.merchantStatus,'invalid-configuration');assert.equal(report.tools.length,5);
});
test('unpaid merchant probe validates exact price and resource without paying', async () => {
  const challenge={x402Version:2,resource:{url:'https://merchant.example/rip?pack=holo'},accepts:[{scheme:'exact',network:'eip155:8453',asset:USDC['eip155:8453'],amount:'5000000',payTo:'0x1111111111111111111111111111111111111111'}]};
  let calls=0;const fetcher:typeof fetch=async(_url,init)=>{calls++;assert.equal(init?.redirect,'error');return new Response('',{status:402,headers:{'PAYMENT-REQUIRED':Buffer.from(JSON.stringify(challenge)).toString('base64')}})};
  const report=await setupReport({...config,endpoint:'https://merchant.example/rip',probe:true},fetcher);
  assert.equal(calls,1);assert.equal(report.merchantStatus,'challenge-valid');assert.equal(report.paymentExecuted,false);
  challenge.accepts[0].amount='10000000';
  assert.equal((await setupReport({...config,endpoint:'https://merchant.example/rip',probe:true},fetcher)).merchantStatus,'challenge-mismatch');
});
test('merchant outages and missing 402 challenges remain explicit', async () => {
  const input={...config,endpoint:'https://merchant.example/rip',probe:true};
  assert.equal((await setupReport(input,async()=>new Response('{}',{status:200}))).merchantStatus,'challenge-mismatch');
  assert.equal((await setupReport(input,async()=>{throw new Error('Host not allowed')})).merchantStatus,'request-failed');
});
