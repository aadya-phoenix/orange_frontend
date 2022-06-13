import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { BackOfficeService } from 'src/app/shared/services/back-office/back-office.service';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Component({
  selector: 'app-back-office-publish',
  templateUrl: './back-office-publish.component.html',
  styleUrls: ['./back-office-publish.component.scss']
})
export class BackOfficePublishComponent implements OnInit {

  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  publishBackOfficeForm: FormGroup;
  isSubmitted = false;
  status = '';
  BackOfficeStatus = dataConstant.BackOfficeStatus;
  constructor(private formBuilder: FormBuilder,
    private modalService: NgbActiveModal,
    private backOfficeService: BackOfficeService,
    private commonService: CommonService,
    private router: Router) {
      this.publishBackOfficeForm = this.formBuilder.group({
        status_comment: new FormControl('', [Validators.required]),
      });
  }
  public historyList: any;
  public objectDetail: any;
  public modalType: any;
  public title: any;
  remainingText: any = 500;
  backOfficePublisher: any = [];
  copyDeletecourse: any;
  ngOnInit(): void {
    this.objectDetail = this.props.objectDetail ? this.props.objectDetail : '';
    this.title = this.props.title;
    this.status = this.props.status;

    this.publishBackOfficeForm = this.formBuilder.group({
      status_comment: new FormControl('', this.props.status == this.BackOfficeStatus.publish ? [] : [Validators.required]),
    });
    this.publishBackOfficeForm.get("status_comment")?.valueChanges.subscribe(() => {
      this.valueChange();
    });
  }

  publishBackOffice() {
    this.isSubmitted = true;
    if (this.publishBackOfficeForm.invalid) {
      return;
    }
    var data = {
      back_office_id: this.props.objectDetail.id,
      status_comment: this.publishBackOfficeForm.value.status_comment,
      status: this.props.status
    };
    this.commonService.showLoading();
    this.backOfficeService.backOfficeStatus(data).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.commonService.toastSuccessMsg('BackOffice', `Successfully ${this.props.status}.`);
        this.modalService.close();
        this.router.navigate(['/dashboard/back-office']);
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  closeModal() {
    this.modalService.close();
  }

  onClose() {
    this.passEntry.next();
    this.modalService.close();
  }

  valueChange() {
    if (this.publishBackOfficeForm.value.status_comment) {
      this.remainingText = 500 - this.publishBackOfficeForm.value.status_comment.length;
    }
    else {
      this.remainingText = 500;
    }
  }


}
