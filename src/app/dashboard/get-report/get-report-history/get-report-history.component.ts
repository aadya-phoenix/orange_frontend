import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { GetReportService } from 'src/app/shared/services/get-report/get-report.service';

@Component({
  selector: 'app-get-report-history',
  templateUrl: './get-report-history.component.html',
  styleUrls: ['./get-report-history.component.scss']
})
export class GetReportHistoryComponent implements OnInit {

  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  constructor(private modalService: NgbActiveModal, private getReportService: GetReportService,  private commonService: CommonService) { }
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
      this.getReportService.getReportHistory(dialogdata.data).subscribe((res: any) => {
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

