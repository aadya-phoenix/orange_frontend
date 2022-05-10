import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationServiceGuard } from 'src/app/shared/services/guards/authentication.guards';
import { VendorManagementCreateComponent } from './vendor-management-create/vendor-management-create.component';
import { VendorManagementListComponent } from './vendor-management-list/vendor-management-list.component';
import { VendorManagementViewComponent } from './vendor-management-view/vendor-management-view.component';


const routes: Routes = [
  {path:'',component:VendorManagementListComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'create',component:VendorManagementCreateComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'update/:id',component:VendorManagementCreateComponent,canActivate:[AuthenticationServiceGuard]},
  {path:'view/:id',component:VendorManagementViewComponent,canActivate:[AuthenticationServiceGuard]},
];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class VendorManagementRoutingModule { }
