import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { $ } from 'protractor';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CarouselService } from 'src/app/shared/services/carousel/carousel.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import Swal from 'sweetalert2';
import { CarouselForwardComponent } from '../carousel-forward/carousel-forward.component';
import { CarouselPublishComponent } from '../carousel-publish/carousel-publish.component';

@Component({
  selector: 'app-carousel-view',
  templateUrl: './carousel-view.component.html',
  styleUrls: ['./carousel-view.component.scss']
})
export class CarouselViewComponent implements OnInit {
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
  CarouselStatus = dataConstant.CarouselStatus;
  constructor(private route: ActivatedRoute,
    private carouselService: CarouselService,
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
    this.carouselService.getCarouselDetails(this.id).subscribe(
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
        this.commonService.errorHandling(err);
        this.commonService.hideLoading();
      }
    );
  }

  updateRequest() {
    if (this.id) {
      this.router.navigateByUrl(`/dashboard/olcarousel/update/${this.id}`);
    }
  }

  isUpdate() {
    if (this.requestdata?.status === this.CarouselStatus.publish || this.requestdata?.status === this.CarouselStatus.expired || (this.requestdata?.user_id == this.getprofileDetails.data.id && this.requestdata?.status === this.CarouselStatus.pending)){
      return false;  
    }
    if (this.requestdata?.status === this.CarouselStatus.reject && this.requestdata?.user_id != this.getprofileDetails.data.id){
      return false;  
    }
    if (this.requestdata?.status === this.CarouselStatus.draft){
      return true;  
    }
    if(!this.requestdata?.transfer_user_id && this.requestdata?.status === this.CarouselStatus.pending && this.isRequester){
      return false;
    }
    if(this.requestdata?.user_id != this.getprofileDetails.data.id && this.requestdata?.transfer_user_id && !this.requestdata?.publisher_status && this.isReviewer){
      return false;
    }
    return true;
  }
  isPublish(){
    if (this.requestdata?.status === this.CarouselStatus.publish|| this.requestdata?.status === this.CarouselStatus.expired || this.requestdata?.status === this.CarouselStatus.draft){
      return false;  
    }
    if (this.requestdata?.status === this.CarouselStatus.reject && this.requestdata?.user_id != this.getprofileDetails.data.id){
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
    if (this.requestdata?.status === this.CarouselStatus.publish|| this.requestdata?.status === this.CarouselStatus.expired || this.requestdata?.status === this.CarouselStatus.reject|| this.requestdata?.status === this.CarouselStatus.draft){
      return false;  
    }
    if (this.requestdata?.status === this.CarouselStatus.reject && this.requestdata?.user_id != this.getprofileDetails.data.id){
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
    if (this.requestdata?.status === this.CarouselStatus.publish|| this.requestdata?.status === this.CarouselStatus.expired || this.requestdata?.status === this.CarouselStatus.reject){
      return false;  
    }
    if (this.requestdata?.status === this.CarouselStatus.reject && this.requestdata?.user_id != this.getprofileDetails.data.id){
      return false;  
    }
    if (!this.isRequester || (this.isRequester && !(this.isPublisher || this.isReviewer))) {
      return false;
    }
    if(this.requestdata?.status === this.CarouselStatus.draft){
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
            carousel_id: this.requestdata.id,
          };
            this.commonService.showLoading();
            this.carouselService.carouselTransfer(data).subscribe(
              (res: any) => {
                this.commonService.hideLoading();
                this.commonService.toastSuccessMsg('Carousel', 'Successfully Transfered.');
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

  statusChangeRequest(status:any){
    const modalRef = this.modalService.open(CarouselPublishComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: `Request ${status == this.CarouselStatus.reject ? this.lableConstant.reject : this.lableConstant.publish }`,
      status: status,
      data: this.requestdata.id,
      objectDetail: this.requestdata
    };
  }

}
