import { CanActivateFn } from '@angular/router';

export const loggedInUserGuard: CanActivateFn = (route, state) => {
  return localStorage.getItem('isLoggedIn') === 'true';
};
