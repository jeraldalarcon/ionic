import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () =>
  redirectUnauthorizedTo(['/login']);

const redirectLoggedInToOrder = () => redirectLoggedInTo(['/tabs/order'])

import { TabsPage } from './tabs.page';

const routes: Routes = [

  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./../../home/home.module').then( m => m.HomePageModule),
        ...canActivate(redirectUnauthorizedToLogin,),
      },
      {
        path: 'order-list',
        loadChildren: () => import('./../../pages/order-list/order-list.module').then( m => m.OrderListPageModule),
        ...canActivate(redirectUnauthorizedToLogin),
      },
      {
        path: 'view-list',
        loadChildren: () => import('./../../pages/view-list/view-list.module').then( m => m.ViewListPageModule),
        ...canActivate(redirectUnauthorizedToLogin),
      },
      {
        path: 'profile',
        loadChildren: () => import('./../../pages/profile/profile.module').then( m => m.ProfilePageModule),
        ...canActivate(redirectUnauthorizedToLogin),
      },
      {
        path: 'order',
        loadChildren: () => import('../../pages/product/order.module').then( m => m.OrderPageModule),
        ...canActivate(redirectUnauthorizedToLogin),
      },
      // { path: 'welcome', component: WelcomeComponent },
      {
        path: '',
        redirectTo: 'order',
        pathMatch: 'full'
      },
    ]
  },{
    path: '',
    redirectTo: '/tabs/order',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
