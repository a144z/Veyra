import {copyFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
copyFileSync('plugin/dist/plugin.mjs','dist/plugin.mjs');
const bytes=readFileSync('dist/plugin.mjs');
console.log(JSON.stringify({file:'dist/plugin.mjs',bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')}));
