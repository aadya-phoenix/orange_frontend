import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationServiceGuard } from '../shared/services/guards/authentication.guards';
import { ChangePasswordUserComponent } from './change-password-user/change-password-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { LearningNeedsComponent } from './dna/learning-needs/learning-needs.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { CreateTrackerComponent } from './dna/create-tracker/create-tracker.component';

const routes: Routes = [
  {path:'',component:UserManagementComponent},
  {path:'create',component:EditUserComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'edit/:id',component:EditUserComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'change-password/:id',component:ChangePasswordUserComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'dna',component:LearningNeedsComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'dna/create',component:CreateTrackerComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'dna/create/:id',component:CreateTrackerComponent,canActivate:[AuthenticationServiceGuard]},
  ];
  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
