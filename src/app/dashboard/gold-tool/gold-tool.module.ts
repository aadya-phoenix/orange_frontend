import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { GoldToolRoutingModule } from './gold-tool-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoldToolListComponent } from './gold-tool-list/gold-tool-list.component';
import { GoldToolCreateComponent } from './gold-tool-create/gold-tool-create.component';
import { GoldToolViewComponent } from './gold-tool-view/gold-tool-view.component';
import { GoldToolCompleteReportComponent } from './gold-tool-complete-report/gold-tool-complete-report.component';
// import { GetReportListComponent } from './get-report-list/get-report-list.component';
// import { GetReportHistoryComponent } from './get-report-history/get-report-history.component';
// import { GetReportCreateComponent } from './get-report-create/get-report-create.component';
// import { GetReportCompleteReportComponent } from './get-report-complete-report/get-report-complete-report.component';
// import { GetReportViewComponent } from './get-report-view/get-report-view.component';
// import { GetReportPublishComponent } from './get-report-publish/get-report-publish.component';
// import { GetReportTransferToOtherRocComponent } from './get-report-transfer-to-other-roc/get-report-transfer-to-other-roc.component';
// import { GetReportCloseOnUpdateComponent } from './get-report-close-on-update/get-report-close-on-update.component';


@NgModule({
  declarations: [
    // GetReportListComponent,
    //  GetReportHistoryComponent, GetReportCreateComponent, GetReportCompleteReportComponent, GetReportViewComponent, GetReportPublishComponent, GetReportTransferToOtherRocComponent, GetReportCloseOnUpdateComponent
  GoldToolListComponent,
    GoldToolCreateComponent,
    GoldToolViewComponent,
    GoldToolCompleteReportComponent],
  providers:[DatePipe],
  entryComponents:[
    // GetReportHistoryComponent,GetReportPublishComponent,
    // GetReportTransferToOtherRocComponent,GetReportCloseOnUpdateComponent
  ],
  imports: [
    CommonModule,
    GoldToolRoutingModule,
    SharedModule,
    NgxPaginationModule,
    NgSelectModule,
    NgbModule
  ]
})
export class GoldToolModule { }
