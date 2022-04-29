import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SessionPublisherComponent } from './set-backups/session-publisher/session-publisher.component';

import { SetBackupComponent } from './set-backups/set-backup/set-backup.component';

const routes: Routes = [
{path:'',component:DashboardComponent},
{path:'cources',loadChildren:()=>import("./create-course/create-course.module").then(m=>m.CreateCourseModule)},
{path:'olcarousel',loadChildren:()=>import("./carousel/carousel.module").then(m=>m.CarouselModule)},
{path:'opensession',loadChildren:()=>import("./open-course-session/open-course-session.module").then(m=>m.OpenCourseSessionModule)},

{path:'set-backup',component:SetBackupComponent},
{path:'sctworkflow', component:SessionPublisherComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
