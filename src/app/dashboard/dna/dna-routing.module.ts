import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationServiceGuard } from 'src/app/shared/services/guards/authentication.guards';
import { DnaDashboardComponent } from './dna-dashboard/dna-dashboard.component';

const routes: Routes = [
 {path:'',component:DnaDashboardComponent,canActivate:[AuthenticationServiceGuard]},
/*{path:'create',component:CreateSessionComponent,canActivate:[AuthenticationServiceGuard]},
{path:'update/:id',component:CreateSessionComponent,canActivate:[AuthenticationServiceGuard]},
{path:'view/:id',component:ViewSessionComponent,canActivate:[AuthenticationServiceGuard]},
{path:'view-complete-report',component:SessionCompleteReportComponent,canActivate:[AuthenticationServiceGuard]} */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DnaRoutingModule { }
