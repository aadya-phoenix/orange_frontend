import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SetBackupComponent } from './set-backup/set-backup.component';





@NgModule({
  declarations: [DashboardComponent, SetBackupComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    
    SharedModule,
    
  ]
})
export class DashboardModule { }
