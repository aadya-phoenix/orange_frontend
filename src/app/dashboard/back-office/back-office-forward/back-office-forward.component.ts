import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BackOfficeService } from 'src/app/shared/services/back-office/back-office.service';
import { CommonService } from 'src/app/shared/services/common/common.service';


@Component({
  selector: 'app-back-office-forward',
  templateUrl: './back-office-forward.component.html',
  styleUrls: ['./back-office-forward.component.scss']
})
export class BackOfficeForwardComponent implements OnInit {

  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  publishBackOfficeForm: FormGroup;
  isSubmitted = false;
  constructor(private formBuilder: FormBuilder,
    private modalService: NgbActiveModal,
    private backOfficeService: BackOfficeService,
    private commonService: CommonService,
    private router: Router) {
    this.publishBackOfficeForm = this.formBuilder.group({
      publisher_id: new FormControl('', [Validators.required]),
    });
  }
  public historyList: any;
  public objectDetail: any;
  public modalType: any;
  public title: any;
  backOfficePublisher: any = [];
  copyDeletecourse: any;
  ngOnInit(): void {
    this.objectDetail = this.props.objectDetail ? this.props.objectDetail : '';
    this.title = this.props.title;
    this.getBackOfficePublisher();
  }

  getBackOfficePublisher() {
    this.commonService.showLoading();
    this.backOfficeService.getBackOfficePublisher().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.backOfficePublisher = res.data;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  transferToPublisher() {
    this.isSubmitted = true;
    if (this.publishBackOfficeForm.invalid) {
      return;
    }
    if (this.props.objectDetail.id) {
      var data = {
        back_office_id: this.props.objectDetail.id,
        transfer_id: this.publishBackOfficeForm.value.publisher_id
      };
      this.commonService.showLoading();
      this.backOfficeService.backOfficeTransfer(data).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('BackOffice', 'Successfully Transfered.');
          this.modalService.close();
          this.router.navigate(['/dashboard/back-office']);
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.toastErrorMsg('Error', err.message);
        }
      );
    }
    else {
      this.passEntry.next(this.publishBackOfficeForm.value.publisher_id);
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
