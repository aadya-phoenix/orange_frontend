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
import { SmedbViewComponent } from './smedb-view/smedb-view.component';
import { SmedbViewReportComponent } from './smedb-view-report/smedb-view-report.component';
import { SmedbRatingComponent } from './smedb-rating/smedb-rating.component';
import { SmedbStatusComponent } from './smedb-status/smedb-status.component';
import { SmedbHistoryComponent } from './smedb-history/smedb-history.component';
import { SmedbTermsComponent } from './smedb-terms/smedb-terms.component';
import { NgxDropzoneModule } from 'ngx-dropzone';

@NgModule({
  declarations: [
    SmedbListComponent,
    SmedbCreateComponent,
    SmedbViewComponent,
    SmedbViewReportComponent,
    SmedbRatingComponent,
    SmedbStatusComponent,
    SmedbHistoryComponent,
    SmedbTermsComponent
  ],
  entryComponents:[SmedbRatingComponent, SmedbStatusComponent, SmedbHistoryComponent, SmedbTermsComponent],
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
