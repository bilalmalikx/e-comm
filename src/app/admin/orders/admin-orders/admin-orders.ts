import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { LoaderService } from '../../../core/services/loader.service';
import { MaterialSuccessService } from '../../../core/services/success.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
  ],
  templateUrl: './admin-orders.html',
  styleUrls: ['./admin-orders.scss'],
})
export class AdminOrders implements OnInit {
  displayedColumns = ['id', 'customer', 'status', 'total', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  loading = false;
  filterValue = '';

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor(
    private orderService: OrderService,
    private loader: LoaderService,
    private toast: MaterialSuccessService
  ) {}

  ngOnInit(): void {
    this.loader.loading$.subscribe((state) => (this.loading = state));
    this.dataSource.filterPredicate = (data: any, filter: string) =>
      (data.customerName || data.user?.name || '')
        .toLowerCase()
        .includes(filter);

    this.load();
  }

  load() {
    this.loader.show();
    this.orderService.getAll().subscribe({
      next: (res: any[]) => {
        this.dataSource.data = res || [];
        setTimeout(() => {
          if (this.paginator) this.dataSource.paginator = this.paginator;
          if (this.sort) this.dataSource.sort = this.sort;
        });
      },
      error: () => {
        this.toast.error('Failed ❌', 'Could not load orders');
        this.loader.hide();
      },
      complete: () => this.loader.hide(),
    });
  }

  applyFilter() {
    this.dataSource.filter = (this.filterValue || '').trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteOrder(id: number) {
    if (!confirm('Are you sure you want to delete this order?')) return;
    this.loader.show();
    this.orderService.delete(id).subscribe({
      next: () => {
        this.toast.success('Deleted ✅', 'Order removed successfully');
        this.load();
      },
      error: () => {
        this.toast.error('Failed ❌', 'Delete failed');
        this.loader.hide();
      },
    });
  }

  statusClass(status: string) {
    return {
      completed: status?.toLowerCase() === 'completed',
      pending: status?.toLowerCase() === 'pending',
      cancelled: status?.toLowerCase() === 'cancelled',
    };
  }
}
