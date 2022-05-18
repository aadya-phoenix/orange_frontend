import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationServiceGuard } from 'src/app/shared/services/guards/authentication.guards';
import { GetReportCreateComponent } from './get-report-create/get-report-create.component';
import { GetReportListComponent } from './get-report-list/get-report-list.component';
import { GetReportViewComponent } from './get-report-view/get-report-view.component';

const routes: Routes = [ {path:'',component:GetReportListComponent,canActivate:[AuthenticationServiceGuard]},
 {path:'create',component:GetReportCreateComponent,canActivate:[AuthenticationServiceGuard]},
{path:'update/:id',component:GetReportCreateComponent,canActivate:[AuthenticationServiceGuard]}, 
{path:'view/:id',component:GetReportViewComponent,canActivate:[AuthenticationServiceGuard]},
/*{path:'view-complete-report',component:SessionCompleteReportComponent,canActivate:[AuthenticationServiceGuard]} */
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GetReportRoutingModule { }
