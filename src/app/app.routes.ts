import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  // 🔹 Default login route
  {
    path: '',
    loadComponent: () =>
      import('./auth/components/login/login').then((m) => m.Login),
  },

  // 🔹 Forgot Password route
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./auth/components/forget/forget').then((m) => m.Forget),
  },

  // 🔹 Email Verification route (NEW ✅)
  {
    path: 'verify-email',
    loadComponent: () =>
      import('./auth/verify-email/verify-email').then(
        (m) => m.VerifyEmail
      ),
  },

  // 🔹 Authenticated User Area
  {
    path: 'app',
    loadComponent: () => import('./layout/home/home').then((m) => m.Home),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./client/dashboard-home/dashboard-home').then(
            (m) => m.DashboardHome
          ),
      },
      {
        path: 'ai-assistant',
        loadComponent: () =>
          import('./client/chat-component/chat-component').then(
            (m) => m.ChatComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./client/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./client/products/product-list/product-list').then(
            (m) => m.ProductList
          ),
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./client/products/product-detail/product-detail').then(
            (m) => m.ProductDetail
          ),
      },
      {
        path: 'cart',
        loadComponent: () => import('./client/cart/cart').then((m) => m.Cart),
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./client/checkout/checkout').then((m) => m.Checkout),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./client/orders/order-list/order-list').then(
            (m) => m.OrderList
          ),
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import('./client/orders/order-detail/order-detail').then(
            (m) => m.OrderDetail
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // 🔹 Admin Area
  {
    path: 'admin',
    loadComponent: () =>
      import('./layout/dashboard-layout/dashboard-layout').then(
        (m) => m.DashboardLayout
      ),
    canActivate: [authGuard, roleGuard(['admin'])],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./admin/admin-dashboard/admin-dashboard').then(
            (m) => m.AdminDashboard
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./admin/users/admin-users/admin-users').then(
            (m) => m.AdminUsers
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./admin/products/admin-products/admin-products').then(
            (m) => m.AdminProducts
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./admin/orders/admin-orders/admin-orders').then(
            (m) => m.AdminOrders
          ),
      },
    ],
  },

  // 🔹 Fallback route
  { path: '**', redirectTo: '' },
];
