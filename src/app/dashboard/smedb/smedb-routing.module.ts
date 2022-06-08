import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationServiceGuard } from 'src/app/shared/services/guards/authentication.guards';
import { SmedbCreateComponent } from './smedb-create/smedb-create.component';
import { SmedbListComponent } from './smedb-list/smedb-list.component';
import { SmedbViewReportComponent } from './smedb-view-report/smedb-view-report.component';
import { SmedbViewComponent } from './smedb-view/smedb-view.component';


const routes: Routes = [
  { path: '', component: SmedbListComponent, canActivate: [AuthenticationServiceGuard] },
  { path: 'create', component: SmedbCreateComponent, canActivate: [AuthenticationServiceGuard] },
  { path: 'update/:id', component: SmedbCreateComponent, canActivate: [AuthenticationServiceGuard] },
  { path: 'view/:id', component: SmedbViewComponent, canActivate: [AuthenticationServiceGuard] },
  { path: 'view-complete-report', component: SmedbViewReportComponent, canActivate: [AuthenticationServiceGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmedbRoutingModule { }