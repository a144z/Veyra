/** Run the project's validation locally; no hosted runner or workflow is required. */
import { spawnSync } from 'node:child_process';

const npmEntry = process.env.npm_execpath;
if (!npmEntry) {
  console.error('Run this check through npm: npm run check');
  process.exit(1);
}

for (const task of ['typecheck', 'test', 'build']) {
  console.log(`\nRunning ${task}…`);
  const result = spawnSync(process.execPath, [npmEntry, 'run', task], { stdio: 'inherit' });
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log('\nAll local checks passed.');
