/** Inspect the actual upload bundle over the official hosted MCP protocol, without network or payments. */
import { spawn } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const artifact = new URL('../dist/plugin.mjs', import.meta.url);
const bytes = await readFile(artifact);
const child = spawn(process.execPath, [artifact.pathname], { stdio: ['pipe', 'pipe', 'pipe'], env: { PATH: process.env.PATH, NODE_ENV: 'production' } });
let output = '';
let errors = '';
const timeout = setTimeout(() => { child.kill(); console.error('Plugin discovery timed out.'); process.exitCode = 1; }, 9000);
child.stderr.on('data', data => { errors += data; });
child.stdout.on('data', async data => {
  output += data;
  for (const line of output.split('\n').slice(0, -1)) {
    let message; try { message = JSON.parse(line); } catch { continue; }
    if (message.id !== 1) continue;
    clearTimeout(timeout);
    const tools = message.result?.tools;
    if (message.error || !Array.isArray(tools) || tools.length !== 5) {
      child.kill(); console.error('Expected five tools in the built artifact.'); process.exitCode = 1; return;
    }
    if (tools.some(tool => !tool.name || !tool.title || !tool.description)) {
      child.kill(); console.error('Every tool must have a name, title, and description.'); process.exitCode = 1; return;
    }
    const report = { version: '1.1.0', protocolVersion: '2026-07-28', artifact: 'dist/plugin.mjs', bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), toolCount: tools.length, discoveryRequiresNetwork: false, discoveryRequiresVariables: false, tools };
    await writeFile(new URL('../docs/plugin-tools.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({toolCount:tools.length, tools:tools.map(({name,title})=>({name,title})),sha256:report.sha256},null,2));
    child.kill(); return;
  }
});
child.on('error', error => {clearTimeout(timeout);console.error(error.message);process.exitCode=1;});
child.on('exit', () => {clearTimeout(timeout);if(!output){console.error('Plugin returned no catalog.',errors.slice(0,300));process.exitCode=1;}});
child.stdin.write(JSON.stringify({jsonrpc:'2.0',id:1,method:'tools/list',params:{_meta:{'io.modelcontextprotocol/protocolVersion':'2026-07-28','io.modelcontextprotocol/clientInfo':{name:'veyra-discovery-check',version:'1.0.0'},'io.modelcontextprotocol/clientCapabilities':{}}}})+'\n');
