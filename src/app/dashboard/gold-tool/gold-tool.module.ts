import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { GoldToolRoutingModule } from './gold-tool-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoldToolListComponent } from './gold-tool-list/gold-tool-list.component';
import { GoldToolCreateComponent } from './gold-tool-create/gold-tool-create.component';
import { GoldToolViewComponent } from './gold-tool-view/gold-tool-view.component';
import { GoldToolCompleteReportComponent } from './gold-tool-complete-report/gold-tool-complete-report.component';
import { GoldToolHistoryComponent } from './gold-tool-history/gold-tool-history.component';

@NgModule({
  declarations: [
    GoldToolListComponent,
    GoldToolCreateComponent,
    GoldToolViewComponent,
    GoldToolCompleteReportComponent,
    GoldToolHistoryComponent],
  providers: [DatePipe],
  entryComponents: [
    GoldToolHistoryComponent
  ],
  imports: [
    CommonModule,
    GoldToolRoutingModule,
    SharedModule,
    NgxPaginationModule,
    NgSelectModule,
    NgbModule
  ]
})
export class GoldToolModule { }
