import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackOfficeListComponent } from './back-office-list/back-office-list.component';
import { AuthenticationServiceGuard } from 'src/app/shared/services/guards/authentication.guards';
import { CreateBackOfficeComponent } from './create-back-office/create-back-office.component';
import { BackOfficeViewComponent } from './back-office-view/back-office-view.component';
import { BackOfficeViewReportComponent } from './back-office-view-report/back-office-view-report.component';



const routes: Routes = [
  {path:'',component:BackOfficeListComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'create',component:CreateBackOfficeComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'update/:id',component:CreateBackOfficeComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'view/:id',component:BackOfficeViewComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'view-complete-report',component:BackOfficeViewReportComponent,canActivate:[AuthenticationServiceGuard]},
];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class BackOfficeRoutingModule { }
