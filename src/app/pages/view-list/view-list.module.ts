import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewListPageRoutingModule } from './view-list-routing.module';

import { ViewListPage } from './view-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewListPageRoutingModule
  ],
  declarations: [ViewListPage]
})
export class ViewListPageModule {}
