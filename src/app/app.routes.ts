import { Routes } from '@angular/router';
import { FirstAccessPage } from '@app/auth/pages/first-access/first-access';
import { LoginPage } from '@app/auth/pages/login/login';
import { MainLayout } from '@app/shared/main-layout/main-layout';
import { UserFormPage } from '@app/user/pages/form/form';
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
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'users',
        component: UserListPage,
      },
      {
        path: 'users/register',
        component: UserFormPage,
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  }
];
