import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Track } from 'ngx-audio-player';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CarouselService } from 'src/app/shared/services/carousel/carousel.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { SMEService } from 'src/app/shared/services/sme/sme.service';
import Swal from 'sweetalert2';
import { SmedbStatusComponent } from '../smedb-status/smedb-status.component';

@Component({
  selector: 'app-smedb-view',
  templateUrl: './smedb-view.component.html',
  styleUrls: ['./smedb-view.component.scss']
})
export class SmedbViewComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
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
  SMEStatus = dataConstant.SMEStatus;
  contentSupportData = [];
  deliveryData = [];
  professionalCertificationsData = [];
  domainExpertData = [];
  facilitationExpertData = [];
  commentsData = [];
  voiceOverLearningData:any= [];
  msaapDisplayTitle = false;
  msaapDisplayPlayList = false;
  msaapDisplayVolumeControls = true;
  msaapDisplayRepeatControls = false;
  msaapDisplayArtist = false;
  msaapDisplayDuration = false;
  msaapDisablePositionSlider = true;
  constructor(private route: ActivatedRoute,
    private smeService: SMEService,
    private authService: AuthenticationService,
    private commonService: CommonService,
    private modalService: NgbModal,
    private router: Router) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.getUserrole = this.authService.getRolefromlocal();
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.isReviewer = this.getUserrole.includes(this.RoleID.CarouselReviewer);
    this.isPublisher = this.getUserrole.includes(this.RoleID.CarouselPublisher);
    this.isRequester = this.getprofileDetails.data?.staff == 1 ? true : false;
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
            if (this.requestdata.metadata["domain-expert"]) {
              this.domainExpertData = this.requestdata.metadata["domain-expert"];
              // this.activeIds.push(`panel-domain-expert`);
            }
            if (this.requestdata.metadata["facilitation-expert"]) {
              this.facilitationExpertData = this.requestdata.metadata["facilitation-expert"];
              // this.activeIds.push(`panel-facilitation-expert`);
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
              //this.voiceOverLearningData = this.requestdata.metadata["voice-over-learning"];
              this.requestdata.metadata["voice-over-learning"].forEach((element:any) => {
                element.language = JSON.parse(element.language).join(', ');
                if(element.voice_recording){
                  const voice_recording = JSON.parse(element.voice_recording);
                  voice_recording.forEach((file: any) => {
                    element.msaapPlaylist = [];
                    element.msaapPlaylist.push(
                      {
                        title: element.language,
                        link: `${dataConstant.ImageUrl}/${file}`
                      },
                    );
                    this.voiceOverLearningData.push(element);
                  });
                }
              });
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
      this.router.navigateByUrl(`/smedb/update/${this.id}`);
    }
  }

  isUpdate() {
    if ((this.requestdata?.manager_status  && this.requestdata?.manager_status === this.SMEStatus.reject || this.requestdata?.status === this.SMEStatus.draft|| this.requestdata?.status === this.SMEStatus.reject) && this.requestdata?.user_id == this.getprofileDetails.data.id) {
      return true;
    }
    return false;
  }
  isApprove() {
    if(this.getprofileDetails.data.manager && this.requestdata?.manager_status  && (this.requestdata?.manager_status === this.SMEStatus.reject|| this.requestdata?.manager_status === this.SMEStatus.approve)){
      return false;  
    }
    if (this.requestdata?.status === this.SMEStatus.pending && this.requestdata?.user_id != this.getprofileDetails.data.id) {
      return true;
    }
    return false;
  }
  
  isReject() {
    if(this.getprofileDetails.data.manager && this.requestdata?.manager_status  && (this.requestdata?.manager_status === this.SMEStatus.reject|| this.requestdata?.manager_status === this.SMEStatus.approve)){
      return false;  
    }
    if (this.requestdata?.status === this.SMEStatus.pending && this.requestdata?.user_id != this.getprofileDetails.data.id) {
      return true;
    }
    return false;
  }

  approveRequest() {
    Swal.fire({
      title: 'Are you sure that you want to approved this request?',
      text: 'SME Database',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        var data = {
          sme_id: this.requestdata.id,
          status:'approve'
        };
          this.commonService.showLoading();
          this.smeService.SMEDatabaseStatus(data).subscribe(
            (res: any) => {
              this.commonService.hideLoading();
              this.commonService.toastSuccessMsg('SME Database', 'Successfully Transfered.');
              this.getCarouselDetails();
            },
            (err: any) => {
              this.commonService.hideLoading();
              this.commonService.errorHandling(err);
            }
          );

      }
    })
  }

  statusChangeRequest(status: any) {
    const modalRef = this.modalService.open(SmedbStatusComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: `Add your comments`,
      status: this.SMEStatus.reject,
      isSMEStatus: false,
      data: this.requestdata.id,
      objectDetail: this.requestdata
    };
    modalRef.componentInstance.passEntry.subscribe((res: any) => {
      this.getCarouselDetails();
    });
  }
}
