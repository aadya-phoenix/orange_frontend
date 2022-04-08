import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CarouselListComponent } from './carousel-list/carousel-list.component';
import { AuthenticationServiceGuard } from 'src/app/shared/services/guards/authentication.guards';
import { CreateCarouselComponent } from './create-carousel/create-carousel.component';



const routes: Routes = [
  {path:'',component:CarouselListComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'create',component:CreateCarouselComponent,canActivate:[AuthenticationServiceGuard]},
];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class CarouselRoutingModule { }
