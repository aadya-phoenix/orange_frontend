import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

import { OpenCourseSessionRoutingModule } from './open-course-session-routing.module';

import { CreateSessionComponent } from './create-session/create-session.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { SessionHistoryComponent } from './session-history/session-history.component';
import { ViewSessionComponent } from './view-session/view-session.component';
import { SessionsListComponent } from './sessions-list/sessions-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SessionCompleteReportComponent } from './session-complete-report/session-complete-report.component';
import { DigitOnlyModule } from '@uiowa/digit-only';


@NgModule({
  declarations: [ SessionsListComponent, CreateSessionComponent, SessionHistoryComponent, 
    ViewSessionComponent, SessionCompleteReportComponent],
  providers:[CurrencyPipe,DatePipe],
  entryComponents:[SessionHistoryComponent],
  imports: [
    CommonModule,
    SharedModule,
    OpenCourseSessionRoutingModule,
    NgxPaginationModule,
    NgSelectModule,
    NgbModule,
    DigitOnlyModule
  ]
})
export class OpenCourseSessionModule { }
