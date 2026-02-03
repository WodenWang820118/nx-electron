import { join } from 'path';
import { cwd } from 'process';
import { existsSync } from 'fs';

type FrontendName = 'ng-tracker' | 'vue-tracker' | 'react-tracker';

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

function resolveFirstExistingPath(paths: string[]) {
  for (const candidate of paths) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return paths[0];
}

function getRootBackendFolderPath(env: string, resourcesPath: string) {
  switch (env) {
    case 'dev':
    case 'staging':
      return join(cwd(), 'dist', 'nest-backend');
    case 'prod':
      return resourcesPath;
    default:
      return join(cwd(), 'dist', 'nest-backend');
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
};
