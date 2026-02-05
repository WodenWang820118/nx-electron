import { MakerZIP } from '@electron-forge/maker-zip';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { VitePlugin } from '@electron-forge/plugin-vite';

const APP_PROFILE = (process.env.APP_PROFILE || 'ng-nest').trim().toLowerCase();

const PROFILES = {
  /** Angular + Nest backend (default) */
  'ng-nest': {
    extraResource: [
      './dist/ng-tracker',
      // Backend is expected to live at process.resourcesPath/<backend-name> (see src/path-utils.ts)
      './dist/nest-backend',
    ],
  },

  /** Angular + Express backend */
  'ng-express': {
    extraResource: ['./dist/ng-tracker', './dist/express-backend'],
  },

  /** Angular + Spring backend */
  'ng-spring': {
    extraResource: ['./dist/ng-tracker', './dist/spring-backend'],
  },

  /** Vue + Nest backend */
  'vue-nest': {
    extraResource: ['./dist/vue-tracker', './dist/nest-backend'],
  },

  /** Vue + Express backend */
  'vue-express': {
    extraResource: ['./dist/vue-tracker', './dist/express-backend'],
  },

  /** Vue + Spring backend */
  'vue-spring': {
    extraResource: ['./dist/vue-tracker', './dist/spring-backend'],
  },

  /** React + Nest backend */
  'react-nest': {
    extraResource: ['./dist/react-tracker', './dist/nest-backend'],
  },

  /** React + Express backend */
  'react-express': {
    extraResource: ['./dist/react-tracker', './dist/express-backend'],
  },

  /** React + Spring backend */
  'react-spring': {
    extraResource: ['./dist/react-tracker', './dist/spring-backend'],
  },

  /** Backward-compatible: package everything (larger output) */
  all: {
    extraResource: [
      './dist/ng-tracker',
      './dist/vue-tracker',
      './dist/react-tracker',
      './dist/nest-backend',
      './dist/express-backend',
    ],
  },
};

const resolvedProfile = PROFILES[APP_PROFILE] ?? PROFILES['ng-nest'];
const needsJavaRuntime = APP_PROFILE.includes('spring');

const config = {
  packagerConfig: {
    // Ensure artifacts are unique per profile when running multiple publishes.
    // MakerZIP derives its output zip name from the packaged app directory name.
    name: `electron-tracker-suite-${APP_PROFILE}`,
    asar: true,
    extraResource: [
      ...resolvedProfile.extraResource,
      ...(needsJavaRuntime ? ['./dist/java-runtime'] : []),
    ],
  },
  rebuildConfig: {},
  makers: [new MakerZIP({}, ['darwin', 'linux', 'win32'])],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'WodenWang820118',
          name: 'nx-ng-nest-electron',
        },
        prerelease: false,
      },
    },
  ],
};

export default config;
