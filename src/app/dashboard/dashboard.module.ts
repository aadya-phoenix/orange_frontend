import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SetBackupComponent } from './set-backups/set-backup/set-backup.component';
import { SessionPublisherComponent } from './set-backups/session-publisher/session-publisher.component';
import { SwitchUserComponent } from './switch-user/switch-user.component';


@NgModule({
  declarations: [DashboardComponent, SetBackupComponent, SessionPublisherComponent, SwitchUserComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    
  ]
})
export class DashboardModule { }
