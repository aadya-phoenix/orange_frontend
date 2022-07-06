import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DesignLearningRoutingModule } from './design-learning-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/shared/shared.module';
import { DesignLearningCreateComponent } from './design-learning-create/design-learning-create.component';
import { DesignLearningListComponent } from './design-learning-list/design-learning-list.component';
import { DesignLearningCompleteReportComponent } from './design-learning-complete-report/design-learning-complete-report.component';
import { DesignLearningViewComponent } from './design-learning-view/design-learning-view.component';
import { DesignLearningForwardComponent } from './design-learning-forward/design-learning-forward.component';
import { DesignLearningHistoryComponent } from './design-learning-history/design-learning-history.component';
import { DesignLearningChatComponent } from './design-learning-chat/design-learning-chat.component';
import { DesignLearningRatingComponent } from './design-learning-rating/design-learning-rating.component';


@NgModule({
  declarations: [DesignLearningCreateComponent, DesignLearningListComponent, DesignLearningCompleteReportComponent, DesignLearningViewComponent, DesignLearningForwardComponent, DesignLearningHistoryComponent, DesignLearningChatComponent, DesignLearningRatingComponent],
  entryComponents:[DesignLearningForwardComponent, DesignLearningHistoryComponent,DesignLearningRatingComponent],
  providers:[DatePipe],
  imports: [
    CommonModule,
    DesignLearningRoutingModule,
    SharedModule,
    NgxPaginationModule,
    NgSelectModule,
    NgbModule
  ]
})
export class DesignLearningModule { }
