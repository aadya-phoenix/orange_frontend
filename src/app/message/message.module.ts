import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MessageRoutingModule } from './message-routing.module';
import { MessageListComponent } from './message-list/message-list.component';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageCreateComponent } from './message-create/message-create.component';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';

@NgModule({
  declarations: [MessageListComponent, MessageCreateComponent],
  providers:[DatePipe],
  imports: [
    CommonModule,
    MessageRoutingModule,
    SharedModule,
    NgSelectModule,
    NgxPaginationModule,
    NgbModule,
    RichTextEditorAllModule
  ]
})
export class MessageModule { }
