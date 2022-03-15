import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SetBackupComponent } from './set-backup/set-backup.component';

const routes: Routes = [
{path:'',component:DashboardComponent},
{path:'cources',loadChildren:()=>import("./create-course/create-course.module").then(m=>m.CreateCourseModule)},
{path:'set-backup',component:SetBackupComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
