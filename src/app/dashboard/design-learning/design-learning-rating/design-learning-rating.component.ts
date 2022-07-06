import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { DesignLearningService } from 'src/app/shared/services/design-learning/design-learning.service';


@Component({
  selector: 'app-design-learning-rating',
  templateUrl: './design-learning-rating.component.html',
  styleUrls: ['./design-learning-rating.component.scss']
})
export class DesignLearningRatingComponent implements OnInit {
  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  publishDesignForm: FormGroup;
  isSubmitted = false;
  status = '';
  ratings: any = [];
  model = 0;
  RatingList = dataConstant.DesignRatings;
  isRatingSubmitted = false;
  selectedRatings = {}
  designStatus = dataConstant.DesignStatus;
  getprofileDetails: any;
  constructor(private formBuilder: FormBuilder,
    private modalService: NgbActiveModal,
    private designService: DesignLearningService,
    private commonService: CommonService,
    private authService: AuthenticationService,
    private router: Router) {
      this.publishDesignForm = this.formBuilder.group({
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
    this.publishDesignForm.get("status_comment")?.valueChanges.subscribe(() => {
      this.valueChange();
    });
    this.designRatingList();
  }

  designRatingList() {
    this.commonService.showLoading();
    this.designService.designRatingList(this.objectDetail.id).subscribe(
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
    if (this.publishDesignForm.invalid) {
      return;
    }
    var data = {
      new_learning_id: this.props.objectDetail.id,
      rating: this.model,
      comment: this.publishDesignForm.value.status_comment,
    };
    this.commonService.showLoading();
    this.designService.designRatings(data).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.commonService.toastSuccessMsg('New Learning', `Rating submitted successfully.`);
        this.designRatingList();
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
    if (this.publishDesignForm.value.status_comment) {
      this.remainingText = 500 - this.publishDesignForm.value.status_comment.length;
    }
    else {
      this.remainingText = 500;
    }
  }

}