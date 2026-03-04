import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { OrderService } from '../../core/services/order.service';
import { ProductService } from '../../core/services/product.service';
import { UserService } from '../../core/services/user.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    NgChartsModule,
  ],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(8px)' }),
        animate(
          '280ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('listStagger', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(6px)' }),
        animate(
          '220ms 80ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class AdminDashboard implements OnInit {
  userCount?: number;
  productCount?: number;
  orderCount?: number;

  loadingStats = true;
  loadingLists = true;

  recentOrders: any[] = [];
  recentUsers: any[] = [];
  recentProducts: any[] = [];

  salesChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [12000, 15000, 10000, 18000, 22000, 25000],
        label: 'Sales (PKR)',
        fill: true,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.2)',
        pointBackgroundColor: '#2563eb',
        tension: 0.3,
      },
    ],
  };
  salesChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { mode: 'index', intersect: false },
    },
    interaction: { mode: 'nearest', axis: 'x', intersect: false },
  };

  constructor(
    private orders: OrderService,
    private products: ProductService,
    private users: UserService
  ) {}

  ngOnInit(): void {
    this.fetchStats();
    this.fetchLists();
  }

  private fetchStats() {
    this.loadingStats = true;

    this.users.getAllUsers().subscribe({
      next: (u) => {
        this.userCount = u.length;
      },
      error: () => {},
    });

    this.products.getAll().subscribe({
      next: (p) => {
        this.productCount = p.length;
      },
      error: () => {},
    });

    this.orders
      .getAll()
      .subscribe({
        next: (o) => {
          this.orderCount = o.length;
        },
        error: () => {},
      })
      .add(() => (this.loadingStats = false));
  }

  private fetchLists() {
    this.loadingLists = true;

    this.orders.getAll().subscribe({
      next: (o) => (this.recentOrders = [...o].slice(0, 5)),
      error: () => {},
    });

    this.users.getAllUsers().subscribe({
      next: (u) => (this.recentUsers = [...u].slice(0, 5)),
      error: () => {},
    });

    this.products
      .getAll()
      .subscribe({
        next: (p) => (this.recentProducts = [...p].slice(0, 5)),
        error: () => {},
      })
      .add(() => (this.loadingLists = false));
  }
}
