import { join } from 'node:path';
import { cwd } from 'node:process';
import { existsSync } from 'node:fs';

type FrontendName = 'ng-tracker' | 'vue-tracker' | 'react-tracker';
type BackendName = 'nest-backend' | 'express-backend' | 'spring-backend';

const KNOWN_FRONTENDS: FrontendName[] = ['ng-tracker', 'vue-tracker', 'react-tracker'];
const KNOWN_BACKENDS: BackendName[] = ['nest-backend', 'express-backend', 'spring-backend'];

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

function inferFrontendNameFromProfile(profile?: string): FrontendName {
  const normalized = (profile || '').trim().toLowerCase();
  if (!normalized) return 'ng-tracker';

  if (normalized.includes('vue')) return 'vue-tracker';
  if (normalized.includes('react')) return 'react-tracker';
  if (normalized.includes('ng') || normalized.includes('angular')) return 'ng-tracker';

  return 'ng-tracker';
}

function getFrontendName(): FrontendName {
  // FRONTEND takes precedence for local overrides.
  if (process.env.FRONTEND) {
    return normalizeFrontendName(process.env.FRONTEND);
  }

  // Otherwise infer from APP_PROFILE (e.g. ng-nest, vue-express, react-spring).
  return inferFrontendNameFromProfile(process.env.APP_PROFILE);
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

function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function resolveBackendFolderInProd(resourcesPath: string): string {
  const preferredFromEnv = process.env.BACKEND
    ? normalizeBackendName(process.env.BACKEND)
    : undefined;
  const preferredFromProfile = inferBackendNameFromProfile(process.env.APP_PROFILE);

  const orderedNames = unique(
    [preferredFromEnv, preferredFromProfile, ...KNOWN_BACKENDS].filter(isDefined)
  );

  const candidates: string[] = orderedNames.map((name) => join(resourcesPath, name));

  // Legacy layout support: only consider resourcesPath itself if it actually contains main.js
  const legacyMain = join(resourcesPath, 'main.js');
  if (existsSync(legacyMain)) {
    candidates.push(resourcesPath);
  }

  return resolveFirstExistingPath(candidates);
}

function getRootBackendFolderPath(env: string, resourcesPath: string) {
  const backendName = getBackendName();

  switch (env) {
    case 'dev':
    case 'staging':
      return join(cwd(), 'dist', backendName);
    case 'prod':
      // New layout (profile-aware): resources/<backend-name>/...
      // Legacy layout (old packages): resources/main.js
      return resolveBackendFolderInProd(resourcesPath);
    default:
      return join(cwd(), 'dist', backendName);
  }
}

function getProductionFrontendPath(resourcesPath: string) {
  const preferredFromEnv = process.env.FRONTEND
    ? normalizeFrontendName(process.env.FRONTEND)
    : undefined;
  const preferredFromProfile = inferFrontendNameFromProfile(process.env.APP_PROFILE);
  const orderedNames = unique(
    [preferredFromEnv, preferredFromProfile, ...KNOWN_FRONTENDS].filter(isDefined)
  );

  const candidatePaths: string[] = [];
  for (const name of orderedNames) {
    if (name === 'ng-tracker') {
      candidatePaths.push(
        join(resourcesPath, 'ng-tracker', 'browser', 'index.html'),
        join(resourcesPath, 'ng-tracker', 'index.html')
      );
    } else {
      candidatePaths.push(join(resourcesPath, name, 'index.html'));
    }
  }

  return resolveFirstExistingPath(candidatePaths);
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
