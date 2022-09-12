import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationServiceGuard } from 'src/app/shared/services/guards/authentication.guards';
import { CourseCompleteReportComponent } from './course-complete-report/course-complete-report.component';
import { CourseCreateComponent } from './course-create/course-create.component';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseViewComponent } from './course-view/course-view.component';


const routes: Routes = [
  { path: '', component: CourseListComponent, canActivate: [AuthenticationServiceGuard] },
  {path:'create',component:CourseCreateComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'create/designlearning/:design_id',component:CourseCreateComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'update/:id',component:CourseCreateComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'view/:id',component:CourseViewComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'view-complete-report',component:CourseCompleteReportComponent,canActivate:[AuthenticationServiceGuard]},
  // {path:'create-cource',component:CreateNewCourseComponent,canActivate:[AuthenticationServiceGuard]},
  // {path:'view-complete-report',component:ViewCompleteReportComponent,canActivate:[AuthenticationServiceGuard]},
  // {path:'request-detail',component:RequestDetailComponent,canActivate:[AuthenticationServiceGuard]},
  // {path:'edit-cource',component:UpdateCourceComponent,canActivate:[AuthenticationServiceGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }