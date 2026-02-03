import { join } from 'node:path';
import { cwd } from 'node:process';
import { existsSync } from 'node:fs';

type FrontendName = 'ng-tracker' | 'vue-tracker' | 'react-tracker';
type BackendName = 'nest-backend' | 'express-backend' | 'spring-backend';

function normalizeFrontendName(value?: string): FrontendName {
  const normalized = (value || '').trim().toLowerCase();

  switch (normalized) {
    case 'ng':
    case 'angular':
    case 'ng-tracker':
      return 'ng-tracker';
    case 'vue':
    case 'vue-tracker':
      return 'vue-tracker';
    case 'react':
    case 'react-tracker':
      return 'react-tracker';
    default:
      return 'ng-tracker';
  }
}

function getFrontendName(): FrontendName {
  return normalizeFrontendName(process.env.FRONTEND);
}

function normalizeBackendName(value?: string): BackendName {
  const normalized = (value || '').trim().toLowerCase();

  switch (normalized) {
    case 'nest':
    case 'nestjs':
    case 'nest-backend':
      return 'nest-backend';
    case 'express':
    case 'express-backend':
      return 'express-backend';
    case 'spring':
    case 'spring-boot':
    case 'spring-backend':
      return 'spring-backend';
    default:
      return 'nest-backend';
  }
}

function inferBackendNameFromProfile(profile?: string): BackendName {
  const normalized = (profile || '').trim().toLowerCase();
  if (!normalized) return 'nest-backend';

  if (normalized.includes('express')) return 'express-backend';
  if (normalized.includes('spring')) return 'spring-backend';
  if (normalized.includes('nest')) return 'nest-backend';

  return 'nest-backend';
}

function getBackendName(): BackendName {
  // BACKEND takes precedence for local overrides.
  if (process.env.BACKEND) {
    return normalizeBackendName(process.env.BACKEND);
  }

  // Otherwise infer from APP_PROFILE (e.g. ng-nest, ng-express, ng-spring).
  return inferBackendNameFromProfile(process.env.APP_PROFILE);
}

function resolveFirstExistingPath(paths: string[]) {
  for (const candidate of paths) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return paths[0];
}

function getRootBackendFolderPath(env: string, resourcesPath: string) {
  const backendName = getBackendName();

  switch (env) {
    case 'dev':
    case 'staging':
      return join(cwd(), 'dist', backendName);
    case 'prod':
      // New layout (profile-aware): resources/<backend-name>/main.js
      // Legacy layout (old packages): resources/main.js
      return resolveFirstExistingPath([
        join(resourcesPath, backendName),
        resourcesPath,
      ]);
    default:
      return join(cwd(), 'dist', backendName);
  }
}

function getProductionFrontendPath(resourcesPath: string) {
  const frontendName = getFrontendName();

  if (frontendName === 'ng-tracker') {
    return join(resourcesPath, 'ng-tracker', 'browser', 'index.html');
  }

  return join(resourcesPath, frontendName, 'index.html');
}

function getDevFrontendPath() {
  const frontendName = getFrontendName();

  if (frontendName === 'ng-tracker') {
    return resolveFirstExistingPath([
      join(cwd(), 'dist', 'ng-tracker', 'browser', 'index.html'),
      join(cwd(), 'dist', 'ng-tracker', 'index.html'),
    ]);
  }

  return resolveFirstExistingPath([
    join(cwd(), 'dist', frontendName, 'index.html'),
    join(cwd(), 'apps', frontendName, 'dist', frontendName, 'index.html'),
  ]);
}

export {
  getRootBackendFolderPath,
  getProductionFrontendPath,
  getDevFrontendPath,
  getFrontendName,
  getBackendName,
};
