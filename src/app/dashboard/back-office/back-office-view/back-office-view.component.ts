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

@Component({
  selector: 'app-back-office-view',
  templateUrl: './back-office-view.component.html',
  styleUrls: ['./back-office-view.component.scss']
})
export class BackOfficeViewComponent implements OnInit {
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
      this.getUserrole = this.authService.getRolefromlocal();
      this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
      this.isReviewer = this.getUserrole.id === this.RoleID.BackOfficeReviewer;
      this.isPublisher = this.getUserrole.id === this.RoleID.BackOfficePublisher;
      this.isRequester = this.getUserrole.id === this.RoleID.RequesterID;
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
          this.requestdata.metadata.forEach((element: any, index:number) => {
            this.activeIds.push(`panel-${index}`);
          });
          if (this.requestdata.image) {
            this.requestdata.imgUrl = `${dataConstant.ImageUrl}/${this.requestdata.image}`;
          }
        }
      },
      (err: any) => {
        console.log(err);
        this.commonService.hideLoading();
      }
    );
  }

  updateRequest() {
    if (this.id) {
      this.router.navigateByUrl(`/dashboard/olback-office/update/${this.id}`);
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
    if(this.isRequester){
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

  forwardRequest(){
      Swal.fire({
        title: 'Are you sure want to transfer?',
        text: 'Request will be transfer to the publisher!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, move it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          var data = {
            back_office_id: this.requestdata.id,
          };
            this.commonService.showLoading();
            this.backOfficeService.backOfficeTransfer(data).subscribe(
              (res: any) => {
                this.commonService.hideLoading();
                this.commonService.toastSuccessMsg('BackOffice', 'Successfully Transfered.');
                this.getBackOfficeDetails();
              },
              (err: any) => {
                this.commonService.hideLoading();
                this.commonService.toastErrorMsg('Error', err.message);
              }
            );
          
        }
      })
  }

  statusChangeRequest(status:any){
    const modalRef = this.modalService.open(BackOfficePublishComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: `Request ${status == this.BackOfficeStatus.reject ? "Reject" : "Publish"}`,
      status: status,
      data: this.requestdata.id,
      objectDetail: this.requestdata
    };
  }

}
