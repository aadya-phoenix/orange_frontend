import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [UserManagementComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    NgSelectModule
  ]
})
export class UserModule { }
