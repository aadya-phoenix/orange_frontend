import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GetReportPublishComponent } from 'src/app/dashboard/get-report/get-report-publish/get-report-publish.component';
import { GetReportTransferToOtherRocComponent } from 'src/app/dashboard/get-report/get-report-transfer-to-other-roc/get-report-transfer-to-other-roc.component';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { VendorTrainingService } from 'src/app/shared/services/vendor-training/vendor-training.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendor-training-view',
  templateUrl: './vendor-training-view.component.html',
  styleUrls: ['./vendor-training-view.component.scss']
})
export class VendorTrainingViewComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  id = 0;
  requestdata: any = {};
  getUserrole: any = {};
  getprofileDetails: any = {};
  public historyList: any;
  dateFormate = dataConstant.dateFormate;
  RoleID = dataConstant.RoleID;
  isRoc = false;
  isDataAnalyst = false;
  isRequester = false;
  vendorStatus = dataConstant.VendorTrainingStatus;
  constructor(
    private route: ActivatedRoute,
    private vendorTrainingService:VendorTrainingService,
    private authService: AuthenticationService,
    private commonService: CommonService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.getUserrole = this.authService.getRolefromlocal();
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.isRoc = this.getUserrole.includes(this.RoleID.Roc);
    this.isDataAnalyst = this.getUserrole.includes(this.RoleID.DataAnalyst);
    this.isRequester = this.getprofileDetails.data?.staff == 1 ? true : false;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.id = Id ? parseInt(Id) : 0;
      this.getDetails();
      this.getHistory();
    });
  }

  backToList(){
    this.router.navigate(['/vendortraining']);
  }


  getDetails() {
    this.commonService.showLoading();
    this.vendorTrainingService.getDetails(this.id).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status == 1 && res.message == 'Success') {
          this.requestdata = res.data;
          if (this.requestdata.region_name) {
            this.requestdata.region_name = JSON.parse(this.requestdata.region_name);
          }
          if (this.requestdata.report_attachment) {
            this.requestdata.attachUrl = `${dataConstant.ImageUrl}/${this.requestdata.report_attachment}`;
          }
          if (this.requestdata.attachment) {
            this.requestdata.attachUrl = `${dataConstant.ImageUrl}/${this.requestdata.attachment}`;
          }
        }
      },
      (err: any) => {
        this.commonService.errorHandling(err);
        this.commonService.hideLoading();
      }
    );
  }

  getHistory() {
    this.commonService.showLoading();
    this.vendorTrainingService.history(this.id).subscribe((res: any) => {
      this.commonService.hideLoading();
      if (res && res.status == 1) {
        this.historyList = res.data;
      }
    },
      (err: any) => {
        this.commonService.errorHandling(err);
        this.commonService.hideLoading();
      });
  }

  updateRequest() {
    if (this.id) {
      this.router.navigateByUrl(`/vendortraining/update/${this.id}`);
    }
  }

  isUpdate() {
    if ((this.isRoc || this.isDataAnalyst )&& this.requestdata?.status_show == this.vendorStatus.pending) {
      return true;
    }
    if (this.requestdata?.status == this.vendorStatus.publish || this.requestdata?.status_show == this.vendorStatus.transferred || (this.requestdata?.user_id == this.getprofileDetails.data.id && this.requestdata?.status == this.vendorStatus.pending)) {
      return false;
    }
    if (this.requestdata?.status == this.vendorStatus.reject && this.requestdata?.user_id != this.getprofileDetails.data.id) {
      return false;
    }
    if (this.requestdata?.status == this.vendorStatus.draft) {
      return true;
    }
    if (this.isRequester && (this.requestdata?.status == this.vendorStatus.publish || this.requestdata?.status == this.vendorStatus.pending)) {
      return false;
    }
    if (!this.requestdata?.transfer_user_id && this.requestdata?.status == this.vendorStatus.pending && this.isRequester) {
      return false;
    }
    if (this.requestdata?.user_id != this.getprofileDetails.data.id && this.requestdata?.transfer_user_id && !this.requestdata?.publisher_status && this.isRoc) {
      return false;
    }
    if (this.isRoc && (this.requestdata.user_id == this.getprofileDetails.data.id) && (this.requestdata?.status_show == this.vendorStatus.submitted)) {
      return false;
    }
    return true;
  }

  isPublish() {
    if (this.requestdata?.status == this.vendorStatus.publish || this.requestdata?.status == this.vendorStatus.draft || this.requestdata?.status_show == this.vendorStatus.transferred || this.requestdata?.status == this.vendorStatus.reject) {
      return false;
    }
    /*   if (this.requestdata?.status == this.vendorStatus.reject && this.requestdata?.user_id != this.getprofileDetails.data.id){
        return false;  
      }
      if (this.requestdata?.status == this.vendorStatus.reject && this.requestdata?.user_id == this.getprofileDetails.data.id){
        return false;  
      } */
    if (this.isRequester && !this.isRoc && !this.isDataAnalyst) {
      return false;
    }
    if (this.requestdata.user_id === this.getprofileDetails.data.id && this.requestdata?.status_show === this.vendorStatus.submitted) {
      return false;
    }
    if (this.requestdata?.user_id != this.getprofileDetails.data.id && this.requestdata?.transfer_user_id && !this.requestdata?.publisher_status) {
      return false;
    }
    if (this.requestdata?.user_id == this.getprofileDetails.data.id && this.requestdata?.status == this.vendorStatus.pending) {
      return false;
    }
    return true;
  }

  isForward() {
    if (!this.isRoc) {
      return false;
    }
    if (this.requestdata?.status == this.vendorStatus.publish || this.requestdata?.status == this.vendorStatus.expired || this.requestdata?.status == this.vendorStatus.reject || this.requestdata?.status == this.vendorStatus.draft || this.requestdata?.status_show == this.vendorStatus.transferred) {
      return false;
    }
    if (this.requestdata?.status == this.vendorStatus.reject && this.requestdata?.user_id != this.getprofileDetails.data.id) {
      return false;
    }
    if (this.requestdata?.user_id == this.getprofileDetails.data.id && this.requestdata?.status == this.vendorStatus.pending) {
      return false;
    }

    if (this.requestdata?.transfer_user_id && !this.requestdata?.publisher_status && this.isRoc) {
      return false;
    }

    return true;
  }

  isReject() {
    if (this.requestdata?.status == this.vendorStatus.publish || this.requestdata?.status == this.vendorStatus.expired || this.requestdata?.status == this.vendorStatus.reject || this.requestdata?.status_show == this.vendorStatus.transferred) {
      return false;
    }
    if (this.requestdata?.status == this.vendorStatus.reject && this.requestdata?.user_id != this.getprofileDetails.data.id) {
      return false;
    }
    if (this.requestdata?.status == this.vendorStatus.reject && this.requestdata?.user_id == this.getprofileDetails.data.id) {
      return false;
    }
    if (this.requestdata?.user_id == this.getprofileDetails.data.id && this.requestdata?.status == this.vendorStatus.pending) {
      return false;
    }
    if (this.isRequester && !this.isRoc && !this.isDataAnalyst) {
      return false;
    }
    if (this.requestdata?.status == this.vendorStatus.draft) {
      return false;
    }
    if (this.requestdata?.transfer_user_id && !this.requestdata?.publisher_status && this.isRoc) {
      return false;
    }
    return true;
  }

  isOtherRoc() {
    if (this.isRoc && this.requestdata?.status_show == this.vendorStatus.pending) {
      return true;
    }
    return false
  }

  transferToOtherRoc() {
    const modalRef = this.modalService.open(GetReportTransferToOtherRocComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      data: this.requestdata.id,
      objectDetail: this.requestdata
    };
  }

  forwardRequest() {
    Swal.fire({
      title: 'Are you sure you want to Transfer to Data Analyst?',
      text: this.lableConstant.transfer_to_data_analyst,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Transfer it!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.commonService.showLoading();
       /*  this.vendorTrainingService.getReportTransfer({ report_id: this.id }).subscribe((res: any) => {
          this.commonService.hideLoading();
          Swal.fire(
            this.lableConstant.transferred,
            'Your request has been Transferred to Data Analyst.',
            'success'
          )
          this.router.navigate(['/vendortraining']);
        }, (err: any) => {
          this.commonService.hideLoading();
          this.commonService.errorHandling(err);
        }) */

      }
    })
  }

  statusChangeRequest(status: any) {
    const modalRef = this.modalService.open(GetReportPublishComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: `Request ${status == this.vendorStatus.reject ? "Reject" : "Close"}`,
      status: status,
      status_show: status == 'publish' ? 'Close' : 'Reject',
      data: this.requestdata.id,
      objectDetail: this.requestdata
    };
  }
}