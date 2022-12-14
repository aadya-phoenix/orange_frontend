import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { $ } from 'protractor';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { BackOfficeService } from 'src/app/shared/services/back-office/back-office.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import Swal from 'sweetalert2';
import { BackOfficeForwardComponent } from '../back-office-forward/back-office-forward.component';
import { BackOfficePublishComponent } from '../back-office-publish/back-office-publish.component';
import { BackOfficeTransferToOtherRocComponent } from '../back-office-transfer-to-other-roc/back-office-transfer-to-other-roc.component';

@Component({
  selector: 'app-back-office-view',
  templateUrl: './back-office-view.component.html',
  styleUrls: ['./back-office-view.component.scss']
})
export class BackOfficeViewComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  id = 0;
  requestdata: any = {};
  getUserrole: any = {};
  getprofileDetails:any = {};
  activeIds: any = [];
  dateFormate = dataConstant.dateFormate;
  RoleID = dataConstant.RoleID;
  isReviewer = false;
  isPublisher = false;
  isRequester = false;
  BackOfficeStatus = dataConstant.BackOfficeStatus;
  constructor(private route: ActivatedRoute,
    private backOfficeService: BackOfficeService,
    private authService: AuthenticationService,
    private commonService: CommonService,
    private modalService: NgbModal,
    private router: Router) {
      this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
      this.getUserrole = this.authService.getRolefromlocal();
      this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
      this.isReviewer = this.getUserrole.includes(this.RoleID.BackOfficeReviewer);
      this.isPublisher = this.getUserrole.includes(this.RoleID.BackOfficePublisher);
      this.isRequester = this.getprofileDetails.data?.staff == 1 ? true : false;
     }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.id = Id ? parseInt(Id) : 0;
      this.getBackOfficeDetails();
    });
  }

  getBackOfficeDetails() {
    this.commonService.showLoading();
    this.backOfficeService.getBackOfficeDetails(this.id).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.requestdata = res.data;
          if(this.requestdata.delivery_perimeter){
            this.requestdata.delivery_perimeter = JSON.parse(this.requestdata.delivery_perimeter).join(', ');
          }
        }
      },
      (err: any) => {
        this.commonService.errorHandling(err);
        this.commonService.hideLoading();
      }
    );
  }

  backToList(){
    this.router.navigate(['/back-office']);
  }

  updateRequest() {
    if (this.id) {
      this.router.navigateByUrl(`/back-office/update/${this.id}`);
    }
  }

  isUpdate() {
    if (this.requestdata?.status === this.BackOfficeStatus.publish || this.requestdata?.status === this.BackOfficeStatus.expired || (this.requestdata?.user_id == this.getprofileDetails.data.id && this.requestdata?.status === this.BackOfficeStatus.pending)){
      return false;  
    }
    if (this.requestdata?.status === this.BackOfficeStatus.reject && this.requestdata?.user_id != this.getprofileDetails.data.id){
      return false;  
    }
    if (this.requestdata?.status === this.BackOfficeStatus.draft){
      return true;  
    }
    if(!this.requestdata?.transfer_user_id && this.requestdata?.status === this.BackOfficeStatus.pending && this.isRequester){
      return false;
    }
    if(this.requestdata?.user_id != this.getprofileDetails.data.id && this.requestdata?.transfer_user_id && !this.requestdata?.publisher_status && this.isReviewer){
      return false;
    }
    return true;
  }
  isPublish(){
    if (this.requestdata?.status === this.BackOfficeStatus.publish|| this.requestdata?.status === this.BackOfficeStatus.expired || this.requestdata?.status === this.BackOfficeStatus.draft){
      return false;  
    }
    if (this.requestdata?.status === this.BackOfficeStatus.reject && this.requestdata?.user_id != this.getprofileDetails.data.id){
      return false;  
    }
    if(!this.isPublisher){
      return false;
    }
    if(this.requestdata?.user_id != this.getprofileDetails.data.id && this.requestdata?.transfer_user_id && !this.requestdata?.publisher_status && this.isReviewer){
      return false;
    }
    return true;
  }
  isForward(){
    if (this.requestdata?.status === this.BackOfficeStatus.publish|| this.requestdata?.status === this.BackOfficeStatus.expired || this.requestdata?.status === this.BackOfficeStatus.reject|| this.requestdata?.status === this.BackOfficeStatus.draft){
      return false;  
    }
    if (this.requestdata?.status === this.BackOfficeStatus.reject && this.requestdata?.user_id != this.getprofileDetails.data.id){
      return false;  
    }
    if(!this.isReviewer){
      return false;
    }
    if(this.requestdata?.transfer_user_id && !this.requestdata?.publisher_status && this.isReviewer){
      return false;
    }

    return true;
  }
  isReject(){
    if (this.requestdata?.status === this.BackOfficeStatus.publish|| this.requestdata?.status === this.BackOfficeStatus.expired || this.requestdata?.status === this.BackOfficeStatus.reject){
      return false;  
    }
    if (this.requestdata?.status === this.BackOfficeStatus.reject && this.requestdata?.user_id != this.getprofileDetails.data.id){
      return false;  
    }
    if (this.isRequester && !this.isPublisher && !this.isReviewer) {
      return false;
    }
    if(this.requestdata?.status === this.BackOfficeStatus.draft){
      return false;
    }
    if(this.requestdata?.transfer_user_id && !this.requestdata?.publisher_status && this.isReviewer){
      return false;
    }
    return true;
  }

  isOtherRoc(){
    if(this.isReviewer && this.requestdata?.status === this.BackOfficeStatus.pending){
      return true;
    }
    return false
  }

  transferToOtherRoc(){
    const modalRef = this.modalService.open(BackOfficeTransferToOtherRocComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      data: this.requestdata.id,
      objectDetail: this.requestdata
    };
  }

  forwardRequest(){
    const modalRef = this.modalService.open(BackOfficeForwardComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      data: this.requestdata.id,
      objectDetail: this.requestdata
    };
      // Swal.fire({
      //   title: 'Are you sure want to transfer?',
      //   text: 'Request will be transfer to the publisher!',
      //   icon: 'question',
      //   showCancelButton: true,
      //   confirmButtonText: 'Yes, move it!',
      //   cancelButtonText: 'No, keep it'
      // }).then((result) => {
      //   if (result.value) {
      //     var data = {
      //       back_office_id: this.requestdata.id,
      //     };
      //       this.commonService.showLoading();
      //       this.backOfficeService.backOfficeTransfer(data).subscribe(
      //         (res: any) => {
      //           this.commonService.hideLoading();
      //           this.commonService.toastSuccessMsg('BackOffice', 'Successfully Transfered.');
      //           this.getBackOfficeDetails();
      //         },
      //         (err: any) => {
      //           this.commonService.hideLoading();
      //           this.commonService.errorHandling(err);
      //         }
      //       );
          
      //   }
      // })
  }

  statusChangeRequest(status:any){
    const modalRef = this.modalService.open(BackOfficePublishComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: `Request ${status == this.BackOfficeStatus.reject ? this.lableConstant.reject : this.lableConstant.publish }`,
      status: status,
      data: this.requestdata.id,
      objectDetail: this.requestdata
    };
  }

}
