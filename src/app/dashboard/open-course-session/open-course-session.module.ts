import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpenCourseSessionRoutingModule } from './open-course-session-routing.module';
import { AllCoursesComponent } from './all-courses/all-courses.component';
import { CreateSessionComponent } from './create-session/create-session.component';
import { OpenRequestDetailComponent } from './open-request-detail/open-request-detail.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [AllCoursesComponent, CreateSessionComponent, OpenRequestDetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    OpenCourseSessionRoutingModule,
    NgxPaginationModule,
    NgSelectModule
  ]
})
export class OpenCourseSessionModule { }
