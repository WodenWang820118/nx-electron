// #region Imports
import { execSync, ExecSyncOptions } from 'node:child_process';
import { existsSync, writeFileSync, unlinkSync } from 'node:fs';
import { resolve, join } from 'node:path';
// #endregion

// #region Types
type RunOptions = ExecSyncOptions;
// #endregion

// #region Helpers
/**
 * Execute a shell command and inherit stdio for live output.
 */
function run(command: string, options: RunOptions = {}): void {
  execSync(command, { stdio: 'inherit', ...options });
}

/** Normalize profile string to a consistent lower-case identifier. */
function normalizeProfile(profile?: string): string {
  return (profile || 'ng-nest').trim().toLowerCase();
}

/** Infer frontend project name from profile. */
function inferFrontendProject(profile: string): string {
  if (profile.includes('vue')) return 'vue-tracker';
  if (profile.includes('react')) return 'react-tracker';
  return 'ng-tracker';
}

/** Infer backend project name from profile. */
function inferBackendProject(profile: string): string {
  if (profile.includes('express')) return 'express-backend';
  if (profile.includes('spring')) return 'spring-backend';
  return 'nest-backend';
}

/** Prepare Spring distribution by calling the existing JS helper. */
function prepareSpringDist(): void {
  run('node --loader ts-node/esm tools/prepare-spring-dist.ts');
}

/** Build a minimal Java runtime image for Spring packaging. */
function prepareJavaRuntime(): void {
  run('node --loader ts-node/esm tools/prepare-java-runtime.ts');
}

/** Ensure old log files are removed and fresh log files exist. */
function cleanupLogFiles(backendName: string): void {
  const distDir = resolve(`dist/${backendName}`);
  const errorLog = join(distDir, 'error.log');
  const infoLog = join(distDir, 'info.log');

  try {
    if (existsSync(errorLog)) unlinkSync(errorLog);
    if (existsSync(infoLog)) unlinkSync(infoLog);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('Warning: Could not remove old log files:', msg);
  }

  writeFileSync(errorLog, '', 'utf8');
  writeFileSync(infoLog, '', 'utf8');
  console.log(`Log files cleaned for ${backendName}`);
}

/** Install production dependencies for node backends placed in `dist/<backend>`. */
function installNodeBackendDeps(backendName: string): void {
  const distDir = resolve(`dist/${backendName}`);
  if (!existsSync(distDir)) {
    throw new Error(`Expected ${distDir} to exist after build.`);
  }

  // The backend runs outside the asar, so it needs its own node_modules.
  run('npm install --omit=dev', { cwd: distDir } as RunOptions);
}
// #endregion

// #region Main
const profile = normalizeProfile(process.env.APP_PROFILE);
const frontend = inferFrontendProject(profile);
const backend = inferBackendProject(profile);

console.log(`Building profile: ${profile}`);
console.log(`Frontend: ${frontend}`);
console.log(`Backend: ${backend}`);

// Frontend build
if (frontend === 'ng-tracker') {
  run(
    'pnpm exec nx build ng-tracker --configuration production --optimization --base-href ./',
  );
} else {
  run(`pnpm exec nx build ${frontend}`);
}

// Backend build
if (backend === 'spring-backend') {
  // Requires Maven available on PATH.
  run('mvn -f pom.xml -DskipTests package');
  prepareSpringDist();
  // Requires a JDK (JAVA_HOME) so jdeps/jlink are available.
  prepareJavaRuntime();
} else {
  // Keep env alignment with existing scripts.
  run(`pnpm exec nx build ${backend}`, {
    env: {
      ...process.env,
      NODE_ENV: process.env.NODE_ENV || 'prod',
      PORT: process.env.PORT || '5000',
    },
  } as RunOptions);
  installNodeBackendDeps(backend);
  cleanupLogFiles(backend);
}
// #endregion

// Note: This TypeScript file is a straightforward refactor of the original
// tools/build-profile.mjs. To execute it directly you may use a ts-node runner
// or compile it to JavaScript in your toolchain. No runtime behavior was
// changed.
