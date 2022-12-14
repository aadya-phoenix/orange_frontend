import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ChangePasswordUserComponent } from './change-password-user/change-password-user.component';

@NgModule({
  declarations: [UserManagementComponent, EditUserComponent, ChangePasswordUserComponent],
  providers:[DatePipe],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    NgSelectModule,
    NgxPaginationModule,
    NgbModule
  ]
})
export class UserModule { }
