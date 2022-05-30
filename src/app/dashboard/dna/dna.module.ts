import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DnaRoutingModule } from './dna-routing.module';
import { DnaDashboardComponent } from './dna-dashboard/dna-dashboard.component';
import { DnaCreateComponent } from './dna-create/dna-create.component';


@NgModule({
  declarations: [DnaDashboardComponent, DnaCreateComponent],
  imports: [
    CommonModule,
    DnaRoutingModule
  ]
})
export class DnaModule { }
