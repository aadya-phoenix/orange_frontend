import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
  constructor(private modalService: NgbActiveModal, private carouselService: CarouselService,  private commonService: CommonService) { }
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


  // deleteRequest() {
  //   this.courseService.deleteCourse({ course_id: this.copyDeletecourse.id }).subscribe((res: any) => {
  //     console.log(res);
  //     this.onClose();
  //   }, (err: any) => {
  //     console.log(err)
  //   })
  // }

  // copyRequest() {
  //   this.courseService.copyCourse({ course_id: this.copyDeletecourse.id }).subscribe((res: any) => {
  //     console.log(res);
  //     let dataobj = res.data;
  //     let iscopyy = { copy: true };
  //     let totalObj = { ...res.data, ...iscopyy }
  //     this.router.navigateByUrl('/dashboard/cources/create-cource', {
  //       state: totalObj,
  //     });
  //     this.onClose();
  //   }, (err: any) => {
  //     console.log(err)
  //   })
  // }
  closeModal() {
    this.modalService.close();
  }

  onClose() {
    this.passEntry.next();
    this.modalService.close();
  }

}
