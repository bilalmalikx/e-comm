import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export function roleGuard(allowedRoles: string[]): CanActivateFn {
  return (route, state) => {
    const router = inject(Router);
    const user = localStorage.getItem('user');
    const userRole = user ? JSON.parse(user).role : null;

    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    } else {
      router.navigate(['/app/dashboard']);
      return false;
    }
  };
}
