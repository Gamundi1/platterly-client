import { inject, Service } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorModalComponent } from '../components/error-modal/error-modal.component';

@Service()
export class ErrorService {
  private readonly matDialog = inject(MatDialog);

  private errorComponentRef: MatDialogRef<ErrorModalComponent> | null = null;

  showErrorModal(
    error: { code: string; label: string; message: string },
    actionLabel?: string,
    buttonCallback?: () => void,
  ) {
    this.errorComponentRef = this.matDialog.open(ErrorModalComponent, {
      data: {
        title: error.label,
        message: error.message,
        actionLabel: actionLabel,
        buttonCallback: buttonCallback,
      },
      disableClose: true,
      panelClass: 'error-modal',
    });
  }

  closeErrorModal() {
    if (this.errorComponentRef) {
      this.errorComponentRef.close();
    }
  }
}
