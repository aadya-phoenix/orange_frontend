import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PdltoolsRoutingModule } from './pdltools-routing.module';
import { PdltoolsComponent } from './pdltools.component';
import { PdltoolsDetailsComponent } from './pdltools-details/pdltools-details.component';

@NgModule({
  declarations: [PdltoolsComponent, PdltoolsDetailsComponent],
  entryComponents:[PdltoolsDetailsComponent],
  imports: [
    CommonModule,
    PdltoolsRoutingModule,
    SharedModule,
    NgSelectModule,
    NgxPaginationModule,
    NgbModule,
  ]
})
export class PdltoolsModule { }
