import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { GetReportService } from 'src/app/shared/services/get-report/get-report.service';

@Component({
  selector: 'app-get-report-transfer-to-other-roc',
  templateUrl: './get-report-transfer-to-other-roc.component.html',
  styleUrls: ['./get-report-transfer-to-other-roc.component.scss']
})
export class GetReportTransferToOtherRocComponent implements OnInit {
  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  cordinatorsList: any = [];
  publishGetReportForm: FormGroup;
  isSubmitted = false;
  constructor(private courseService: CourcesService,
    private formBuilder: FormBuilder,
    private modalService: NgbActiveModal,
    private getReportService: GetReportService,
    private commonService: CommonService,
    private router: Router) { 
      this.publishGetReportForm = this.formBuilder.group({
        publisher_id: new FormControl('', [Validators.required]),
        status_comment: new FormControl('')
      });
    }

  ngOnInit(): void {
    this.getCordinators();
  }

  getCordinators() {
    this.commonService.showLoading();
    this.courseService.getNewregionalCordinator().subscribe(
      (res: any) => {
        this.cordinatorsList = res.data;
        this.commonService.hideLoading();
      },
      (err: any) => {
        this.commonService.errorHandling(err);
        this.commonService.hideLoading();
      }
    );
  }

  transferToOtherRoc() {
    this.isSubmitted = true;
    if (this.publishGetReportForm.invalid) {
      return;
    }
    if (this.props.objectDetail.id) {
      var data = {
        report_id: this.props.objectDetail.id,
        transfer_id: this.publishGetReportForm.value.publisher_id,
        status_comment: this.publishGetReportForm.value.status_comment,
        transfer_id_type: "region"
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
          this.commonService.errorHandling(err);
        }
      );
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