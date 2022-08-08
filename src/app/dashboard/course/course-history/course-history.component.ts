import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';

@Component({
  selector: 'app-course-history',
  templateUrl: './course-history.component.html',
  styleUrls: ['./course-history.component.scss']
})
export class CourseHistoryComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  constructor(private modalService: NgbActiveModal, private courseService: CourcesService, private router: Router, private commonService: CommonService) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
  }
  public courseHistory: any;
  public courseDetail: any;
  public modalType: any;
  public title: any;
  ngOnInit(): void {
    this.setDialogProps(this.props)
  }

  setDialogProps(dialogdata: any) {
    this.courseDetail = dialogdata.objectDetail ? dialogdata.objectDetail : '';
    this.title = dialogdata.title
    this.modalType = dialogdata.type;
    this.commonService.showLoading();
    this.courseService.courseHistory(dialogdata.data).subscribe((res: any) => {
      this.commonService.hideLoading();
      if (res && res.status == 1) {
        this.courseHistory = res.data;
      }
    });
  }


  // setDialogProps(dialogdata:any){
  //   this.courseHistory = dialogdata.data ? dialogdata.data : '';
  //   this.courseDetail = dialogdata.data1 ? dialogdata.data1 : '';
  //   this.title= dialogdata.title
  //   this.modalType = dialogdata.type;
  // }

  closeModal() {
    this.modalService.close();
  }

  onClose() {
    this.passEntry.next();
    this.modalService.close();
  }


}
