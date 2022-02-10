import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesComponent } from './courses/courses.component';
import { CreateNewCourseComponent } from './create-new-course/create-new-course.component';
import { CreateCourseRoutingModule } from './create-course-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [CoursesComponent, CreateNewCourseComponent],
  imports: [
    CommonModule,
    CreateCourseRoutingModule,
    SharedModule
  ]
})
export class CreateCourseModule { }
