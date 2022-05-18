import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BackOfficeListComponent } from './back-office-list/back-office-list.component';
import { BackOfficeRoutingModule } from './back-office-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateBackOfficeComponent } from './create-back-office/create-back-office.component';
import { BackOfficeViewComponent } from './back-office-view/back-office-view.component';
import { BackOfficeHistoryComponent } from './back-office-history/back-office-history.component';
import { BackOfficePublishComponent } from './back-office-publish/back-office-publish.component';
import { BackOfficeForwardComponent } from './back-office-forward/back-office-forward.component';
import { BackOfficeViewReportComponent } from './back-office-view-report/back-office-view-report.component';
import { BackOfficeTransferToOtherRocComponent } from './back-office-transfer-to-other-roc/back-office-transfer-to-other-roc.component';



@NgModule({
  declarations: [
    BackOfficeListComponent,
    CreateBackOfficeComponent,
    BackOfficeViewComponent,
    BackOfficeHistoryComponent,
    BackOfficePublishComponent,
    BackOfficeForwardComponent,
    BackOfficeViewReportComponent,
    BackOfficeTransferToOtherRocComponent,
  ],
  providers:[DatePipe],
  entryComponents:[BackOfficeHistoryComponent, BackOfficePublishComponent, BackOfficeForwardComponent, BackOfficeTransferToOtherRocComponent],
  imports: [
    CommonModule,
    BackOfficeRoutingModule,
    SharedModule,
    NgxPaginationModule,
    NgSelectModule,
    RichTextEditorAllModule,
    NgbModule
  ],
})
export class BackOfficeModule { }
