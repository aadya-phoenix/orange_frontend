import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CarouselListComponent } from './carousel-list/carousel-list.component';
import { AuthenticationServiceGuard } from 'src/app/shared/services/guards/authentication.guards';
import { CreateCarouselComponent } from './create-carousel/create-carousel.component';
import { CarouselViewComponent } from './carousel-view/carousel-view.component';
import { CarouselViewReportComponent } from './carousel-view-report/carousel-view-report.component';



const routes: Routes = [
  {path:'',component:CarouselListComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'create',component:CreateCarouselComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'create/cct/:course_id',component:CreateCarouselComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'update/:id',component:CreateCarouselComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'view/:id',component:CarouselViewComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'view-complete-report',component:CarouselViewReportComponent,canActivate:[AuthenticationServiceGuard]},
];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class CarouselRoutingModule { }
