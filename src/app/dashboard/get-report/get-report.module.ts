import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { GetReportRoutingModule } from './get-report-routing.module';
import { GetReportListComponent } from './get-report-list/get-report-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { GetReportHistoryComponent } from './get-report-history/get-report-history.component';
import { GetReportCreateComponent } from './get-report-create/get-report-create.component';
import { GetReportCompleteReportComponent } from './get-report-complete-report/get-report-complete-report.component';
import { GetReportViewComponent } from './get-report-view/get-report-view.component';
import { GetReportPublishComponent } from './get-report-publish/get-report-publish.component';
import { GetReportTransferToOtherRocComponent } from './get-report-transfer-to-other-roc/get-report-transfer-to-other-roc.component';
import { GetReportForwardComponent } from './get-report-forward/get-report-forward.component';
import { GetReportCloseOnUpdateComponent } from './get-report-close-on-update/get-report-close-on-update.component';


@NgModule({
  declarations: [GetReportListComponent, GetReportHistoryComponent, GetReportCreateComponent, GetReportCompleteReportComponent, GetReportViewComponent, GetReportPublishComponent, GetReportTransferToOtherRocComponent, GetReportForwardComponent, GetReportCloseOnUpdateComponent],
  providers:[DatePipe],
  entryComponents:[GetReportHistoryComponent,GetReportForwardComponent,GetReportPublishComponent,
    GetReportTransferToOtherRocComponent,GetReportCloseOnUpdateComponent
  ],
  imports: [
    CommonModule,
    GetReportRoutingModule,
    SharedModule,
    NgxPaginationModule,
    NgSelectModule,
    NgbModule
  ]
})
export class GetReportModule { }
