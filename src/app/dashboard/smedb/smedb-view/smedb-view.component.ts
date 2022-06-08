import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CarouselService } from 'src/app/shared/services/carousel/carousel.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { SMEService } from 'src/app/shared/services/sme/sme.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-smedb-view',
  templateUrl: './smedb-view.component.html',
  styleUrls: ['./smedb-view.component.scss']
})
export class SmedbViewComponent implements OnInit {

  id = 0;
  requestdata: any = {};
  getUserrole: any = {};
  getprofileDetails: any = {};
  activeIds: any = [];
  dateFormate = dataConstant.dateFormate;
  RoleID = dataConstant.RoleID;
  isReviewer = false;
  isPublisher = false;
  isRequester = false;
  CarouselStatus = dataConstant.CarouselStatus;
  contentSupportData = [];
  deliveryData = [];
  professionalCertificationsData = [];
  commentsData = [];
  voiceOverLearningData= [];
  constructor(private route: ActivatedRoute,
    private smeService: SMEService,
    private authService: AuthenticationService,
    private commonService: CommonService,
    private modalService: NgbModal,
    private router: Router) {
    this.getUserrole = this.authService.getRolefromlocal();
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.isReviewer = this.getUserrole.id === this.RoleID.CarouselReviewer;
    this.isPublisher = this.getUserrole.id === this.RoleID.CarouselPublisher;
    this.isRequester = this.getUserrole.id === this.RoleID.RequesterID;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.id = Id ? parseInt(Id) : 0;
      this.getCarouselDetails();
    });
  }

  getCarouselDetails() {
    this.commonService.showLoading();
    this.smeService.getSMEDatabaseDetails(this.id).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.requestdata = res.data;
          this.requestdata.domain = JSON.parse(this.requestdata.domain).join(', ');
          if (this.requestdata.metadata) {
            if (this.requestdata.metadata["content-support"]) {
              this.contentSupportData = this.requestdata.metadata["content-support"];
              // this.activeIds.push(`panel-content-support`);
            }
            if (this.requestdata.metadata["delivery"]) {
              this.deliveryData = this.requestdata.metadata["delivery"];
              // this.activeIds.push(`panel-delivery`);
            }
            if (this.requestdata.metadata["professional-certifications"]) {
              this.professionalCertificationsData = this.requestdata.metadata["professional-certifications"];
              // this.activeIds.push(`panel-professional-certifications`);
            }
            if (this.requestdata.metadata["comments"]) {
              this.commentsData = this.requestdata.metadata["comments"];
              // this.activeIds.push(`panel-comments`);
            }
            if (this.requestdata.metadata["voice-over-learning"]) {
              this.voiceOverLearningData = this.requestdata.metadata["voice-over-learning"];
              // this.activeIds.push(`panel-voice-over-learning`);
            }
          }
          if (this.requestdata.image) {
            this.requestdata.imgUrl = `${dataConstant.ImageUrl}/${this.requestdata.image}`;
          }
        }
      },
      (err: any) => {
        this.commonService.errorHandling(err);
        this.commonService.hideLoading();
      }
    );
  }

  updateRequest() {
    if (this.id) {
      this.router.navigateByUrl(`/dashboard/smedb/update/${this.id}`);
    }
  }

  isUpdate() {
    if (this.requestdata?.status === this.CarouselStatus.publish || this.requestdata?.status === this.CarouselStatus.expired || (this.requestdata?.user_id == this.getprofileDetails.data.id && this.requestdata?.status === this.CarouselStatus.pending)) {
      return false;
    }
    if (this.requestdata?.status === this.CarouselStatus.reject && this.requestdata?.user_id != this.getprofileDetails.data.id) {
      return false;
    }
    if (this.requestdata?.status === this.CarouselStatus.draft) {
      return true;
    }
    if (!this.requestdata?.transfer_user_id && this.requestdata?.status === this.CarouselStatus.pending && this.isRequester) {
      return false;
    }
    if (this.requestdata?.user_id != this.getprofileDetails.data.id && this.requestdata?.transfer_user_id && !this.requestdata?.publisher_status && this.isReviewer) {
      return false;
    }
    return true;
  }
  isPublish() {
    if (this.requestdata?.status === this.CarouselStatus.publish || this.requestdata?.status === this.CarouselStatus.expired || this.requestdata?.status === this.CarouselStatus.draft) {
      return false;
    }
    if (this.requestdata?.status === this.CarouselStatus.reject && this.requestdata?.user_id != this.getprofileDetails.data.id) {
      return false;
    }
    if (!this.isPublisher) {
      return false;
    }
    if (this.requestdata?.user_id != this.getprofileDetails.data.id && this.requestdata?.transfer_user_id && !this.requestdata?.publisher_status && this.isReviewer) {
      return false;
    }
    return true;
  }
  isForward() {
    if (this.requestdata?.status === this.CarouselStatus.publish || this.requestdata?.status === this.CarouselStatus.expired || this.requestdata?.status === this.CarouselStatus.reject || this.requestdata?.status === this.CarouselStatus.draft) {
      return false;
    }
    if (this.requestdata?.status === this.CarouselStatus.reject && this.requestdata?.user_id != this.getprofileDetails.data.id) {
      return false;
    }
    if (!this.isReviewer) {
      return false;
    }
    if (this.requestdata?.transfer_user_id && !this.requestdata?.publisher_status && this.isReviewer) {
      return false;
    }

    return true;
  }
  isReject() {
    if (this.requestdata?.status === this.CarouselStatus.publish || this.requestdata?.status === this.CarouselStatus.expired || this.requestdata?.status === this.CarouselStatus.reject) {
      return false;
    }
    if (this.requestdata?.status === this.CarouselStatus.reject && this.requestdata?.user_id != this.getprofileDetails.data.id) {
      return false;
    }
    if (this.isRequester) {
      return false;
    }
    if (this.requestdata?.status === this.CarouselStatus.draft) {
      return false;
    }
    if (this.requestdata?.transfer_user_id && !this.requestdata?.publisher_status && this.isReviewer) {
      return false;
    }
    return true;
  }

  forwardRequest() {
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
    //       carousel_id: this.requestdata.id,
    //     };
    //       this.commonService.showLoading();
    //       this.smeService.carouselTransfer(data).subscribe(
    //         (res: any) => {
    //           this.commonService.hideLoading();
    //           this.commonService.toastSuccessMsg('Carousel', 'Successfully Transfered.');
    //           this.getCarouselDetails();
    //         },
    //         (err: any) => {
    //           this.commonService.hideLoading();
    //           this.commonService.errorHandling(err);
    //         }
    //       );

    //   }
    // })
  }

  statusChangeRequest(status: any) {
    // const modalRef = this.modalService.open(CarouselPublishComponent, {
    //   centered: true,
    //   size: 'lg',
    //   windowClass: 'alert-popup',
    // });
    // modalRef.componentInstance.props = {
    //   title: `Request ${status == this.CarouselStatus.reject ? "Reject" : "Publish"}`,
    //   status: status,
    //   data: this.requestdata.id,
    //   objectDetail: this.requestdata
    // };
  }
}
