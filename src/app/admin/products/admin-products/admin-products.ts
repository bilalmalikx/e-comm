import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { ProductDialog } from '../product-dialog/product-dialog';
import { SuccessModal } from '../../../client/success-modal/success-modal';
import { MaterialSuccessService } from '../../../core/services/success.service';
import { LoaderService } from '../../../core/services/loader.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './admin-products.html',
  styleUrls: ['./admin-products.scss'],
})
export class AdminProducts implements OnInit, AfterViewInit {
  displayedColumns = [
    'id',
    'name',
    'description',
    'price',
    'currency',
    'stock',
    'image_url',
    'actions',
  ];

  dataSource = new MatTableDataSource<Product>([]);
  filterValue = '';
  loading$!: Observable<boolean>;

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor(
    private productService: ProductService,
    private toast: MaterialSuccessService,
    private dialog: MatDialog,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.loading$ = this.loader.loading$;
    this.load();
  }

  ngAfterViewInit(): void {
    this.dataSource.filterPredicate = (data: Product, filter: string) =>
      (data.name || '').toLowerCase().includes(filter.trim().toLowerCase());

    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) this.dataSource.sort = this.sort;
  }

  applyFilter() {
    this.dataSource.filter = (this.filterValue || '').trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  load() {
    this.loader.show();
    this.productService.getAll().subscribe({
      next: (res: Product[]) => {
        this.dataSource.data = res || [];
        setTimeout(() => {
          if (this.paginator) this.dataSource.paginator = this.paginator;
          if (this.sort) this.dataSource.sort = this.sort;
        });
      },
      error: () => this.toast.error('Failed ❌', 'Could not load products'),
      complete: () => this.loader.hide(),
    });
  }

  addProduct() {
    const dialogRef = this.dialog.open(ProductDialog, { width: '500px' });
    dialogRef.afterClosed().subscribe((result: Product | undefined) => {
      if (result) {
        this.loader.show();
        this.productService.create(result).subscribe({
          next: () => {
            this.toast.success('Created ✅', 'Product added successfully');
            this.load();
          },
          error: () =>
            this.toast.error('Failed ❌', 'Could not create product'),
          complete: () => this.loader.hide(),
        });
      }
    });
  }

  editProduct(product: Product) {
    const dialogRef = this.dialog.open(ProductDialog, {
      width: '500px',
      data: product,
    });
    dialogRef.afterClosed().subscribe((result: Product | undefined) => {
      if (result && product.id) {
        this.loader.show();
        this.productService.update(product.id, result).subscribe({
          next: () => this.load(),
          error: () =>
            this.toast.error('failed', 'failed to update the product ❌'),
          complete: () => this.loader.hide(),
        });
      }
    });
  }

  deleteProduct(id: number) {
    if (!confirm('Delete this product?')) return;
    this.loader.show();
    this.productService.delete(id).subscribe({
      next: () => {
        this.toast.success('Deleted ✅', 'Product removed');
        this.load();
      },
      error: () => this.toast.error('Failed ❌', 'Delete failed'),
      complete: () => this.loader.hide(),
    });
  }
}
