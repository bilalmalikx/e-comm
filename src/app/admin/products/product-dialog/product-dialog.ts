import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './product-dialog.html',
  styleUrls: ['./product-dialog.scss'],
})
export class ProductDialog {
  product: Product;

  constructor(
    private dialogRef: MatDialogRef<ProductDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Product | null
  ) {
    this.product = data
      ? { ...data }
      : { name: '', description: '', price: 0, currency: 'PKR', stock: 0 };
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    if (!this.product.name || !this.product.price) return;
    this.dialogRef.close(this.product);
  }
}
