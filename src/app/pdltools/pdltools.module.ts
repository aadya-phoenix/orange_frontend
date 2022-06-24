import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PdltoolsRoutingModule } from './pdltools-routing.module';
import { PdltoolsComponent } from './pdltools.component';

@NgModule({
  declarations: [PdltoolsComponent],
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
