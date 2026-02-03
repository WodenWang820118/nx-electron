import { existsSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

function ensureDir(path) {
  if (!existsSync(path)) mkdirSync(path, { recursive: true });
}

function pickJar(targetDir) {
  if (!existsSync(targetDir)) return null;

  const entries = readdirSync(targetDir, { withFileTypes: true });
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

function main() {
  // Maven output directory for this repo's pom.xml is workspaceRoot/target by default.
  // Keep apps/spring-backend/target as a fallback for older layouts.
  const rootTarget = resolve('target');
  const appTarget = resolve('apps/spring-backend/target');

  const jar = pickJar(rootTarget) ?? pickJar(appTarget);
  if (!jar) {
    throw new Error(
      `No .jar found under ${rootTarget} or ${appTarget}. Did "mvn -f pom.xml package" run?`
    );
  }

  const distDir = resolve('dist/spring-backend');
  ensureDir(distDir);

  // Stable filename for runtime discovery & packaging.
  const dest = join(distDir, 'app.jar');
  copyFileSync(jar, dest);

  console.log(`Spring backend jar copied to ${dest}`);
}

main();
