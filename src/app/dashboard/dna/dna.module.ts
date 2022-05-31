import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DnaRoutingModule } from './dna-routing.module';
import { DnaDashboardComponent } from './dna-dashboard/dna-dashboard.component';
import { DnaCreateComponent } from './dna-create/dna-create.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [DnaDashboardComponent, DnaCreateComponent],
  imports: [
    CommonModule,
    DnaRoutingModule,
    SharedModule,
    NgxPaginationModule,
    NgSelectModule,
    NgbModule
  ]
})
export class DnaModule { }
