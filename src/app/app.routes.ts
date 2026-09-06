import { Routes } from '@angular/router';
import { FirstAccessPage } from '@app/auth/pages/first-access/first-access';
import { LoginPage } from '@app/auth/pages/login/login';
import { AttributeFormPage } from '@app/attribute/pages/form/form';
import { AttributeListPage } from '@app/attribute/pages/list/list';
import { DocumentFormPage } from '@app/document/pages/form/form';
import { DocumentListPage } from '@app/document/pages/list/list';
import { DocumentTypeFormPage } from '@app/document-type/pages/form/form';
import { DocumentTypeListPage } from '@app/document-type/pages/list/list';
import { MainLayout } from '@app/shared/components/main-layout/main-layout';
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
    path: 'app',
    component: MainLayout,
    children: [
      {
        path: 'users',
        component: UserListPage,
      },
      {
        path: 'users/form',
        component: UserFormPage,
      },
      {
        path: 'users/form/:id',
        component: UserFormPage,
      },
      {
        path: 'documents',
        component: DocumentListPage,
      },
      {
        path: 'documents/register',
        component: DocumentFormPage,
      },
      {
        path: 'documents/register/:id',
        component: DocumentFormPage,
      },
      {
        path: 'document-types',
        component: DocumentTypeListPage,
      },
      {
        path: 'document-types/register',
        component: DocumentTypeFormPage,
      },
      {
        path: 'document-types/register/:id',
        component: DocumentTypeFormPage,
      },
      {
        path: 'attributes',
        component: AttributeListPage,
      },
      {
        path: 'attributes/form',
        component: AttributeFormPage,
      },
      {
        path: 'attributes/form/:key',
        component: AttributeFormPage,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  }
];
