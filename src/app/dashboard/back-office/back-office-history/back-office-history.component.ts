import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BackOfficeService } from 'src/app/shared/services/back-office/back-office.service';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Component({
  selector: 'app-back-office-history',
  templateUrl: './back-office-history.component.html',
  styleUrls: ['./back-office-history.component.scss']
})
export class BackOfficeHistoryComponent implements OnInit {

  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  constructor(private modalService: NgbActiveModal, private backOfficeService: BackOfficeService,  private commonService: CommonService) { }
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
      this.backOfficeService.backOfficeHistory(dialogdata.data).subscribe((res: any) => {
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
