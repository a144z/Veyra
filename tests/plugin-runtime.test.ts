import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const artifact = fileURLToPath(new URL('../dist/plugin.mjs', import.meta.url));

function invoke(method: string, params: Record<string, unknown>, merchant?: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [artifact], {env:{PATH:process.env.PATH,NODE_ENV:'production',...(merchant?{VEYRA_MERCHANT_URL:merchant}:{})},stdio:['pipe','pipe','pipe']});
    let buffer='';let received=false;
    const timer=setTimeout(()=>{child.kill();reject(new Error('Plugin response timeout'));},9000);
    child.on('error',error=>{clearTimeout(timer);reject(error)});
    child.on('exit',()=>{clearTimeout(timer);if(!received)reject(new Error('Plugin exited without a response'))});
    child.stdout.on('data',data=>{buffer+=data;const lines=buffer.split('\n');buffer=lines.pop()!;for(const line of lines){const message=JSON.parse(line);if(message.id===1){received=true;clearTimeout(timer);resolve(message);child.kill();break}}});
    child.stdin.write(JSON.stringify({jsonrpc:'2.0',id:1,method,params:{...params,_meta:{'io.modelcontextprotocol/protocolVersion':'2026-07-28','io.modelcontextprotocol/clientInfo':{name:'veyra-runtime-test',version:'1.0.0'},'io.modelcontextprotocol/clientCapabilities':{}}}})+'\n');
  });
}

test('upload artifact exposes five titled tools without variables or network configuration',async()=>{
 const response=await invoke('tools/list',{});assert.equal(response.result.resultType,'complete');assert.equal(response.result.tools.length,5);
 assert.deepEqual(response.result.tools.map((t:any)=>t.name).sort(),['get_setup_status','inspect_card','list_packs','open_demo_pack','propose_pack_purchase'].sort());
 for(const tool of response.result.tools){assert.ok(tool.title);assert.ok(tool.description);assert.equal(tool.inputSchema.type,'object')}
});

test('upload artifact returns native capped proposals for both payment rails without executing a payment',async()=>{
 for(const chain of ['eip155:8453','solana:mainnet']){
  const response=await invoke('tools/call',{name:'propose_pack_purchase',arguments:{pack:'holo',chain}},'https://merchant.example/rip');
  assert.ok(!response.error);assert.ok(!response.result.isError);
  const proposal=response.result.structuredContent['io.paybox/transactionProposal'];
  assert.equal(proposal.kind,'x402');assert.equal(proposal.chain,chain);assert.equal(proposal.payment.maxAmount,'5000000');assert.equal(proposal.request.url,'https://merchant.example/rip?pack=holo');
  assert.ok(!('transactionHash' in proposal));
 }
});

test('upload artifact rejects live purchase when there is no merchant instead of simulating success',async()=>{
 const response=await invoke('tools/call',{name:'propose_pack_purchase',arguments:{pack:'holo'}});
 assert.ok(response.error||response.result?.isError);assert.match(JSON.stringify(response),/configure VEYRA_MERCHANT_URL/);
});
