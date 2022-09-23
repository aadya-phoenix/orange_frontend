import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationServiceGuard } from '../shared/services/guards/authentication.guards';
import { MessageCreateComponent } from './message-create/message-create.component';
import { MessageListComponent } from './message-list/message-list.component';


const routes: Routes = [
  {path:'',component:MessageListComponent},
  {path:'create',component:MessageCreateComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'edit/:id',component:MessageCreateComponent,canActivate:[AuthenticationServiceGuard]},
  ];
  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessageRoutingModule { }
