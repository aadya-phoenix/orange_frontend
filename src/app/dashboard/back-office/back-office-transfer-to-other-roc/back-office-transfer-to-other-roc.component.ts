import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BackOfficeService } from 'src/app/shared/services/back-office/back-office.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';

@Component({
  selector: 'app-back-office-transfer-to-other-roc',
  templateUrl: './back-office-transfer-to-other-roc.component.html',
  styleUrls: ['./back-office-transfer-to-other-roc.component.scss']
})
export class BackOfficeTransferToOtherRocComponent implements OnInit {
  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  cordinatorsList: any = [];
  publishBackOfficeForm: FormGroup;
  isSubmitted = false;
  constructor(private courseService: CourcesService,
    private formBuilder: FormBuilder,
    private modalService: NgbActiveModal,
    private backOfficeService: BackOfficeService,
    private commonService: CommonService,
    private router: Router) { 
      this.publishBackOfficeForm = this.formBuilder.group({
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
        console.log(err);
        this.commonService.hideLoading();
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
        transfer_id: this.publishBackOfficeForm.value.publisher_id,
        status_comment: this.publishBackOfficeForm.value.status_comment,
        transfer_id_type: "region"
      };
      this.commonService.showLoading();
      this.backOfficeService.backOfficeTransfer(data).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('Back Office', 'Successfully Transfered.');
          this.modalService.close();
          this.router.navigate(['/dashboard/back-office']);
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.toastErrorMsg('Error', err.message);
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