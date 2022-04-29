import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselListComponent } from './carousel-list/carousel-list.component';
import { CarouselRoutingModule } from './carousel-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateCarouselComponent } from './create-carousel/create-carousel.component';
import { CarouselViewComponent } from './carousel-view/carousel-view.component';
import { CarouselHistoryComponent } from './carousel-history/carousel-history.component';
import { CarouselPublishComponent } from './carousel-publish/carousel-publish.component';
import { CarouselForwardComponent } from './carousel-forward/carousel-forward.component';
import { CarouselViewReportComponent } from './carousel-view-report/carousel-view-report.component';



@NgModule({
  declarations: [
    CarouselListComponent,
    CreateCarouselComponent,
    CarouselViewComponent,
    CarouselHistoryComponent,
    CarouselPublishComponent,
    CarouselForwardComponent,
    CarouselViewReportComponent,
  ],
  entryComponents:[CarouselHistoryComponent, CarouselPublishComponent, CarouselForwardComponent],
  imports: [
    CommonModule,
    CarouselRoutingModule,
    SharedModule,
    NgxPaginationModule,
    NgSelectModule,
    RichTextEditorAllModule,
    NgbModule
  ],
})
export class CarouselModule { }
