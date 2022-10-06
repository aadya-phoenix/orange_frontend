import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorTrainingRoutingModule } from './vendor-training-routing.module';
import { VendorTrainingDashboardComponent } from './vendor-training-dashboard/vendor-training-dashboard.component';
import { VendorTrainingFormComponent } from './vendor-training-form/vendor-training-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [VendorTrainingDashboardComponent, VendorTrainingFormComponent],
  imports: [
    CommonModule,
    VendorTrainingRoutingModule,
    SharedModule,
    NgxPaginationModule,
    NgSelectModule,
    NgbModule
  ]
})
export class VendorTrainingModule { }
