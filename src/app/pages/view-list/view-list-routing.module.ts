import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewListPage } from './view-list.page';

const routes: Routes = [
  {
    path: '',
    component: ViewListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewListPageRoutingModule {}
