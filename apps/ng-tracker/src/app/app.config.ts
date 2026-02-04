import {
  ApplicationConfig,
  provideZonelessChangeDetection,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import Aura from '@primeuix/themes/aura';
import { ThemeService } from './shared/services/theme.service';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES),
    provideHttpClient(),
    MessageService,
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          // Use a class selector so we can toggle dark mode manually
          darkModeSelector: '.app-dark',
          cssLayer: false,
        },
      },
    }),
    provideZonelessChangeDetection(),
    provideAnimationsAsync(),
    provideAppInitializer(() => {
      const theme = inject(ThemeService);
      // Trigger the effect to apply stored/system theme early
      theme.mode();
    }),
  ],
};
