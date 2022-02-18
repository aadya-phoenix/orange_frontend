import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationServiceGuard } from 'src/app/shared/services/guards/authentication.guards';
import { AuthorizationServiceGuard } from 'src/app/shared/services/guards/authorization.guards';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { CoursesComponent } from './courses/courses.component';
import { CreateNewCourseComponent } from './create-new-course/create-new-course.component';


const routes: Routes = [
    {path:'',component:CoursesComponent,canActivate:[AuthenticationServiceGuard]},
    {path:'create-cource',component:CreateNewCourseComponent,canActivate:[AuthenticationServiceGuard]},
    {path:'cource-detail',component:CourseDetailComponent,canActivate:[AuthorizationServiceGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateCourseRoutingModule { }