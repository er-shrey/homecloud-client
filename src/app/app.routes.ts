import { Routes } from '@angular/router';
import { loggedInUserGuard } from './core/guards/logged-in-user.guard';
import { loggedOutUserGuard } from './core/guards/logged-out-user.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [loggedOutUserGuard],
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'home',
    canActivate: [loggedInUserGuard],
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'settings',
    canActivate: [loggedInUserGuard],
    loadComponent: () =>
      import('./pages/settings/settings.component').then(
        (m) => m.SettingsComponent
      ),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
