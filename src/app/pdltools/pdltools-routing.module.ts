import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationServiceGuard } from '../shared/services/guards/authentication.guards';
import { PdltoolsComponent } from './pdltools.component';

const routes: Routes = [
  {path:'',component:PdltoolsComponent,canActivate:[AuthenticationServiceGuard]},
  ];
  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PdltoolsRoutingModule { }
