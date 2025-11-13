import { confirmDialog } from 'primereact/confirmdialog';

export const useConfirm = () => {
  const confirm = (options: {
    message: string;
    header?: string;
    icon?: string;
    accept?: () => void;
    reject?: () => void;
  }) => {
    confirmDialog({
      message: options.message,
      header: options.header || 'Confirmation',
      icon: options.icon || 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept: options.accept,
      reject: options.reject,
    });
  };

  return { confirm };
};
