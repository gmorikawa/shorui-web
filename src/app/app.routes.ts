import { Routes } from '@angular/router';
import { FirstAccessComponent } from '@app/auth/first-access/first-access';
import { LoginComponent } from '@app/auth/login/login';
import { Menu } from '@app/menu/menu';
import { UserListPage } from '@app/user/pages/list/list';

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
