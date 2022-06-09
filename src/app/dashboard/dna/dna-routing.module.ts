import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationServiceGuard } from 'src/app/shared/services/guards/authentication.guards';
import { DnaCompleteReportComponent } from './dna-complete-report/dna-complete-report.component';
import { DnaCreateComponent } from './dna-create/dna-create.component';
import { DnaDashboardComponent } from './dna-dashboard/dna-dashboard.component';
import { DnaLearningFormComponent } from './dna-learning-form/dna-learning-form.component';
import { DnaManagerDataComponent } from './dna-manager-data/dna-manager-data.component';
import { DnaUserEditComponent } from './dna-user-edit/dna-user-edit.component';
import { DnaUserComponent } from './dna-user/dna-user.component';
import { DnaViewBpComponent } from './dna-view-bp/dna-view-bp.component';
import { DnaViewRptComponent } from './dna-view-rpt/dna-view-rpt.component';
import { DnaViewComponent } from './dna-view/dna-view.component';

const routes: Routes = [
 {path:'',component:DnaDashboardComponent,canActivate:[AuthenticationServiceGuard]},
 {path:'create/:id',component:DnaCreateComponent,canActivate:[AuthenticationServiceGuard]},
 {path:'update/:id/:form_id',component:DnaLearningFormComponent,canActivate:[AuthenticationServiceGuard]},
 {path:'user',component:DnaUserComponent,canActivate:[AuthenticationServiceGuard]},
 {path:'user/edit/:id',component:DnaUserEditComponent,canActivate:[AuthenticationServiceGuard]},
 {path:'add-new/:id',component:DnaLearningFormComponent,canActivate:[AuthenticationServiceGuard]},
 {path:'managersdata/:id',component:DnaManagerDataComponent, canActivate:[AuthenticationServiceGuard]},
 {path:'view/:id',component:DnaViewComponent,canActivate:[AuthenticationServiceGuard]},
 {path:'view-rpt/:id',component:DnaViewRptComponent,canActivate:[AuthenticationServiceGuard]},
 {path:'view-bp/:id',component:DnaViewBpComponent,canActivate:[AuthenticationServiceGuard]},
 {path:'view-complete-report',component:DnaCompleteReportComponent,canActivate:[AuthenticationServiceGuard]} 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DnaRoutingModule { }
