import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesComponent } from './courses/courses.component';
import { CreateNewCourseComponent } from './create-new-course/create-new-course.component';
import { CreateCourseRoutingModule } from './create-course-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ViewHistoryComponent } from './view-history/view-history.component';
import { RequestDetailComponent } from './request-detail/request-detail.component';
import { UpdateCourceComponent } from './update-cource/update-cource.component';
import { ViewCourseDetailsComponent } from './view-course-details/view-course-details.component';
import { ViewCompleteReportComponent } from './view-complete-report/view-complete-report.component';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [CoursesComponent, CreateNewCourseComponent, ViewHistoryComponent, RequestDetailComponent, UpdateCourceComponent, ViewCourseDetailsComponent, ViewCompleteReportComponent],
  imports: [
    CommonModule,
    CreateCourseRoutingModule,
    SharedModule,
    NgxPaginationModule,
    NgSelectModule
  ]
})
export class CreateCourseModule { }
