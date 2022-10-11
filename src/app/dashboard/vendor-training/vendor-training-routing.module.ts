import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorTrainingDashboardComponent } from './vendor-training-dashboard/vendor-training-dashboard.component';
import { VendorTrainingFormComponent } from './external-training/vendor-training-form/vendor-training-form.component';
import { VendorTrainingAddVendorComponent } from './external-training/vendor-training-add-vendor/vendor-training-add-vendor.component';

const routes: Routes = [
  {path:'', component:VendorTrainingDashboardComponent},
  {path:'create', component:VendorTrainingFormComponent},
  {path:'add', component:VendorTrainingAddVendorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorTrainingRoutingModule { }
