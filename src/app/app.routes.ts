import { Routes } from '@angular/router';

import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard';

import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { PublicLayout } from './layouts/public-layout/public-layout';

import { authGuard } from './core/guards/auth-guard';

import { CategoryList } from './features/category/category-list/category-list';
import { CategoryForm } from './features/category/category-form/category-form';

import { NewsList } from './features/news/news-list/news-list';
import { NewsForm } from './features/news/news-form/news-form';

import { SubcategoryList } from './features/subcategory/subcategory-list/subcategory-list';
import { SubcategoryForm } from './features/subcategory/subcategory-form/subcategory-form';

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

import { NewsTag } from './features/news-tag/news-tag/news-tag';

import { NotificationList } from './features/notifications/notification-list/notification-list';
import { NotificationForm } from './features/notifications/notification-form/notification-form';

import { WebsiteSettings } from './features/website-settings/website-settings/website-settings';

import { SeoList } from './pages/seo/seo-list/seo-list';
import { SeoForm } from './pages/seo/seo-form/seo-form';

import { ReportsDashboard } from './pages/reports/reports-dashboard/reports-dashboard';
import { NewsReportComponent } from './pages/reports/news-report/news-report';
import { CommentsReport } from './pages/reports/comments-report/comments-report';
import { UserActivityReportComponent } from './pages/reports/user-activity-report/user-activity-report';

import { ProfileComponent } from './pages/profile/profile';

import { PermissionList } from './pages/permissions/permission-list/permission-list';
import { PermissionForm } from './pages/permissions/permission-form/permission-form';

import { RoleList } from './pages/roles/role-list/role-list';
import { RoleForm } from './pages/roles/role-form/role-form';
import { RolePermissions } from './pages/roles/role-permissions/role-permissions';
import { PublicNewsList } from './features/public-news/public-news-list/public-news-list';
import { PublicNewsDetail } from './features/public-news/public-news-detail/public-news-detail';

export const routes: Routes = [
  // ==========================================
  // AUTHENTICATION
  // ==========================================

  {
    path: 'login',
    component: Login,
  },
  {
  path: 'register',
  loadComponent: () =>
    import('./features/auth/register/register')
      .then((m) => m.Register),
},

  // ==========================================
  // PUBLIC WEBSITE
  // ==========================================

  {
    path: 'public',
    component: PublicLayout,

    children: [
      // PUBLIC HOME
      {
        path: '',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
      },

      // PUBLIC NEWS LIST
      {
        path: 'news',
        component: PublicNewsList,
      },
      {
        path: 'news/:id',
        component: PublicNewsDetail,
      },

       // ========================================
    // NEWS BY CATEGORY
    // ========================================

    {
      path: 'category/:slug',
      component: PublicNewsList,
    },


    // ========================================
    // NEWS BY SUBCATEGORY
    // ========================================

    {
      path: 'subcategory/:slug',
      component: PublicNewsList,
    },

      // PUBLIC STATIC PAGES
      {
        path: ':slug',
        loadComponent: () =>
          import('./features/public-static-page/public-static-page/public-static-page').then(
            (m) => m.PublicStaticPage,
          ),
      },
    ],
  },

  // ==========================================
  // ADMIN PANEL
  // ==========================================

  {
    path: '',
    component: AdminLayout,
    canActivate: [authGuard],

    children: [
      // ========================================
      // DASHBOARD
      // ========================================

      {
        path: 'dashboard',
        component: Dashboard,
      },

      // ========================================
      // CATEGORY
      // ========================================

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

      // ========================================
      // SUB CATEGORY
      // ========================================

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

      // ========================================
      // NEWS
      // ========================================

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

      // ========================================
      // TAG
      // ========================================

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

      // ========================================
      // MEDIA
      // ========================================

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

      // ========================================
      // STATIC PAGES
      // ========================================

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

      // ========================================
      // ADVERTISEMENTS
      // ========================================

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

      // ========================================
      // MENUS
      // ========================================

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

      // ========================================
      // MENU ITEMS
      // ========================================

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

      // ========================================
      // USERS
      // ========================================

      {
        path: 'users',
        component: UserList,
      },

      {
        path: 'users/edit/:id',
        component: UserForm,
      },

      // ========================================
      // COMMENTS
      // ========================================

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

      // ========================================
      // NEWS TAGS
      // ========================================

      {
        path: 'news-tags',
        component: NewsTag,
      },

      // ========================================
      // NOTIFICATIONS
      // ========================================

      {
        path: 'notifications',
        component: NotificationList,
      },

      {
        path: 'notifications/add',
        component: NotificationForm,
      },

      {
        path: 'notifications/edit/:id',
        component: NotificationForm,
      },

      // ========================================
      // WEBSITE SETTINGS
      // ========================================

      {
        path: 'website-settings',
        component: WebsiteSettings,
      },

      // ========================================
      // SEO
      // ========================================

      {
        path: 'seo',
        component: SeoList,
      },

      {
        path: 'seo/add',
        component: SeoForm,
      },

      {
        path: 'seo/edit/:id',
        component: SeoForm,
      },

      // ========================================
      // REPORTS
      // ========================================

      {
        path: 'reports',
        component: ReportsDashboard,
      },

      {
        path: 'reports/news',
        component: NewsReportComponent,
      },

      {
        path: 'reports/comments',
        component: CommentsReport,
      },

      {
        path: 'reports/user-activity',
        component: UserActivityReportComponent,
      },

      // ========================================
      // PROFILE
      // ========================================

      {
        path: 'profile',
        component: ProfileComponent,
      },

      // ========================================
      // PERMISSIONS
      // ========================================

      {
        path: 'permissions',
        component: PermissionList,
      },

      {
        path: 'permissions/add',
        component: PermissionForm,
      },

      {
        path: 'permissions/edit/:id',
        component: PermissionForm,
      },

      // ========================================
      // ROLES
      // ========================================

      {
        path: 'roles',
        component: RoleList,
      },

      {
        path: 'roles/add',
        component: RoleForm,
      },

      {
        path: 'roles/edit/:id',
        component: RoleForm,
      },

      {
        path: 'roles/permissions/:id',
        component: RolePermissions,
      },

      // ========================================
      // ADMIN DEFAULT
      // ========================================

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },

  // ==========================================
  // WILDCARD
  // ==========================================

  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
