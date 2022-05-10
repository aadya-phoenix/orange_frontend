import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorManagementRoutingModule } from './vendor-management-routing.module';
import { VendorManagementListComponent } from './vendor-management-list/vendor-management-list.component';
import { VendorManagementCreateComponent } from './vendor-management-create/vendor-management-create.component';
import { VendorManagementViewComponent } from './vendor-management-view/vendor-management-view.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    VendorManagementListComponent,
    VendorManagementCreateComponent,
    VendorManagementViewComponent
  ],
  imports: [
    CommonModule,
    VendorManagementRoutingModule,
    SharedModule,
    NgxPaginationModule,
    NgSelectModule,
    RichTextEditorAllModule,
    NgbModule
  ]
})
export class VendorManagementModule { }
