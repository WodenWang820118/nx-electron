
import { app, BrowserWindow } from 'electron';
import { join } from 'node:path';
import { updateElectronApp } from 'update-electron-app';
import { ChildProcess } from 'node:child_process';
import log from 'electron-log';
import * as pathUtils from './path-utils';
import * as environmentUtils from './environment-utils';
import * as backend from './backend';
import * as frontend from './frontend';
import * as constants from './constants';
import * as fileUtils from './file-utils';

updateElectronApp({
  updateInterval: '1 hour',
  logger: log,
}); // additional configuration options available

let server: ChildProcess;

app.whenReady().then(async () => {
  server = backend.startBackend(process.resourcesPath);
  const loadingWindow = frontend.createLoadingWindow();
  server.once('spawn', async () => {
    try {
      if (
        await backend.checkIfPortIsOpen(
          constants.URLs,
          process.resourcesPath,
          loadingWindow,
          20,
          2000,
        )
      ) {
        loadingWindow?.close();
        frontend.createWindow(
          process.resourcesPath
        );
      }
    } catch (error) {
      console.error(error);
      fileUtils.logToFile(
        join(
          pathUtils.getRootBackendFolderPath(
            environmentUtils.getEnvironment(),
            process.resourcesPath
          )
        ),
        String(error),
        'error'
      );
    }
  });

  server.on('message', (message: string) => {
    console.log(`Message from child: ${message}`);
    fileUtils.logToFile(
      join(
        pathUtils.getRootBackendFolderPath(
          environmentUtils.getEnvironment(),
          process.resourcesPath
        )
      ),
      message,
      'info'
    );
  });

  server.on('error', (error: string) => {
    console.error(`Error from child: ${error}`);
    fileUtils.logToFile(
      join(
        pathUtils.getRootBackendFolderPath(
          environmentUtils.getEnvironment(),
          process.resourcesPath
        )
      ),
      error,
      'error'
    );
  });

  server.on('exit', (code: any, signal: any) => {
    console.log(`Child exited with code ${code} and signal ${signal}`);
    fileUtils.logToFile(
      join(
        pathUtils.getRootBackendFolderPath(
          environmentUtils.getEnvironment(),
          process.resourcesPath
        )
      ),
      `Child exited with code ${code} and signal ${signal}`,
      'error'
    );
  });
});

app.on('before-quit', async () => {
  // Perform any necessary cleanup here
  console.log('App is about to quit. Performing cleanup...');
  fileUtils.logToFile(
    join(
      pathUtils.getRootBackendFolderPath(
        environmentUtils.getEnvironment(),
        process.resourcesPath
      )
    ),
    'App is about to quit. Performing cleanup...',
    'info'
  );
  if (server) {
    server.kill();
  }

  // Wait for all asynchronous operations to complete
  await new Promise((resolve) => {
    setTimeout(resolve, 1000); // Adjust the timeout as needed
  });

  // Quit the app
  app.quit();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    // createWindow();
  }
});
