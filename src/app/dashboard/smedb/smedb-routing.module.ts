import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationServiceGuard } from 'src/app/shared/services/guards/authentication.guards';
import { SmedbCreateComponent } from './smedb-create/smedb-create.component';
import { SmedbListComponent } from './smedb-list/smedb-list.component';


const routes: Routes = [
  { path: '', component: SmedbListComponent, canActivate: [AuthenticationServiceGuard] },
  {path:'create',component:SmedbCreateComponent,canActivate:[AuthenticationServiceGuard]},
  // {path:'update/:id',component:CourseCreateComponent,canActivate:[AuthenticationServiceGuard]},
  // {path:'view/:id',component:CourseViewComponent,canActivate:[AuthenticationServiceGuard]},
  // {path:'view-complete-report',component:CourseCompleteReportComponent,canActivate:[AuthenticationServiceGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmedbRoutingModule { }