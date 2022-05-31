import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DnaRoutingModule } from './dna-routing.module';
import { DnaDashboardComponent } from './dna-dashboard/dna-dashboard.component';
import { DnaCreateComponent } from './dna-create/dna-create.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { DnaLearningFormComponent } from './dna-learning-form/dna-learning-form.component';
import { DnaListComponent } from './dna-list/dna-list.component';
import { DnaViewComponent } from './dna-view/dna-view.component';
import { DnaCompleteReportComponent } from './dna-complete-report/dna-complete-report.component';
import { DnaManagerDataComponent } from './dna-manager-data/dna-manager-data.component';


@NgModule({
  declarations: [DnaDashboardComponent, DnaCreateComponent, DnaLearningFormComponent, DnaListComponent, DnaViewComponent, DnaCompleteReportComponent, DnaManagerDataComponent],
  /* entryComponents:[ DnaLearningFormComponent], */
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
