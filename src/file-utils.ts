import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
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

function writeStartupSummary(path: string, summary: string) {
  const summaryPath = join(path, 'startup-summary.txt');
  const timestamp = new Date().toISOString();
  const content = `=== Application Startup Summary ===\nGenerated: ${timestamp}\n\n${summary}\n`;

  try {
    mkdirSync(path, { recursive: true });
    writeFileSync(summaryPath, content);
  } catch (error) {
    console.error('Failed to write startup summary:', error);
  }
}

export {
  logToFile,
  writeStartupSummary,
};
