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
import { OlTestCreateScormComponent } from './ol-test-create-scorm/ol-test-create-scorm.component';
import { OlTestViewComponent } from './ol-test-view/ol-test-view.component';

@NgModule({
  declarations: [
    OlTestListComponent,
    OlTestCreateComponent,
    OlTestCreateModelComponent,
    OlTestCreateScormComponent,
    OlTestViewComponent],
  providers: [DatePipe],
  entryComponents: [OlTestCreateModelComponent],
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
