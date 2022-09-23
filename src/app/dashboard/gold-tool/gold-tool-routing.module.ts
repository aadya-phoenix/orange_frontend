import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationServiceGuard } from 'src/app/shared/services/guards/authentication.guards';
import { GoldToolCompleteReportComponent } from './gold-tool-complete-report/gold-tool-complete-report.component';
import { GoldToolCreateComponent } from './gold-tool-create/gold-tool-create.component';
import { GoldToolListComponent } from './gold-tool-list/gold-tool-list.component';
import { GoldToolViewComponent } from './gold-tool-view/gold-tool-view.component';

const routes: Routes = [
  { path: '', component: GoldToolListComponent, canActivate: [AuthenticationServiceGuard] },
  {path:'create',component:GoldToolCreateComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'update/:id',component:GoldToolCreateComponent,canActivate:[AuthenticationServiceGuard]}, 
  {path:'view/:id',component:GoldToolViewComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'view-complete-report',component:GoldToolCompleteReportComponent,canActivate:[AuthenticationServiceGuard]} 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoldToolRoutingModule { }
