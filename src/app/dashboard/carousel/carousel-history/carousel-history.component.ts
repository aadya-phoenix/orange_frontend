import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CarouselService } from 'src/app/shared/services/carousel/carousel.service';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Component({
  selector: 'app-carousel-history',
  templateUrl: './carousel-history.component.html',
  styleUrls: ['./carousel-history.component.scss']
})
export class CarouselHistoryComponent implements OnInit {

  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  lableConstant: any = { french: {}, english: {} };
  constructor(private modalService: NgbActiveModal, private carouselService: CarouselService,  private commonService: CommonService) { 
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
  }
  public historyList: any;
  public objectDetail: any;
  public modalType: any;
  public title: any;
  copyDeletecourse: any;
  ngOnInit(): void {
    this.setDialogProps(this.props)
  }

  setDialogProps(dialogdata: any) {
    this.objectDetail = dialogdata.objectDetail ? dialogdata.objectDetail : '';
    this.title = dialogdata.title
    this.modalType = dialogdata.type;
    if (this.modalType === 'viewhistory') {
      this.commonService.showLoading();
      this.carouselService.carouselHistory(dialogdata.data).subscribe((res: any) => {
        this.commonService.hideLoading();
        if (res && res.status == 1) {
          this.historyList = res.data;
        }
      });
    }
  }

  closeModal() {
    this.modalService.close();
  }

  onClose() {
    this.passEntry.next();
    this.modalService.close();
  }

}
