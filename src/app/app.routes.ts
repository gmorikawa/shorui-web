import { Routes } from '@angular/router';
import { FirstAccessPage } from '@app/auth/pages/first-access/first-access';
import { LoginPage } from '@app/auth/pages/login/login';
import { Menu } from '@app/menu/menu';
import { UserListPage } from '@app/user/pages/list/list';

export const routes: Routes = [
  {
    path: 'auth/first-access',
    component: FirstAccessPage,
  },
  {
    path: 'auth/login',
    component: LoginPage,
  },
  {
    path: 'menu',
    component: Menu,
  },
  {
    path: 'users',
    component: UserListPage,
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  }
];
