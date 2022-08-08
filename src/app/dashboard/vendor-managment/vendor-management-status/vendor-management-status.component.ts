import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CarouselService } from 'src/app/shared/services/carousel/carousel.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { VendorService } from 'src/app/shared/services/vendor/vendor.service';

@Component({
  selector: 'app-vendor-management-status',
  templateUrl: './vendor-management-status.component.html',
  styleUrls: ['./vendor-management-status.component.scss']
})
export class VendorManagementStatusComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  publishVendorForm: FormGroup;
  isSubmitted = false;
  status = '';
  VendorStatus = dataConstant.VendorStatus;
  constructor(private formBuilder: FormBuilder,
    private modalService: NgbActiveModal,
    private vendorService: VendorService,
    private commonService: CommonService,
    private router: Router) {
      this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
      this.publishVendorForm = this.formBuilder.group({
        status_comment: new FormControl('', [Validators.required]),
      });
  }
  public historyList: any;
  public objectDetail: any;
  public modalType: any;
  public title: any;
  remainingText: any = 500;
  ngOnInit(): void {
    this.objectDetail = this.props.objectDetail ? this.props.objectDetail : '';
    this.title = this.props.title;
    this.status = this.props.status;
    this.publishVendorForm.get("status_comment")?.valueChanges.subscribe(() => {
      this.valueChange();
    });
  }

  publishVendor() {
    this.isSubmitted = true;
    if (this.publishVendorForm.invalid) {
      return;
    }
    var data = {
      vendor_id: this.props.objectDetail.id,
      status_comment: this.publishVendorForm.value.status_comment,
      status: this.props.status
    };
    this.commonService.showLoading();
    this.vendorService.VendorStatus(data).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.commonService.toastSuccessMsg('Vendor', `Successfully ${this.props.status}.`);
        this.modalService.close();
        this.passEntry.next();
       },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err); 
      }
    );
  }

  closeModal() {
    this.passEntry.next();
    this.modalService.close();
  }

  onClose() {
    this.passEntry.next();
    this.modalService.close();
  }

  valueChange() {
    if (this.publishVendorForm.value.status_comment) {
      this.remainingText = 500 - this.publishVendorForm.value.status_comment.length;
    }
    else {
      this.remainingText = 500;
    }
  }

}
