/*
  Converted from prepare-spring-dist.mjs to TypeScript
  - Keeps original synchronous semantics
  - Adds //#region blocks for clearer editor folding
*/

//#region Imports
import {
  existsSync,
  mkdirSync,
  readdirSync,
  copyFileSync,
  writeFileSync,
  unlinkSync,
  rmSync,
  Dirent,
} from 'node:fs';
import { resolve, join } from 'node:path';
//#endregion

//#region Utilities
function ensureDir(path: string): void {
  if (!existsSync(path)) mkdirSync(path, { recursive: true });
}

function pickJar(targetDir: string): string | null {
  if (!existsSync(targetDir)) return null;

  const entries: Dirent[] = readdirSync(targetDir, { withFileTypes: true });
  const jars = entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((n) => n.toLowerCase().endsWith('.jar'))
    .filter((n) => !n.toLowerCase().endsWith('.jar.original'))
    .filter((n) => !n.toLowerCase().includes('sources'))
    .filter((n) => !n.toLowerCase().includes('javadoc'))
    .sort((a, b) => a.localeCompare(b));

  if (jars.length === 0) return null;
  return join(targetDir, jars[jars.length - 1]);
}
//#endregion

//#region Main
function main(): void {
  // Maven output directory for this repo's pom.xml is workspaceRoot/target by default.
  // Keep apps/spring-backend/target as a fallback for older layouts.
  const rootTarget = resolve('target');
  const appTarget = resolve('apps/spring-backend/target');

  const jar = pickJar(rootTarget) ?? pickJar(appTarget);
  if (!jar) {
    throw new Error(
      `No .jar found under ${rootTarget} or ${appTarget}. Did "mvn -f pom.xml package" run?`,
    );
  }

  const distDir = resolve('dist/spring-backend');
  ensureDir(distDir);

  // Remove old app/ folder if it exists (duplicate jar)
  const appFolder = join(distDir, 'app');
  if (existsSync(appFolder)) {
    try {
      rmSync(appFolder, { recursive: true, force: true });
      console.log('Removed duplicate app/ folder');
    } catch (err: unknown) {
      const msg = (err as Error)?.message ?? String(err);
      console.warn('Warning: Could not remove app/ folder:', msg);
    }
  }

  // Stable filename for runtime discovery & packaging.
  const dest = join(distDir, 'app.jar');
  copyFileSync(jar, dest);

  // Clean up old log files and create empty ones
  const errorLog = join(distDir, 'error.log');
  const infoLog = join(distDir, 'info.log');

  try {
    if (existsSync(errorLog)) unlinkSync(errorLog);
    if (existsSync(infoLog)) unlinkSync(infoLog);
  } catch (err: unknown) {
    const msg = (err as Error)?.message ?? String(err);
    console.warn('Warning: Could not remove old log files:', msg);
  }

  writeFileSync(errorLog, '', 'utf8');
  writeFileSync(infoLog, '', 'utf8');

  console.log(`Spring backend jar copied to ${dest}`);
  console.log('Log files cleaned and reset');
}

// If executed directly with ts-node or after compilation, run main.
// Exported for programmatic usage and tests.
export { main };

// Run immediately when invoked as a script (e.g. `ts-node tools/prepare-spring-dist.ts`).
// Calling unconditionally is acceptable for small build scripts.
main();
//#endregion
