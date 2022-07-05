import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationServiceGuard } from 'src/app/shared/services/guards/authentication.guards';
import { DesignLearningCompleteReportComponent } from './design-learning-complete-report/design-learning-complete-report.component';
import { DesignLearningCreateComponent } from './design-learning-create/design-learning-create.component';
import { DesignLearningListComponent } from './design-learning-list/design-learning-list.component';
import { DesignLearningViewComponent } from './design-learning-view/design-learning-view.component';

const routes: Routes = [
  {path:'',component:DesignLearningListComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'create',component:DesignLearningCreateComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'update/:id',component:DesignLearningCreateComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'view/:id',component:DesignLearningViewComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'view-complete-report',component:DesignLearningCompleteReportComponent,canActivate:[AuthenticationServiceGuard]}, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesignLearningRoutingModule { }
