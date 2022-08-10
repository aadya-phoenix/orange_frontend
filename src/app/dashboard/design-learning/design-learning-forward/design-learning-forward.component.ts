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

  lableConstant: any = { french: {}, english: {} };
  designId:number = 0;
  forwardDesignForm: FormGroup;
  isSubmitted = false;
  projectManagerList:any=[];
  status:string='';
  designStatus = dataConstant.DesignStatus;
  RoleID = dataConstant.RoleID;
  isChange = false;
  isFeedback = false;
  isApprove = false;
  public statusObj: any = [
    { id: 'design_start', name: 'Design Started' },
    { id: 'development_start', name: 'Development Started' },
    { id: 'close', name: 'Close Request' },
  ];


  constructor(private formBuilder: FormBuilder,
    private modalService: NgbActiveModal,
    private designService: DesignLearningService,
    private commonService: CommonService,
    private router: Router) {
      this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
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
    this.getProjectManager();

    if(this.status == this.designStatus.change){
      this.title = 'Change Status';
      this.forwardDesignForm.addControl('status', new FormControl(null, [Validators.required]));
      this.isChange = true;
    }
    if(this.status == this.designStatus.feedback){
      this.title = 'Feedback';
      this.forwardDesignForm.addControl('status', new FormControl(null, [Validators.required]));
      this.isFeedback = true;
    }
    if(this.status == this.designStatus.forwarded){
      this.title = 'Send for Approval ( PD&L Management )';
      this.forwardDesignForm.removeControl('status');
    }
    if(this.status == this.designStatus.reject){
      this.title = this.lableConstant.reject_request;
      this.forwardDesignForm.removeControl('status');
    }
    if(this.status == this.designStatus.onHold){
      this.title = 'On Hold Request';
      this.forwardDesignForm.removeControl('status');
    }
    if(this.status == this.designStatus.approve){
      this.title = this.lableConstant.approve_request;
      this.isApprove = true;
      this.forwardDesignForm.addControl('project_manager', new FormControl(null, [Validators.required]));
      this.forwardDesignForm.removeControl('status');
    }
   
  }

  requiredMessage(field:any){
    return this.lableConstant.form_fieldname_cannot_be_blank.replace('<form fieldname>', field).replace('<nom du champ>', field);
  }

  submit() {
    this.isSubmitted = true;
    if (this.forwardDesignForm.invalid) {
      return;
    }
    if(this.status == this.designStatus.forwarded || this.status == this.designStatus.approve){
      this.objectDetail.status_comment = this.forwardDesignForm.controls.status_comment.value;
      if(this.status == this.designStatus.approve){
        this.objectDetail.project_manager = this.forwardDesignForm.controls.project_manager.value;
      }
       this.commonService.showLoading();
       this.designService.update(this.objectDetail).subscribe(
         (res: any) => {
           this.commonService.hideLoading();
           if(this.status == this.designStatus.approve){
            this.commonService.toastSuccessMsg('New Learning Module', 'Successfully Sent for Approval.');
           }
           if(this.status == this.designStatus.forwarded){
            this.commonService.toastSuccessMsg('New Learning Module', 'Successfully Approved.');
           }
           this.modalService.close();
           this.router.navigate(['/dashboard/designlearning']);
         },
         (err: any) => {
           this.commonService.hideLoading();
           this.commonService.errorHandling(err);
         });
      }

    if(this.status == this.designStatus.reject  || this.status == this.designStatus.onHold ||
      this.status == this.designStatus.change || this.status == this.designStatus.feedback){
      const body = this.forwardDesignForm.value;
      body.new_learning_id = this.designId;
      this.status == this.designStatus.reject  ?
      body.status = this.status : '';
      if(this.status == this.designStatus.onHold){
        body.status = this.status;
      }
      this.commonService.showLoading();
      this.designService.changeStatus(body).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          if(body.status == this.designStatus.reject){
          this.commonService.toastSuccessMsg('New Learning Module', 'Successfully Rejected.');
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

  getProjectManager(){
    this.designService.getProjectManager().subscribe( (res: any) => {
      this.commonService.hideLoading();
      this.projectManagerList = res.data;
    },
    (err: any) => {
      this.commonService.hideLoading();
      this.commonService.toastErrorMsg('Error', err.message);
    });
  }

  closeModal() {
    this.modalService.close();
  }

  onClose() {
    this.passEntry.next();
    this.modalService.close();
  }
}
