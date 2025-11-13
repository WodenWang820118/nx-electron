import { Component, computed, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ConfirmService } from '../services/confirm.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  template: `
    <p-dialog
      [visible]="visible()"
      [modal]="true"
      [draggable]="false"
      [closable]="false"
      [style]="{ width: '24rem' }"
      [header]="opts().title"
      (onHide)="confirm.onHide()"
    >
      <div class="space-y-2">
        <p class="text-gray-800 dark:text-slate-200">{{ opts().message }}</p>
      </div>
      <ng-template pTemplate="footer">
        <div class="flex justify-end gap-2">
          <p-button
            [label]="opts().rejectLabel"
            severity="secondary"
            outlined
            (onClick)="confirm.reject()"
          />
          <p-button
            [label]="opts().acceptLabel"
            [severity]="acceptSeverity()"
            (onClick)="confirm.accept()"
          />
        </div>
      </ng-template>
    </p-dialog>
  `,
})
export class ConfirmDialogComponent {
  readonly confirm = inject(ConfirmService);
  visible = computed(() => this.confirm.visible());
  opts = computed(() => this.confirm.options());

  acceptSeverity(): 'primary' | 'danger' {
    const s = this.opts().severity;
    return s === 'danger' ? 'danger' : 'primary';
  }
}
