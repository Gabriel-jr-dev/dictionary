const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const outputPath = path.resolve(projectRoot, 'assets/databases/base.sqlite');
const scriptPath = path.resolve(__dirname, 'build_wordnet_sqlite.py');

const DEFAULT_CANDIDATES = process.platform === 'win32'
  ? ['python', 'py', 'python3']
  : ['python3', 'python'];

function shouldSkip() {
  return process.env.SKIP_DICTIONARY_BUILD === '1';
}

function ensureDatabase({ force = false, quiet = false } = {}) {
  if (shouldSkip()) {
    if (!quiet) {
      console.warn('Skipping dictionary database generation because SKIP_DICTIONARY_BUILD=1');
    }
    return;
  }

  if (!force && fs.existsSync(outputPath)) {
    if (!quiet) {
      console.log(`Dictionary database already exists at ${path.relative(projectRoot, outputPath)}`);
    }
    return;
  }

  let lastError;
  for (const command of DEFAULT_CANDIDATES) {
    const result = spawnSync(command, [scriptPath], {
      cwd: projectRoot,
      stdio: 'inherit',
      env: process.env,
    });

    if (result.status === 0) {
      if (!quiet) {
        console.log(`Dictionary database generated at ${path.relative(projectRoot, outputPath)}`);
      }
      return;
    }

    lastError = result.error || new Error(`Command \`${command}\` exited with status ${result.status}`);
  }

  const hint = `Install Python 3 and run "python scripts/build_wordnet_sqlite.py" manually.`;
  const error = new Error(`Failed to generate dictionary database. ${hint}`);
  error.cause = lastError;
  throw error;
}

module.exports = ensureDatabase;

if (require.main === module) {
  const force = process.argv.includes('--force');
  const quiet = process.argv.includes('--quiet');

  try {
    ensureDatabase({ force, quiet });
  } catch (error) {
    if (!quiet) {
      console.error(error.message);
      if (error.cause) {
        console.error(error.cause.message || error.cause);
      }
    }
    process.exitCode = 1;
  }
}
