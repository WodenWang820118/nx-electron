import { appendFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

function logToFile(path: string, message: string, type = 'info') {
  const logPath = join(path, `${type}.log`);
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${type.toUpperCase()}: ${message}\n`;

  try {
    mkdirSync(path, { recursive: true });
    appendFileSync(logPath, logMessage);
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
}

export {
  logToFile,
};
