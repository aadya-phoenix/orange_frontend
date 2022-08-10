import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { GetReportService } from 'src/app/shared/services/get-report/get-report.service';

@Component({
  selector: 'app-get-report-close-on-update',
  templateUrl: './get-report-close-on-update.component.html',
  styleUrls: ['./get-report-close-on-update.component.scss']
})
export class GetReportCloseOnUpdateComponent implements OnInit {

  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  lableConstant: any = { french: {}, english: {} };
  publishGetReportForm: FormGroup;
  isSubmitted = false;
  status = '';
  GetReportStatus = dataConstant.GetReportStatus;
  constructor(private formBuilder: FormBuilder,
    private modalService: NgbActiveModal,
    private getReportService: GetReportService,
    private commonService: CommonService,
    private router: Router) {
      this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
      this.publishGetReportForm = this.formBuilder.group({
        status_comment: new FormControl('', [Validators.required]),
      });
  }
  public historyList: any;
  public objectDetail: any;
  public modalType: any;
  public title: any;
  remainingText: any = 500;
  copyDeletecourse: any;
  getreportAttachment = { file: '', ext: '' };
  ngOnInit(): void {
    this.objectDetail = this.props.objectDetail ? this.props.objectDetail : '';
    this.title = this.props.title;
    this.status = this.props.status;
    this.publishGetReportForm = this.formBuilder.group({
      report_attachment:new FormControl('',[]),
      status_comment: new FormControl('', this.props.status == this.GetReportStatus.close ? [] : [Validators.required]),
    });
    this.publishGetReportForm.get("status_comment")?.valueChanges.subscribe(() => {
      this.valueChange();
    });
  }

  requiredMessage(field:any){
    return this.lableConstant.form_fieldname_cannot_be_blank.replace('<form fieldname>', field).replace('<nom du champ>', field);
  }

  publishGetReport() {
    this.isSubmitted = true;
    if (this.publishGetReportForm.invalid) {
      return;
    }
    const body = this.props.objectDetail;
    body.report_id = this.props.data;
    body.status_comment = this.publishGetReportForm.value.status_comment,
    body.status = this.props.status,
    body.report_attachment = this.getreportAttachment.file,
    body.report_attachment_ext = this.getreportAttachment.ext

    this.commonService.showLoading();
    this.getReportService.updateReport(body).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.commonService.toastSuccessMsg('Get Report', 'Successfully Saved.');
        this.modalService.close();
        this.router.navigateByUrl(`/dashboard/olreport/view/${body.report_id}`);
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  handleFileInput(event: any) {
    const fsize = event.target.files[0].size;
    const file = Math.round((fsize / 1024)/1024);
    this.commonService.FileConvertintoBytearray(event.target.files[0], async (f) => {
      // creating array bytes
      this.getreportAttachment = { file: this.commonService.byteArrayTobase64(f.bytes), ext: f.name.split('.').pop() };
    });
  }

  closeModal() {
    this.modalService.close();
  }

  onClose() {
    this.passEntry.next();
    this.modalService.close();
  }

  valueChange() {
    if (this.publishGetReportForm.value.status_comment) {
      this.remainingText = 500 - this.publishGetReportForm.value.status_comment.length;
    }
    else {
      this.remainingText = 500;
    }
  }


}
