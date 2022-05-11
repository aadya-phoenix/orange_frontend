import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationServiceGuard } from 'src/app/shared/services/guards/authentication.guards';
import { GetReportCreateComponent } from './get-report-create/get-report-create.component';
import { GetReportListComponent } from './get-report-list/get-report-list.component';

const routes: Routes = [ {path:'',component:GetReportListComponent,canActivate:[AuthenticationServiceGuard]},
 {path:'create',component:GetReportCreateComponent,canActivate:[AuthenticationServiceGuard]},
/*{path:'update/:id',component:CreateSessionComponent,canActivate:[AuthenticationServiceGuard]},
{path:'view/:id',component:ViewSessionComponent,canActivate:[AuthenticationServiceGuard]},
{path:'view-complete-report',component:SessionCompleteReportComponent,canActivate:[AuthenticationServiceGuard]} */
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GetReportRoutingModule { }
