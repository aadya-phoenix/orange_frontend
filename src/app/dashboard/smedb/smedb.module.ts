import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmedbRoutingModule } from './smedb-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { SmedbListComponent } from './smedb-list/smedb-list.component';
import { SmedbCreateComponent } from './smedb-create/smedb-create.component';
import { NgxDropzoneModule } from 'ngx-dropzone';

@NgModule({
  declarations: [
    SmedbListComponent,
    SmedbCreateComponent,
  ],
  entryComponents:[],
  imports: [
    CommonModule,
    SmedbRoutingModule,
    SharedModule,
    NgxPaginationModule,
    NgSelectModule,
    RichTextEditorAllModule,
    NgbModule,
   NgxDropzoneModule
  ],
})
export class SmedbModule {}
