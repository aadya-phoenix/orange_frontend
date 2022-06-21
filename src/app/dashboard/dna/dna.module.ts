import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DnaRoutingModule } from './dna-routing.module';
import { DnaDashboardComponent } from './dna-dashboard/dna-dashboard.component';
import { DnaCreateComponent } from './dna-create/dna-create.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { DnaLearningFormComponent } from './dna-learning-form/dna-learning-form.component';
import { DnaViewComponent } from './dna-view/dna-view.component';
import { DnaCompleteReportComponent } from './dna-complete-report/dna-complete-report.component';
import { DnaManagerDataComponent } from './dna-manager-data/dna-manager-data.component';
import { DnaViewRptComponent } from './dna-view-rpt/dna-view-rpt.component';
import { DnaUserComponent } from './dna-user/dna-user.component';
import { DnaUserEditComponent } from './dna-user-edit/dna-user-edit.component';
import { DnaViewBpComponent } from './dna-view-bp/dna-view-bp.component';
import { DnaForwardComponent } from './dna-forward/dna-forward.component';
import { DnaTrackerComponent } from './dna-tracker/dna-tracker.component';
import { DnaTrackerCreateComponent } from './dna-tracker-create/dna-tracker-create.component';

@NgModule({
  declarations: [DnaDashboardComponent, DnaCreateComponent, DnaLearningFormComponent,  DnaViewComponent, DnaCompleteReportComponent, DnaManagerDataComponent, DnaViewRptComponent, DnaUserComponent, DnaUserEditComponent, DnaViewBpComponent, DnaForwardComponent, DnaTrackerComponent, DnaTrackerCreateComponent],
  entryComponents:[ DnaForwardComponent],
  providers:[DatePipe],
  imports: [
    CommonModule,
    DnaRoutingModule,
    SharedModule,
    NgxPaginationModule,
    NgSelectModule,
    NgbModule,
  ]
})
export class DnaModule { }
