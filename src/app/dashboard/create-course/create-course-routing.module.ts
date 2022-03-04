import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationServiceGuard } from 'src/app/shared/services/guards/authentication.guards';
import { AuthorizationServiceGuard } from 'src/app/shared/services/guards/authorization.guards';
import { CoursesComponent } from './courses/courses.component';
import { CreateNewCourseComponent } from './create-new-course/create-new-course.component';
import { RequestDetailComponent } from './request-detail/request-detail.component';
import { UpdateCourceComponent } from './update-cource/update-cource.component';
import { ViewCourseDetailsComponent } from './view-course-details/view-course-details.component';


const routes: Routes = [
    {path:'',component:CoursesComponent,canActivate:[AuthenticationServiceGuard]},
    {path:'create-cource',component:CreateNewCourseComponent,canActivate:[AuthenticationServiceGuard]},
    {path:'request-detail',component:RequestDetailComponent,canActivate:[AuthorizationServiceGuard]},
    {path:'edit-cource',component:UpdateCourceComponent,canActivate:[AuthenticationServiceGuard]},
    {path:'view-details',component:ViewCourseDetailsComponent,canActivate:[AuthenticationServiceGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateCourseRoutingModule { }