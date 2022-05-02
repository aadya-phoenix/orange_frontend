import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { BackOfficeService } from 'src/app/shared/services/back-office/back-office.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import Swal from 'sweetalert2';
import { BackOfficeForwardComponent } from '../back-office-forward/back-office-forward.component';
import { BackOfficeHistoryComponent } from '../back-office-history/back-office-history.component';
import { BackOfficePublishComponent } from '../back-office-publish/back-office-publish.component';
const emailregexp = dataConstant.EmailPattren;

@Component({
  selector: 'app-create-back-office',
  templateUrl: './create-back-office.component.html',
  styleUrls: ['./create-back-office.component.scss']
})
export class CreateBackOfficeComponent implements OnInit {
  today = new Date();
  minDate = {};
  RoleID = dataConstant.RoleID;
  dateFormate = dataConstant.dateFormate;
  BackOfficeStatus = dataConstant.BackOfficeStatus;
  back_office_id = 0;
  back_office_details: any = {};
  preferedInstructor: any = [];
  entityList: any = [];
  languageList: any = [];
  cctExpiryperiod: any = [];
  backOfficePublisher: any = [];
  cordinatorsList: any = [];
  backupCordinatorsList: any = [];
  cctDeliveryPerimeter: any = [];
  cctLearningRole: any = [];
  getUserrole: any = {};
  getprofileDetails: any = {};
  createBackOfficeForm: FormGroup;
  languageText = "";
  isReviewer = false;
  isPublisher = false;
  isRequester = false;
  rejectcomment = "";
  backOfficeImage = { image: '', ext: '' };
  isSubmitted = false;
  isCreater = true;
  back_office_count = {
    total: 0,
    draft: 0,
    closed: 0,
    rejected: 0,
    pending: 0,
    submitted: 0,
    transferred: 0,
    expired: 0,
    publish: 0
  }

  constructor(private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private courseService: CourcesService,
    private authService: AuthenticationService,
    private backOfficeService: BackOfficeService) {
    this.minDate = `${this.today.getFullYear()}-${("0" + (this.today.getMonth() + 1)).slice(-2)}-${("0" + this.today.getDate()).slice(-2)}`;
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.getUserrole = this.authService.getRolefromlocal();
    this.isReviewer = this.getUserrole.id === this.RoleID.BackOfficeReviewer;
    this.isPublisher = this.getUserrole.id === this.RoleID.BackOfficePublisher;
    this.isRequester = this.getUserrole.id === this.RoleID.RequesterID;
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.back_office_id = Id ? parseInt(Id) : 0;
    });
    this.createBackOfficeForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required]),
      cuid: new FormControl('', [Validators.required]),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      entity: new FormControl(''),
      course_deliver: new FormControl('',[Validators.required]),
      first_session_date: new FormControl('', [Validators.required]),
      learning_role: new FormControl('', [Validators.required]),
      regional_cordinator: new FormControl('', [Validators.required]),
      additional_comment: new FormControl(''),
      delivery_perimeter: new FormControl('', [Validators.required]),
      agree: new FormControl(false, [Validators.requiredTrue]),
    });
  }

  async ngOnInit() {
    this.getTotalCount();
  }

   //preferred instructor
   getPreferedInstructor() {
    this.commonService.showLoading();
    this.courseService.getpreferedInstructor().subscribe(
      (res: any) => {
        this.preferedInstructor = res.data;
        this.getEntitylist();
        this.commonService.hideLoading();
      },
      (err: any) => {
        console.log(err);
        this.commonService.hideLoading();
      }
    );
  }

  getEntitylist() {
    this.commonService.showLoading();
    this.courseService.getEntitylist().subscribe(
      (res: any) => {
        console.log(res);
        this.entityList = res.data;
        this.getCordinators();
        this.commonService.hideLoading();
      },
      (err: any) => {
        console.log(err);
        this.commonService.hideLoading();
      }
    );
  }

  getCCTDeliveryPerimeter() {
    this.commonService.showLoading();
    this.backOfficeService.getCCTDeliveryPerimeter().subscribe(
      (res: any) => {
        console.log(res);
        this.cctDeliveryPerimeter = res.data;
        this.getCCTLearningRole();
        this.commonService.hideLoading();
      },
      (err: any) => {
        console.log(err);
        this.commonService.hideLoading();
      }
    );
  }
  getCCTLearningRole() {
    this.commonService.showLoading();
    this.backOfficeService.getCCTLearningRole().subscribe(
      (res: any) => {
        console.log(res);
        this.cctLearningRole = res.data;
        this.commonService.hideLoading();
        if (this.back_office_id) {
          this.getBackOfficeDetails();
        }
      },
      (err: any) => {
        console.log(err);
        this.commonService.hideLoading();
      }
    );
  }

  getCordinators() {
    this.commonService.showLoading();
    this.courseService.getNewregionalCordinator().subscribe(
      (res: any) => {
        console.log(res);
        this.cordinatorsList = res.data;
    this.getBackupRegionalCordinator();
    this.commonService.hideLoading();
      },
      (err: any) => {
        console.log(err);
        this.commonService.hideLoading();
      }
    );
  }
  getBackupRegionalCordinator() {
    this.commonService.showLoading();
    this.courseService.getBackupRegionalCordinator().subscribe(
      (res: any) => {
        this.backupCordinatorsList = res.data;
        this.getCCTDeliveryPerimeter();
        this.commonService.hideLoading();
      },
      (err: any) => {
        console.log(err);
        this.commonService.hideLoading();
      }
    );
  }

  getBackOfficeDetails() {
    this.commonService.showLoading();
    this.backOfficeService.getBackOfficeDetails(this.back_office_id).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.back_office_details = res.data;
          this.createBackOfficeForm.controls.email.setValue(this.back_office_details.email);
          this.createBackOfficeForm.controls.cuid.setValue(this.back_office_details.cuid);
          this.createBackOfficeForm.controls.first_name.setValue(this.back_office_details.first_name);
          this.createBackOfficeForm.controls.last_name.setValue(this.back_office_details.last_name);
          this.createBackOfficeForm.controls.entity.setValue(this.back_office_details.entity);
          this.createBackOfficeForm.controls.course_deliver.setValue(this.back_office_details.course_deliver);
          this.createBackOfficeForm.controls.learning_role.setValue(this.back_office_details.learning_role);
          this.createBackOfficeForm.controls.regional_cordinator.setValue(this.back_office_details.regional_cordinator);
          this.createBackOfficeForm.controls.additional_comment.setValue(this.back_office_details.additional_comment);
          this.createBackOfficeForm.controls.delivery_perimeter.setValue(JSON.parse(this.back_office_details.delivery_perimeter));
          this.createBackOfficeForm.controls.agree.setValue(this.back_office_details.agree === "1" ? true : false);
          this.createBackOfficeForm.controls.first_session_date.setValue(new Date(this.back_office_details.first_session_date).toISOString().slice(0, 10));

          if(this.getprofileDetails.data.id != this.back_office_details.user_id){
            this.isCreater = false;
          }
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  changeEmail(item: any){
    if(item){
      this.createBackOfficeForm.controls.first_name.setValue(item.first_name);
      this.createBackOfficeForm.controls.last_name.setValue(item.last_name);
      this.createBackOfficeForm.controls.cuid.setValue(item.department_manager_cuid);
    }
  }

  getTotalCount() {
    this.commonService.showLoading();
    this.backOfficeService.getBackOffice().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.back_office_count = res.data.back_office_count;
        this.getPreferedInstructor();
    
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  agreeChange() {
    if(this.createBackOfficeForm.controls.agree.value){
    const modalRef = this.modalService.open(BackOfficeHistoryComponent, {
      centered: true,
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: '' ,
      type: 'agree'
    };
  }
  }

  isDraft() {
    if (this.back_office_details?.status === this.BackOfficeStatus.publish || this.back_office_details?.status === this.BackOfficeStatus.expired || this.back_office_details?.status === this.BackOfficeStatus.pending || this.back_office_details?.status === this.BackOfficeStatus.reject) {
      return false;
    }
    if (this.getprofileDetails.data.id != this.back_office_details?.user_id && this.back_office_details?.transfer_user_id && !this.back_office_details?.publisher_status && this.isReviewer) {
      return false;
    }
    return true;
  }

  isReject() {
    if (this.back_office_details?.status === this.BackOfficeStatus.publish || this.back_office_details?.status === this.BackOfficeStatus.expired  || this.back_office_details?.status === this.BackOfficeStatus.reject) {
      return false;
    }
    if (this.isRequester || !this.back_office_details.id) {
      return false;
    }
    if (this.back_office_details?.status === this.BackOfficeStatus.draft) {
      return false;
    }
    if (this.back_office_details?.transfer_user_id && !this.back_office_details?.publisher_status && this.isReviewer) {
      return false;
    }
    return true;
  }

  isPublish() {
    if (this.back_office_details?.status === this.BackOfficeStatus.publish || this.back_office_details?.status === this.BackOfficeStatus.expired ) {
      return false;
    }
    if (!this.isPublisher) {
      return false;
    }
    if (this.getprofileDetails.data.id != this.back_office_details?.user_id && this.back_office_details?.transfer_user_id && !this.back_office_details?.publisher_status && this.isReviewer) {
      return false;
    }
    return true;
  }

  isSubmit() {
    if (this.back_office_details?.status === this.BackOfficeStatus.publish || this.back_office_details?.status === this.BackOfficeStatus.expired ) {
      return false;
    }
    if (this.getprofileDetails.data.id === this.back_office_details?.user_id && this.back_office_details?.status === this.BackOfficeStatus.pending) {
      return false;
    }
    if (this.isPublisher) {
      return false;
    }
    if (this.getprofileDetails.data.id != this.back_office_details?.user_id && this.back_office_details?.transfer_user_id && !this.back_office_details?.publisher_status && this.isReviewer) {
      return false;
    }

    return true;
  }

  forwardRequest() {
    const modalRef = this.modalService.open(BackOfficeForwardComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: 'Request Forward',
      data: this.back_office_details.id,
      objectDetail: this.back_office_details
    };
  }

  statusChangeRequest(status: any) {
    const modalRef = this.modalService.open(BackOfficePublishComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: `Request ${status == this.BackOfficeStatus.reject ? "Reject" : "Publish"}`,
      status: status,
      data: this.back_office_details.id,
      objectDetail: this.back_office_details
    };
  }

  saveBackOffice(status: string) {
    this.isSubmitted = true;
    if (this.createBackOfficeForm.invalid) {
      return;
    }
    const body = this.createBackOfficeForm.value;
    body.status = status;
    if (!this.back_office_id) {
      this.commonService.showLoading();
      this.backOfficeService.create(body).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('BackOffice', 'Successfully Saved.');
          this.router.navigateByUrl(`/dashboard/back-office/view/${res.data.id}`);
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.toastErrorMsg('Error', err.message);
        }
      );
    }
    else {
      body.back_office_id = this.back_office_id;
      this.commonService.showLoading();
      this.backOfficeService.update(body).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('BackOffice', 'Successfully Saved.');
          this.router.navigateByUrl(`/dashboard/back-office/view/${this.back_office_id}`);
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.toastErrorMsg('Error', err.message);
        }
      );
    }

  }

}
