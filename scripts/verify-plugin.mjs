// Exercise each non-payment tool through the official conformance runner, restoring the selected sample.
import {readFile,writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
const file=new URL('../plugin/paybox-plugin.json',import.meta.url);const original=await readFile(file,'utf8');
try{for(const sample of [{tool:'list_packs',arguments:{}},{tool:'inspect_card',arguments:{cardId:'base1-4'}},{tool:'open_demo_pack',arguments:{pack:'chase',seed:3}}]){await writeFile(file,JSON.stringify(sample));const result=spawnSync(process.execPath,['scripts/conformance.mjs'],{cwd:new URL('../plugin/',import.meta.url),encoding:'utf8'});process.stdout.write(result.stdout);process.stderr.write(result.stderr);if(result.status!==0)throw new Error('Conformance failed for '+sample.tool);}}finally{await writeFile(file,original)}
