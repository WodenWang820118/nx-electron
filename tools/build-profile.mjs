import { execSync } from 'node:child_process';
import { existsSync, writeFileSync, unlinkSync } from 'node:fs';
import { resolve, join } from 'node:path';

function run(command, options = {}) {
  execSync(command, { stdio: 'inherit', ...options });
}

function normalizeProfile(profile) {
  return (profile || 'ng-nest').trim().toLowerCase();
}

function inferFrontendProject(profile) {
  if (profile.includes('vue')) return 'vue-tracker';
  if (profile.includes('react')) return 'react-tracker';
  return 'ng-tracker';
}

function inferBackendProject(profile) {
  if (profile.includes('express')) return 'express-backend';
  if (profile.includes('spring')) return 'spring-backend';
  return 'nest-backend';
}

function prepareSpringDist() {
  run('node tools/prepare-spring-dist.mjs');
}

function cleanupLogFiles(backendName) {
  const distDir = resolve(`dist/${backendName}`);
  const errorLog = join(distDir, 'error.log');
  const infoLog = join(distDir, 'info.log');
  
  try {
    if (existsSync(errorLog)) unlinkSync(errorLog);
    if (existsSync(infoLog)) unlinkSync(infoLog);
  } catch (err) {
    console.warn('Warning: Could not remove old log files:', err.message);
  }
  
  writeFileSync(errorLog, '', 'utf8');
  writeFileSync(infoLog, '', 'utf8');
  console.log(`Log files cleaned for ${backendName}`);
}

function installNodeBackendDeps(backendName) {
  const distDir = resolve(`dist/${backendName}`);
  if (!existsSync(distDir)) {
    throw new Error(`Expected ${distDir} to exist after build.`);
  }

  // The backend runs outside the asar, so it needs its own node_modules.
  run('npm install --omit=dev', { cwd: distDir });
}

const profile = normalizeProfile(process.env.APP_PROFILE);
const frontend = inferFrontendProject(profile);
const backend = inferBackendProject(profile);

console.log(`Building profile: ${profile}`);
console.log(`Frontend: ${frontend}`);
console.log(`Backend: ${backend}`);

// Frontend build
if (frontend === 'ng-tracker') {
  run('pnpm exec nx build ng-tracker --configuration production --optimization --base-href ./');
} else {
  run(`pnpm exec nx build ${frontend}`);
}

// Backend build
if (backend === 'spring-backend') {
  // Requires Maven available on PATH.
  run('mvn -f pom.xml -DskipTests package');
  prepareSpringDist();
} else {
  // Keep env alignment with existing scripts.
  run(`pnpm exec nx build ${backend}`, {
    env: {
      ...process.env,
      NODE_ENV: process.env.NODE_ENV || 'prod',
      PORT: process.env.PORT || '5000',
    },
  });
  installNodeBackendDeps(backend);
  cleanupLogFiles(backend);
}
