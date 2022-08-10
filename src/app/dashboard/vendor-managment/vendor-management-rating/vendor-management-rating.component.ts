import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { VendorService } from 'src/app/shared/services/vendor/vendor.service';

@Component({
  selector: 'app-vendor-management-rating',
  templateUrl: './vendor-management-rating.component.html',
  styleUrls: ['./vendor-management-rating.component.scss']
})
export class VendorManagementRatingComponent implements OnInit {

  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  lableConstant: any = { french: {}, english: {}};
  publishVendorForm: FormGroup;
  isSubmitted = false;
  status = '';
  ratings: any = [];
  model = 0;
  RatingList = dataConstant.Ratings;
  selectedRatings = {}
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
    this.publishVendorForm.get("status_comment")?.valueChanges.subscribe(() => {
      this.valueChange();
    });
    this.vendorRatingList();
  }

  requiredMessage(field:any){
    return this.lableConstant.form_fieldname_cannot_be_blank.replace('<form fieldname>', field).replace('<nom du champ>', field);
  }

  vendorRatingList() {
    this.commonService.showLoading();
    this.vendorService.VendorRatingList(this.objectDetail.id).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
          this.ratings = res.data;
      },
      (err: any) => {
        this.commonService.errorHandling(err); 
        this.commonService.hideLoading();
      }
    );
  }

  changeRating(){
    // this.selectedRatings = this.
  }

  submitRating() {
    this.isSubmitted = true;
    if (this.publishVendorForm.invalid) {
      return;
    }
    var data = {
      vendor_id: this.props.objectDetail.id,
      rating: this.model,
      comment: this.publishVendorForm.value.status_comment,
    };
    this.commonService.showLoading();
    this.vendorService.VendorRatings(data).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.commonService.toastSuccessMsg('Vendor', `Rating submitted successfully.`);
        this.vendorRatingList();
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
    if (this.publishVendorForm.value.status_comment) {
      this.remainingText = 500 - this.publishVendorForm.value.status_comment.length;
    }
    else {
      this.remainingText = 500;
    }
  }

}
