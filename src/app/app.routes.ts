import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { authGuard } from './core/guards/auth-guard';
import { CategoryList } from './features/category/category-list/category-list';
import { CategoryForm } from './features/category/category-form/category-form';
import { NewsList } from './features/news/news-list/news-list';
import { SubcategoryList } from './features/subcategory/subcategory-list/subcategory-list';
import { SubcategoryForm } from './features/subcategory/subcategory-form/subcategory-form';
import { NewsForm } from './features/news/news-form/news-form';
import { TagList } from './features/tag/tag-list/tag-list';
import { TagForm } from './features/tag/tag-form/tag-form';

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
        path: 'news',
        component: NewsList,
      },
      {
        path: 'news/add',
        component: NewsForm,
      },
      {
        path: 'news/edit/:id',
        component: NewsForm,
      },
      {
        path: 'tags',
        component: TagList,
      },
      {
        path: 'tags/add',
        component: TagForm,
      },
      {
        path: 'tags/edit/:id',
        component: TagForm,
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
