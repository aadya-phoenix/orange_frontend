import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { OlTestListComponent } from './ol-test-list/ol-test-list.component';
import { OlTestRoutingModule } from './ol-test-routing.module';
import { OlTestCreateComponent } from './ol-test-create/ol-test-create.component';
import { OlTestCreateModelComponent } from './ol-test-create-model/ol-test-create-model.component';
import { OlTestViewComponent } from './ol-test-view/ol-test-view.component';
import { OlTestQuestionCreateComponent } from './ol-test-question-create/ol-test-question-create.component';
import { OlTestSectionCreateComponent } from './ol-test-section-create/ol-test-section-create.component';

@NgModule({
  declarations: [
    OlTestListComponent,
    OlTestCreateComponent,
    OlTestCreateModelComponent,
    OlTestViewComponent,
    OlTestQuestionCreateComponent,
    OlTestSectionCreateComponent],
  providers: [DatePipe],
  entryComponents: [OlTestCreateModelComponent, OlTestSectionCreateComponent, OlTestQuestionCreateComponent],
  imports: [
    CommonModule,
    OlTestRoutingModule,
    SharedModule,
    NgxPaginationModule,
    NgSelectModule,
    NgbModule
  ]
})
export class OlTestModule { }
