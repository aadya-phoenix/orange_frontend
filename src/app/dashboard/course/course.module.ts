import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseRoutingModule } from './course-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseHistoryComponent } from './course-history/course-history.component';
import { CourseCreateComponent } from './course-create/course-create.component';
import { CourseViewComponent } from './course-view/course-view.component';
import { CourseCompleteReportComponent } from './course-complete-report/course-complete-report.component';

@NgModule({
  declarations: [
    CourseListComponent,
    CourseHistoryComponent,
    CourseCreateComponent,
    CourseViewComponent,
    CourseCompleteReportComponent,
  ],
  entryComponents:[CourseHistoryComponent],
  imports: [
    CommonModule,
    CourseRoutingModule,
    SharedModule,
    NgxPaginationModule,
    NgSelectModule,
    RichTextEditorAllModule,
    NgbModule
  ],
})
export class CourseModule {}
