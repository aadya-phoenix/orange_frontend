import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationServiceGuard } from 'src/app/shared/services/guards/authentication.guards';
import { DnaCompleteReportComponent } from './dna-complete-report/dna-complete-report.component';
import { DnaCreateComponent } from './dna-create/dna-create.component';
import { DnaDashboardComponent } from './dna-dashboard/dna-dashboard.component';
import { DnaLearningFormComponent } from './dna-learning-form/dna-learning-form.component';
import { DnaViewComponent } from './dna-view/dna-view.component';

const routes: Routes = [
 {path:'',component:DnaDashboardComponent,canActivate:[AuthenticationServiceGuard]},
 {path:'create',component:DnaCreateComponent,canActivate:[AuthenticationServiceGuard]},
{path:'add-new',component:DnaLearningFormComponent,canActivate:[AuthenticationServiceGuard]},
{path:'view',component:DnaViewComponent,canActivate:[AuthenticationServiceGuard]},
{path:'view-complete-report',component:DnaCompleteReportComponent,canActivate:[AuthenticationServiceGuard]} 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DnaRoutingModule { }
