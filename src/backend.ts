import { fork } from 'node:child_process';
import { join } from 'node:path';
import { BrowserWindow } from 'electron';
import * as constants from './constants';
import * as environmentUtils from './environment-utils';
import * as fileUtils from './file-utils';
import * as pathUtils from './path-utils';

function startBackend(resourcesPath: string) {
  let env: NodeJS.ProcessEnv;
  const backendName = pathUtils.getBackendName();
  const rootBackendFolderPath = pathUtils.getRootBackendFolderPath(
    environmentUtils.getEnvironment(),
    resourcesPath
  );

  fileUtils.logToFile(
    rootBackendFolderPath,
    `Starting backend service (${backendName})...`,
    'info'
  );

  const serverPath = join(rootBackendFolderPath, 'main.js');

  const databasePath = join(
    rootBackendFolderPath,
    constants.ROOT_DATABASE_NAME
  );

  switch (environmentUtils.getEnvironment()) {
    case 'dev':
      env = {
        ...process.env,
        DATABASE_PATH: databasePath,
        PORT: '3000',
        NODE_ENV: 'dev',
      };
      break;
    case 'staging':
      env = {
        ...process.env,
        DATABASE_PATH: databasePath,
        PORT: '3000',
        NODE_ENV: 'staging',
      };
      break;
    case 'prod':
    default:
      env = {
        ...process.env,
        DATABASE_PATH: databasePath,
        PORT: '5000',
        NODE_ENV: 'prod',
      };
      break;
  }

  fileUtils.logToFile(
    rootBackendFolderPath,
    `Starting server with environment: ${JSON.stringify(env, null, 2)}`
  );

  fileUtils.logToFile(
    rootBackendFolderPath,
    `Server path: ${serverPath}`,
    'info'
  );

  return fork(serverPath, { env });
}

async function checkIfPortIsOpen(
  urls: string[],
  resourcesPath: string,
  loadingWindow: BrowserWindow | null,
  maxAttempts?: number,
  timeout?: number,
) {
  const resolvedMaxAttempts = maxAttempts ?? 20;
  const resolvedTimeout = timeout ?? 1000;
  const logFilePath = join(
    pathUtils.getRootBackendFolderPath(
      environmentUtils.getEnvironment(),
      resourcesPath
    )
  );

  await new Promise((resolve) => setTimeout(resolve, 5000)); // await the backend to start
  fileUtils.logToFile(
    logFilePath,
    `Checking if ports are open: ${urls}`,
    'info'
  );
  for (let attempt = 1; attempt <= resolvedMaxAttempts; attempt++) {
    for (const url of urls) {
      try {
        fileUtils.logToFile(
          logFilePath,
          `Attempt ${attempt}: Checking port: ${url}`,
          'info'
        );

        const response = await fetch(url);

        console.log('Response status:', response.status);

        const responseData = await response.text();
        console.log('Response body:', responseData);

        fileUtils.logToFile(logFilePath, responseData, 'info');

        if (response.ok) {
          console.log('Server is ready');
          fileUtils.logToFile(
            logFilePath,
            `Server is ready: ${responseData}`,
            'info'
          );
          return true; // Port is open
        } else {
          console.log(`Server responded with status: ${response.status}`);
          fileUtils.logToFile(
            logFilePath,
            `Server responded with status: ${response.status}`,
            'warning'
          );
        }
      } catch (error) {
        console.error(`Attempt ${attempt}: Error connecting to ${url}:`, error);
        fileUtils.logToFile(
          logFilePath,
          `Attempt ${attempt}: ${(error as any).toString()}`,
          'error'
        );
      }
    }

    if (attempt < resolvedMaxAttempts) {
      console.log(`Waiting ${resolvedTimeout}ms before next attempt...`);
      await new Promise((resolve) => setTimeout(resolve, resolvedTimeout));
    }
  }

  loadingWindow?.close();
  throw new Error(
    `Failed to connect to the server after ${resolvedMaxAttempts} attempts`
  );
}

export {
  startBackend,
  checkIfPortIsOpen,
};
