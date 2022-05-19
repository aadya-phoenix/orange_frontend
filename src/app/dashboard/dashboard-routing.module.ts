import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SessionPublisherComponent } from './set-backups/session-publisher/session-publisher.component';

import { SetBackupComponent } from './set-backups/set-backup/set-backup.component';

const routes: Routes = [
{path:'',component:DashboardComponent},
{path:'cources',loadChildren:()=>import("./create-course/create-course.module").then(m=>m.CreateCourseModule)},
{path:'cct',loadChildren:()=>import("./course/course.module").then(m=>m.CourseModule)},
{path:'olcarousel',loadChildren:()=>import("./carousel/carousel.module").then(m=>m.CarouselModule)},
{path:'back-office',loadChildren:()=>import("./back-office/back-office.module").then(m=>m.BackOfficeModule)},
{path:'sct',loadChildren:()=>import("./open-course-session/open-course-session.module").then(m=>m.OpenCourseSessionModule)},
{path:'vendormanagement',loadChildren:()=>import("./vendor-managment/vendor-management.module").then(m=>m.VendorManagementModule)},
{path:'olreport',loadChildren:()=>import("./get-report/get-report.module").then(m=>m.GetReportModule)},
{path:'set-backup',component:SetBackupComponent},
{path:'sctworkflow', component:SessionPublisherComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
