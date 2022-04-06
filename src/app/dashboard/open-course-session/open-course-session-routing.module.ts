import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationServiceGuard } from 'src/app/shared/services/guards/authentication.guards';
import { AllCoursesComponent } from './all-courses/all-courses.component';
import { CreateSessionComponent } from './create-session/create-session.component';
import { OpenRequestDetailComponent } from './open-request-detail/open-request-detail.component';

const routes: Routes = [ {path:'',component:AllCoursesComponent,canActivate:[AuthenticationServiceGuard]},
{path:'new-cource',component:CreateSessionComponent,canActivate:[AuthenticationServiceGuard]},
{path:'open-request-detail',component:OpenRequestDetailComponent,canActivate:[AuthenticationServiceGuard]},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpenCourseSessionRoutingModule { }
