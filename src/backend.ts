import { fork, spawn, type ChildProcess } from 'node:child_process';
import { join } from 'node:path';
import { BrowserWindow } from 'electron';
import * as constants from './constants';
import * as environmentUtils from './environment-utils';
import * as fileUtils from './file-utils';
import * as pathUtils from './path-utils';

function resolveDefaultPortForEnvironment(env: string) {
  switch (env) {
    case 'dev':
    case 'staging':
      return '3000';
    case 'prod':
    default:
      return '5000';
  }
}

function resolveJavaCommand() {
  const javaHome = process.env.JAVA_HOME;
  if (javaHome) {
    // JAVA_HOME on Windows points to the JDK root; java is under bin.
    return join(javaHome, 'bin', process.platform === 'win32' ? 'java.exe' : 'java');
  }

  return process.platform === 'win32' ? 'java.exe' : 'java';
}

function startSpringBackend(
  rootBackendFolderPath: string,
  env: NodeJS.ProcessEnv,
  port: string
): ChildProcess {
  const jarPath = join(rootBackendFolderPath, 'app.jar');
  const javaCmd = resolveJavaCommand();
  const springProfile = env.SPRING_PROFILES_ACTIVE ?? env.NODE_ENV ?? 'prod';
  const args = ['-jar', jarPath, `--server.port=${port}`, `--spring.profiles.active=${springProfile}`];

  fileUtils.logToFile(
    rootBackendFolderPath,
    `Starting Spring backend: ${javaCmd} ${args.join(' ')}`,
    'info'
  );

  const child = spawn(javaCmd, args, {
    env: {
      ...env,
      SERVER_PORT: port,
      SPRING_PROFILES_ACTIVE: springProfile,
    },
  });

  child.stdout?.on('data', (buf) => {
    fileUtils.logToFile(rootBackendFolderPath, buf.toString(), 'info');
  });
  child.stderr?.on('data', (buf) => {
    fileUtils.logToFile(rootBackendFolderPath, buf.toString(), 'error');
  });

  return child;
}

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

  const runtimeEnv = environmentUtils.getEnvironment();
  const resolvedPort =
    (process.env.PORT && String(process.env.PORT)) ||
    resolveDefaultPortForEnvironment(runtimeEnv);

  env = {
    ...process.env,
    DATABASE_PATH: databasePath,
    PORT: resolvedPort,
    NODE_ENV: runtimeEnv,
    // Ensure backend identification is available to child processes
    BACKEND: backendName,
    APP_PROFILE: process.env.APP_PROFILE || '',
  };

  fileUtils.logToFile(
    rootBackendFolderPath,
    `Starting server with environment: ${JSON.stringify(env, null, 2)}`
  );

  if (backendName === 'spring-backend') {
    const jarPath = join(rootBackendFolderPath, 'app.jar');
    fileUtils.logToFile(rootBackendFolderPath, `Server path: ${jarPath}`, 'info');
    return startSpringBackend(rootBackendFolderPath, env, resolvedPort);
  }

  fileUtils.logToFile(rootBackendFolderPath, `Server path: ${serverPath}`, 'info');
  return fork(serverPath, { env });
}

async function checkIfPortIsOpen(
  urls: string[],
  resourcesPath: string,
  loadingWindow: BrowserWindow | null,
  maxAttempts = 20,
  timeout = 1000,
) {
  const resolvedMaxAttempts = maxAttempts;
  const resolvedTimeout = timeout;
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
          `Attempt ${attempt}: ${String(error)}`,
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
