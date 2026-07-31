import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { authGuard } from './core/guards/auth-guard';
import { CategoryList } from './features/category/category-list/category-list';
import { CategoryForm } from './features/category/category-form/category-form';
import { SubcategoryList } from './features/subcategory/subcategory-list/subcategory-list';
import { SubcategoryForm } from './features/subcategory/subcategory-form/subcategory-form';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },

  {
    path: '',
    component: AdminLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'categories',
        component: CategoryList,
      },
      {
        path: 'categories/add',
        component: CategoryForm,
      },
      {
        path: 'categories/edit/:id',
        component: CategoryForm,
      },
      {
        path: 'subcategories',
        component: SubcategoryList,
      },
      {
        path: 'subcategories/add',
        component: SubcategoryForm,
      },
      {
        path: 'subcategories/edit/:id',
        component: SubcategoryForm,
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
