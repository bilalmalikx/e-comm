import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { LoaderService } from '../../../core/services/loader.service';
import { MaterialSuccessService } from '../../../core/services/success.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './admin-users.html',
  styleUrls: ['./admin-users.scss'],
})
export class AdminUsers implements OnInit {
  displayedColumns = ['id', 'name', 'email', 'phone', 'role', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  loading = false;
  filterValue = '';

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor(
    private userService: UserService,
    private loader: LoaderService,
    private toast: MaterialSuccessService
  ) {}

  ngOnInit(): void {
    this.loader.loading$.subscribe((state) => (this.loading = state));

    this.dataSource.filterPredicate = (data: any, filter: string) =>
      data.name?.toLowerCase().includes(filter);

    this.load();
  }

  load() {
    this.loader.show();
    this.userService.getAllUsers().subscribe({
      next: (res: any[]) => {
        this.dataSource.data = res || [];
        setTimeout(() => {
          if (this.paginator) this.dataSource.paginator = this.paginator;
          if (this.sort) this.dataSource.sort = this.sort;
        });
      },
      error: () => {
        this.toast.error('Failed ❌', 'Could not load users');
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

  deleteUser(id: number) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    this.loader.show();
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.toast.success('Deleted ✅', 'User removed successfully');
        this.load();
      },
      error: () => {
        this.toast.error('Failed ❌', 'Delete failed');
        this.loader.hide();
      },
    });
  }
}
