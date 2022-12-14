import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationServiceGuard } from 'src/app/shared/services/guards/authentication.guards';
import { SessionsListComponent } from './sessions-list/sessions-list.component';
import { CreateSessionComponent } from './create-session/create-session.component';
import { ViewSessionComponent } from './view-session/view-session.component';
import { SessionCompleteReportComponent } from './session-complete-report/session-complete-report.component';

const routes: Routes = [ {path:'',component:SessionsListComponent,canActivate:[AuthenticationServiceGuard]},
{path:'create',component:CreateSessionComponent,canActivate:[AuthenticationServiceGuard]},
{path:'create/cct/:course_id',component:CreateSessionComponent,canActivate:[AuthenticationServiceGuard]},
{path:'update/:id',component:CreateSessionComponent,canActivate:[AuthenticationServiceGuard]},
{path:'view/:id',component:ViewSessionComponent,canActivate:[AuthenticationServiceGuard]},
{path:'view-complete-report',component:SessionCompleteReportComponent,canActivate:[AuthenticationServiceGuard]}
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpenCourseSessionRoutingModule { }
