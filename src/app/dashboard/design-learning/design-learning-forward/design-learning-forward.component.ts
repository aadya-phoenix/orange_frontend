import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { DesignLearningService } from 'src/app/shared/services/design-learning/design-learning.service';

@Component({
  selector: 'app-design-learning-forward',
  templateUrl: './design-learning-forward.component.html',
  styleUrls: ['./design-learning-forward.component.scss']
})
export class DesignLearningForwardComponent implements OnInit {

  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  designId:number = 0;
  forwardDesignForm: FormGroup;
  isSubmitted = false;
  status:string='';
  designStatus = dataConstant.DesignStatus;
  RoleID = dataConstant.RoleID;
  isChange = false;
  isFeedback = false;
  public statusObj: any = [
    { id: 'design_start', name: 'Design Started' },
    { id: 'development_start', name: 'Development Started' },
    { id: 'close', name: 'Close Request' },
  ];
  public feedbackObj: any = [
    { id: 'close', name: 'Close' },
    { id: 'reject', name: 'Reject' },
  ];

  constructor(private formBuilder: FormBuilder,
    private modalService: NgbActiveModal,
    private designService: DesignLearningService,
    private commonService: CommonService,
    private router: Router) {
      this.forwardDesignForm = this.formBuilder.group({
        status_comment: new FormControl('', []),
      });
  }
  public historyList: any;
  public objectDetail: any;
  public modalType: any;
  public title: any;
 
  ngOnInit(): void {
    this.objectDetail = this.props.objectDetail ? this.props.objectDetail : '';
    this.designId = this.props.data;
    this.status = this.props.status;
    this.forwardDesignForm = this.formBuilder.group({
      status_comment: new FormControl('', this.status == this.designStatus.reject ? [Validators.required] : []),
    });

    if(this.status == 'change'){
      this.title = 'Change Status';
      this.forwardDesignForm.addControl('status', new FormControl(null, [Validators.required]));
      this.isChange = true;
    }
    if(this.status == 'feedback'){
      this.title = 'Feedback';
      this.forwardDesignForm.addControl('status', new FormControl(null, [Validators.required]));
      this.isFeedback = true;
    }
    if(this.status == this.designStatus.forwarded){
      this.title = 'Send for Approval';
      this.forwardDesignForm.removeControl('status');
    }
    if(this.status == this.designStatus.reject){
      this.title = 'Reject Request';
      this.forwardDesignForm.removeControl('status');
    }
    if(this.status == this.designStatus.approve){
      this.title = 'Approve Request';
      this.forwardDesignForm.removeControl('status');
    }
   
  }

  submit() {
    this.isSubmitted = true;
    if (this.forwardDesignForm.invalid) {
      return;
    }
    if(this.status == this.designStatus.forwarded){
      this.objectDetail.status_comment = this.forwardDesignForm.controls.status_comment.value;
       this.commonService.showLoading();
       this.designService.update(this.objectDetail).subscribe(
         (res: any) => {
           this.commonService.hideLoading();
           this.commonService.toastSuccessMsg('New Learning Module', 'Successfully Sent for Approval.');
           this.modalService.close();
           this.router.navigate(['/dashboard/designlearning']);
         },
         (err: any) => {
           this.commonService.hideLoading();
           this.commonService.errorHandling(err);
         });
      }

    if(this.status == this.designStatus.reject || this.status == this.designStatus.approve || 
      this.status == 'change' || this.status == 'feedback'){
      const body = this.forwardDesignForm.value;
      body.new_learning_id = this.designId;
      this.status == this.designStatus.reject || this.status == this.designStatus.approve ?
      body.status = this.status : '';
      this.commonService.showLoading();
      this.designService.changeStatus(body).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          if(body.status == this.designStatus.reject){
          this.commonService.toastSuccessMsg('New Learning Module', 'Successfully Rejected.');
          }
          if(body.status == this.designStatus.approve){
          this.commonService.toastSuccessMsg('New Learning Module', 'Successfully Approved.');   
          }
          if(body.status == this.designStatus.close){
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

  closeModal() {
    this.modalService.close();
  }

  onClose() {
    this.passEntry.next();
    this.modalService.close();
  }
}
