import './styles.css';
import 'primeicons/primeicons.css';
import router from './router';
import { createApp } from 'vue';
import App from './app/App.vue';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import Tooltip from 'primevue/tooltip';
import Lara from '@primevue/themes/lara';

const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Lara,
    options: {
      darkModeSelector: '.dark',
    },
  },
});
app.use(ConfirmationService);
app.directive('tooltip', Tooltip);

app.mount('#root');
