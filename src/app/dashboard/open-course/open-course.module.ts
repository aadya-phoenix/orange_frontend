import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpenCourseRoutingModule } from './open-course-routing.module';

import { AllCoursesComponent } from './all-courses/all-courses.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { CreateOpenCourseComponent } from './create-open-course/create-open-course.component';
import { OpenRequestDetailComponent } from './open-request-detail/open-request-detail.component';


@NgModule({
  declarations: [ AllCoursesComponent, CreateOpenCourseComponent, OpenRequestDetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    OpenCourseRoutingModule,
    NgxPaginationModule,
    NgSelectModule
  ]
})
export class OpenCourseModule { }
