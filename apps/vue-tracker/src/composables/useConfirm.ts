import { useConfirm as usePrimeConfirm } from 'primevue/useconfirm';

export interface ConfirmOptions {
  title: string;
  message: string;
  acceptLabel?: string;
  rejectLabel?: string;
  severity?: 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';
}

export function useConfirmService() {
  const confirm = usePrimeConfirm();

  const showConfirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      confirm.require({
        message: options.message,
        header: options.title,
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: options.rejectLabel || 'Cancel',
        acceptLabel: options.acceptLabel || 'Confirm',
        rejectClass: 'p-button-secondary p-button-outlined',
        acceptClass: options.severity
          ? `p-button-${options.severity}`
          : 'p-button-danger',
        accept: () => resolve(true),
        reject: () => resolve(false),
      });
    });
  };

  return { showConfirm };
}
