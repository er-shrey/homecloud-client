import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const loggedOutUserGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (localStorage.getItem('isLoggedIn') === 'true') {
    return router.createUrlTree(['/home']);
  }

  return true;
};
