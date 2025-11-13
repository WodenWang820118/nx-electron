import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { PrimeReactProvider } from 'primereact/api';
import Lara from '@primevue/themes/lara';
import App from './app/app';
import './styles.css';
import 'primeicons/primeicons.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <PrimeReactProvider
      value={{
        theme: {
          preset: Lara,
          options: {
            darkModeSelector: '.dark',
          },
        },
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PrimeReactProvider>
  </StrictMode>
);