import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { VendorTrainingRoutingModule } from './vendor-training-routing.module';
import { VendorTrainingDashboardComponent } from './vendor-training-dashboard/vendor-training-dashboard.component';
import { VendorTrainingFormComponent } from './external-training/vendor-training-form/vendor-training-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { VendorTrainingViewComponent } from './external-training/vendor-training-view/vendor-training-view.component';
import { VendorTrainingListComponent } from './external-training/vendor-training-list/vendor-training-list.component';
import { VendorTrainingAddVendorComponent } from './external-training/vendor-training-add-vendor/vendor-training-add-vendor.component';
import { VendorTrainingEvaluationComponent } from './external-training/vendor-training-evaluation/vendor-training-evaluation.component';
import { VendorTrainingPoCreationComponent } from './external-training/vendor-training-po-creation/vendor-training-po-creation.component';
import { VendorTrainingPoApprovalComponent } from './external-training/vendor-training-po-approval/vendor-training-po-approval.component';
import { VendorTrainingHistoryComponent } from './external-training/vendor-training-history/vendor-training-history.component';


@NgModule({
  declarations: [VendorTrainingDashboardComponent, VendorTrainingFormComponent, VendorTrainingViewComponent, VendorTrainingListComponent, VendorTrainingAddVendorComponent, VendorTrainingEvaluationComponent, VendorTrainingPoCreationComponent, VendorTrainingPoApprovalComponent, VendorTrainingHistoryComponent],
  providers:[DatePipe],
  entryComponents: [
    VendorTrainingHistoryComponent
  ],
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
