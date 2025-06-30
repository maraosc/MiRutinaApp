import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarHabitoPageRoutingModule } from './agregar-habito-routing.module';

import { AgregarHabitoPage } from './agregar-habito.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarHabitoPageRoutingModule
  ],
  declarations: [AgregarHabitoPage]
})
export class AgregarHabitoPageModule {}
