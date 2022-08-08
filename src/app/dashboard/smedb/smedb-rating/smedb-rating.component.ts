import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { SMEService } from 'src/app/shared/services/sme/sme.service';

@Component({
  selector: 'app-smedb-rating',
  templateUrl: './smedb-rating.component.html',
  styleUrls: ['./smedb-rating.component.scss']
})
export class SmedbRatingComponent implements OnInit {
  lableConstant: any = { french: {}, english: {}};
  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  publishSMEForm: FormGroup;
  isSubmitted = false;
  status = '';
  ratings: any = [];
  model = 0;
  RatingList = dataConstant.Ratings;
  isRatingSubmitted = false;
  selectedRatings = {}
  SMEStatus = dataConstant.SMEStatus;
  getprofileDetails: any;
  constructor(private formBuilder: FormBuilder,
    private modalService: NgbActiveModal,
    private smeService: SMEService,
    private commonService: CommonService,
    private authService: AuthenticationService,
    private router: Router) {
      this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
      this.publishSMEForm = this.formBuilder.group({
        status_comment: new FormControl('', [Validators.required]),
      });
      this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
  }
  public historyList: any;
  public objectDetail: any;
  public modalType: any;
  public title: any;
  remainingText: any = 500;
  ngOnInit(): void {
    this.objectDetail = this.props.objectDetail ? this.props.objectDetail : '';
    this.publishSMEForm.get("status_comment")?.valueChanges.subscribe(() => {
      this.valueChange();
    });
    this.SMERatingList();
  }

  SMERatingList() {
    this.commonService.showLoading();
    this.smeService.SMERatingList(this.objectDetail.id).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.ratings = res.data;
        if(this.ratings.find((x: { submitted_by: any; }) =>x.submitted_by === this.getprofileDetails.data.id)){
          this.isRatingSubmitted = true;
        }

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
    if (this.publishSMEForm.invalid) {
      return;
    }
    var data = {
      sme_id: this.props.objectDetail.id,
      rating: this.model,
      comment: this.publishSMEForm.value.status_comment,
    };
    this.commonService.showLoading();
    this.smeService.SMERatings(data).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.commonService.toastSuccessMsg('SME', `Rating submitted successfully.`);
        this.SMERatingList();
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
    if (this.publishSMEForm.value.status_comment) {
      this.remainingText = 500 - this.publishSMEForm.value.status_comment.length;
    }
    else {
      this.remainingText = 500;
    }
  }

}
