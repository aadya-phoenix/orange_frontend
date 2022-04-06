import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpenCourseSessionRoutingModule } from './open-course-session-routing.module';
import { AllCoursesComponent } from './all-courses/all-courses.component';
import { CreateSessionComponent } from './create-session/create-session.component';
import { OpenRequestDetailComponent } from './open-request-detail/open-request-detail.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
<<<<<<< HEAD:src/app/dashboard/open-course-session/open-course-session.module.ts
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [AllCoursesComponent, CreateSessionComponent, OpenRequestDetailComponent],
=======
import { CreateOpenCourseComponent } from './create-open-course/create-open-course.component';
import { OpenRequestDetailComponent } from './open-request-detail/open-request-detail.component';


@NgModule({
  declarations: [ AllCoursesComponent, CreateOpenCourseComponent, OpenRequestDetailComponent],
>>>>>>> module2-open-course:src/app/dashboard/open-course/open-course.module.ts
  imports: [
    CommonModule,
    SharedModule,
    OpenCourseSessionRoutingModule,
    NgxPaginationModule,
    NgSelectModule
  ]
})
export class OpenCourseSessionModule { }
