import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorTrainingFormComponent } from './vendor-training-form/vendor-training-form.component';

const routes: Routes = [
  {path:'', component:VendorTrainingFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorTrainingRoutingModule { }
