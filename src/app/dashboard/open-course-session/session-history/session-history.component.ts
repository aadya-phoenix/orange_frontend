import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourseSessionService } from 'src/app/shared/services/course_session/course-session.service';

@Component({
  selector: 'app-session-history',
  templateUrl: './session-history.component.html',
  styleUrls: ['./session-history.component.scss']
})
export class SessionHistoryComponent implements OnInit {
  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  lableConstant: any = { french: {}, english: {} };
  constructor(
  private modalService: NgbActiveModal, private courseSessionService: CourseSessionService,
  private commonService: CommonService) { 
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
      this.courseSessionService.getSessionHistory(dialogdata.data).subscribe((res: any) => {
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
