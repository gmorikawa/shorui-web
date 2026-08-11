import { Routes } from '@angular/router';
import { FirstAccessComponent } from './auth/first-access/first-access';
import { LoginComponent } from './auth/login/login';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
  {
    path: 'auth/first-access',
    component: FirstAccessComponent,
  },
  {
    path: 'auth/login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: Dashboard,
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  }
];
