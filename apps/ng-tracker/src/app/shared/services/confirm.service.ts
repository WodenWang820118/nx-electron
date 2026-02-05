import { Injectable, signal } from '@angular/core';

export type ConfirmSeverity = 'info' | 'warn' | 'danger';

export interface ConfirmOptions {
  title?: string;
  message: string;
  acceptLabel?: string;
  rejectLabel?: string;
  severity?: ConfirmSeverity;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  readonly visible = signal(false);
  readonly options = signal<Required<ConfirmOptions>>({
    title: 'Confirm',
    message: 'Are you sure?',
    acceptLabel: 'OK',
    rejectLabel: 'Cancel',
    severity: 'info',
  });

  private resolver: ((value: boolean) => void) | null = null;

  confirm(opts: ConfirmOptions): Promise<boolean> {
    // Prevent overlapping dialogs; close any existing one resolving to false
    if (this.resolver) {
      this.resolver(false);
      this.resolver = null;
    }

    const merged = {
      title: opts.title ?? 'Confirm',
      message: opts.message,
      acceptLabel: opts.acceptLabel ?? 'OK',
      rejectLabel: opts.rejectLabel ?? 'Cancel',
      severity: opts.severity ?? 'info',
    } as Required<ConfirmOptions>;
    this.options.set(merged);
    this.visible.set(true);
    return new Promise<boolean>((resolve) => {
      this.resolver = resolve;
    });
  }

  accept(): void {
    if (this.resolver) {
      this.resolver(true);
      this.resolver = null;
    }
    this.visible.set(false);
  }

  reject(): void {
    if (this.resolver) {
      this.resolver(false);
      this.resolver = null;
    }
    this.visible.set(false);
  }

  onHide(): void {
    // Treat closing the dialog as a rejection if unresolved
    this.reject();
  }
}
