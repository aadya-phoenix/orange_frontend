import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';
import { CreateNewCourseComponent } from './create-new-course/create-new-course.component';


const routes: Routes = [
    {path:'',component:CoursesComponent},
    {path:'create-cource',component:CreateNewCourseComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateCourseRoutingModule { }