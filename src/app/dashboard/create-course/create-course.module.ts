import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesComponent } from './courses/courses.component';
import { CreateNewCourseComponent } from './create-new-course/create-new-course.component';
import { CreateCourseRoutingModule } from './create-course-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { ViewHistoryComponent } from './view-history/view-history.component';



@NgModule({
  declarations: [CoursesComponent, CreateNewCourseComponent, CourseDetailComponent, ViewHistoryComponent],
  imports: [
    CommonModule,
    CreateCourseRoutingModule,
    SharedModule,
    NgSelectModule
  ]
})
export class CreateCourseModule { }
