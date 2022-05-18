import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { GetReportService } from 'src/app/shared/services/get-report/get-report.service';

@Component({
  selector: 'app-get-report-forward',
  templateUrl: './get-report-forward.component.html',
  styleUrls: ['./get-report-forward.component.scss']
})
export class GetReportForwardComponent implements OnInit {

  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  isSubmitted = false;
  public historyList: any;
  public objectDetail: any;
  public modalType: any;
  public title: any;
  backOfficePublisher: any = [];
  copyDeletecourse: any;
  constructor(
    private modalService: NgbActiveModal,
    private getReportService: GetReportService,
    private commonService: CommonService,
    private router: Router) { }

  ngOnInit(): void {
    this.objectDetail = this.props.objectDetail ? this.props.objectDetail : '';
    this.title = this.props.title;
  }
  transferToDA() {
    this.isSubmitted = true;
    if (this.props.objectDetail.id) {
      var data = {
        report_id: this.props.objectDetail.id,
       /*  transfer_id: this.publishBackOfficeForm.value.publisher_id */
      };
      this.commonService.showLoading();
      this.getReportService.getReportTransfer(data).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('Get Report', 'Successfully Transfered.');
          this.modalService.close();
          this.router.navigate(['/dashboard/olreport']);
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.toastErrorMsg('Error', err.message);
        }
      );
    }
    else {
      /* this.passEntry.next(this.publishBackOfficeForm.value.publisher_id); */
      this.modalService.close();
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
