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
import { MediaList } from './features/media/media-list/media-list';
import { MediaForm } from './features/media/media-form/media-form';
import { StaticpageList } from './features/static-page/staticpage-list/staticpage-list';
import { StaticpageForm } from './features/static-page/staticpage-form/staticpage-form';
import { AdvertisementList } from './features/advertisement/advertisement-list/advertisement-list';
import { AdvertisementForm } from './features/advertisement/advertisement-form/advertisement-form';
import { MenuList } from './features/menu/menu-list/menu-list';
import { MenuForm } from './features/menu/menu-form/menu-form';
import { MenuItemList } from './features/menu-item/menu-item-list/menu-item-list';
import { MenuItemForm } from './features/menu-item/menu-item-form/menu-item-form';
import { UserList } from './pages/users/user-list/user-list';
import { UserForm } from './pages/users/user-form/user-form';
import { CommentList } from './features/comment/comment-list/comment-list';
import { CommentForm } from './features/comment/comment-form/comment-form';

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
        path: 'media',
        component: MediaList,
      },
      {
        path: 'media/add',
        component: MediaForm,
      },
      {
        path: 'media/edit/:id',
        component: MediaForm,
      },
      {
        path: 'static-pages',
        component: StaticpageList,
      },
      {
        path: 'static-pages/add',
        component: StaticpageForm,
      },
      {
        path: 'static-pages/edit/:id',
        component: StaticpageForm,
      },
      {
        path: 'advertisements',
        component: AdvertisementList,
      },
      {
        path: 'advertisements/add',
        component: AdvertisementForm,
      },
      {
        path: 'advertisements/edit/:id',
        component: AdvertisementForm,
      },
      {
        path: 'menus',
        component: MenuList,
      },
      {
        path: 'menus/add',
        component: MenuForm,
      },
      {
        path: 'menus/edit/:id',
        component: MenuForm,
      },
      {
        path: 'menu-items',
        component: MenuItemList,
      },
      {
        path: 'menu-items/add',
        component: MenuItemForm,
      },
      {
        path: 'menu-items/edit/:id',
        component: MenuItemForm,
      },
      {
        path: 'users',
        component: UserList,
      },

      {
        path: 'users/edit/:id',
        component: UserForm,
      },
      {
        path: 'comments',
        component: CommentList,
      },
      {
        path: 'comments/add',
        component: CommentForm,
      },
      {
        path: 'comments/edit/:id',
        component: CommentForm,
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
