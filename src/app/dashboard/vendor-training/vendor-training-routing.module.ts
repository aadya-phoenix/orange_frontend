import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorTrainingDashboardComponent } from './vendor-training-dashboard/vendor-training-dashboard.component';
import { VendorTrainingFormComponent } from './external-training/vendor-training-form/vendor-training-form.component';
import { VendorTrainingAddVendorComponent } from './external-training/vendor-training-add-vendor/vendor-training-add-vendor.component';
import { VendorTrainingViewComponent } from './external-training/vendor-training-view/vendor-training-view.component';
import { VendorTrainingListComponent } from './external-training/vendor-training-list/vendor-training-list.component';

const routes: Routes = [
  {path:'', component:VendorTrainingDashboardComponent},
  {path:'list', component:VendorTrainingListComponent},
  {path:'create', component:VendorTrainingFormComponent},
  {path:'add', component:VendorTrainingAddVendorComponent},
  {path:'update/:id', component:VendorTrainingFormComponent},
  {path:'view/:id', component:VendorTrainingViewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorTrainingRoutingModule { }
