import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './success-modal.html',
  styleUrls: ['./success-modal.scss'],
})
export class SuccessModal {
  constructor(
    public dialogRef: MatDialogRef<SuccessModal>,
    @Inject(MAT_DIALOG_DATA)
    public data: { type: string; title: string; message: string }
  ) {}
}
