import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SuccessModal } from '../../client/success-modal/success-modal';

@Injectable({ providedIn: 'root' })
export class MaterialSuccessService {
  constructor(private dialog: MatDialog) {}

  show(
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' = 'success',
    duration: number = 3000
  ) {
    const dialogRef = this.dialog.open(SuccessModal, {
      width: '400px',
      position: { top: '20px' },
      panelClass: 'notification-dialog',
      data: { title, message, type },
      disableClose: true,
    });

    setTimeout(() => dialogRef.close(), duration);
  }

  success(title: string, message: string, duration: number = 3000) {
    this.show(title, message, 'success', duration);
  }
  error(title: string, message: string, duration: number = 3000) {
    this.show(title, message, 'error', duration);
  }
  info(title: string, message: string, duration: number = 3000) {
    this.show(title, message, 'info', duration);
  }
}
