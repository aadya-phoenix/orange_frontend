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

  lableConstant: any = { french: {}, english: {} };
  ratingDesignForm: FormGroup;
  isSubmitted = false;
  isSelected = false;
  statusFeedback = '';
  statusChange = '';
  status = '';
  ratings: any = [];
  model = 0;
  isFeedback = false;
  isChange = false;
  RatingList = dataConstant.DesignRatings;
  isRatingSubmitted = false;
  isRating = false
  selectedRatings = {}
  designStatus = dataConstant.DesignStatus;
  getprofileDetails: any;
  public feedbackObj: any = [
    { id: 'close', name: 'Close' },
    { id: 'reject', name: 'Reject' },
  ];
  public statusObj: any = [
    { id: 'design_start', name: 'Design Started' },
    { id: 'development_start', name: 'Development Started' },
    { id: 'on_hold', name: 'On Hold' },
    { id: 'close', name: 'Close Request' },
  ];
  constructor(private formBuilder: FormBuilder,
    private modalService: NgbActiveModal,
    private designService: DesignLearningService,
    private commonService: CommonService,
    private authService: AuthenticationService,
    private router: Router) {
      this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
      this.ratingDesignForm = this.formBuilder.group({
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
    this.status = this.props.status;
    this.ratingDesignForm.get("status_comment")?.valueChanges.subscribe(() => {
      this.valueChange();
    });
    if(this.status == this.designStatus.feedback){
      this.title = 'Feedback';
      this.isFeedback = true;
    }
    if(this.status == this.designStatus.change){
      this.title = 'Change Status';
      this.isChange = true;
    }
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
    if (this.ratingDesignForm.invalid) {
      return;
    }
    var data = {
      new_learning_id: this.props.objectDetail.id,
      rating: this.model,
      comment: this.ratingDesignForm.value.status_comment,
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
    if (this.ratingDesignForm.value.status_comment) {
      this.remainingText = 500 - this.ratingDesignForm.value.status_comment.length;
    }
    else {
      this.remainingText = 500;
    }
  }

  getFeedback(event:any){
    event.id ? this.isSelected = true : this.isSelected = false;
   if (event.id == this.designStatus.close){
     this.isRating = true;
   }
  else{
    this.isRating = false;
  }
  }

  getStatus(event:any){
    event.id ? this.isSelected = true : this.isSelected = false;
    if(this.objectDetail.user_id == this.getprofileDetails.data.id && event.id == this.designStatus.close){
      this.isRating = true;
    }
    else{
      this.isRating = false;
    }
  }
  
  submit(){
    this.isSubmitted = true;
    if (this.ratingDesignForm.invalid) {
      return;
    }
    var body = {
      new_learning_id: this.props.objectDetail.id,
      status: this.status == this.designStatus.feedback ? this.statusFeedback : this.statusChange,
      status_comment: this.ratingDesignForm.value.status_comment,
    };
    this.commonService.showLoading();
    this.designService.changeStatus(body).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if(body.status == this.designStatus.reject){
        this.commonService.toastSuccessMsg('New Learning Module', 'Successfully Rejected.');
        }
        if(body.status == this.designStatus.close){
          this.submitRating();
          this.commonService.toastSuccessMsg('New Learning Module', 'Successfully Closed.');   
        }
        this.modalService.close();
        this.router.navigate(['/dashboard/designlearning']);
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      });
  }
}