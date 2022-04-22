import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { $ } from 'protractor';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CarouselService } from 'src/app/shared/services/carousel/carousel.service';
import { CarouselForwardComponent } from '../carousel-forward/carousel-forward.component';
import { CarouselPublishComponent } from '../carousel-publish/carousel-publish.component';

@Component({
  selector: 'app-carousel-view',
  templateUrl: './carousel-view.component.html',
  styleUrls: ['./carousel-view.component.scss']
})
export class CarouselViewComponent implements OnInit {
  id = 0;
  requestdata: any = {};
  getUserrole: any = {};
  RoleID = dataConstant.RoleID;
  isReviewer = false;
  isPublisher = false;
  isRequester = false;
  CarouselStatus = dataConstant.CarouselStatus;
  constructor(private route: ActivatedRoute,
    private carouselService: CarouselService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private router: Router) {
      this.getUserrole = this.authService.getRolefromlocal();
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
    this.carouselService.getCarouselDetails(this.id).subscribe(
      (res: any) => {
        if (res.status === 1 && res.message === 'Success') {
          this.requestdata = res.data;
          this.requestdata.metadata.forEach((element: any) => {
            element.isCollapsed = false;
          });
          if (this.requestdata.image) {
            this.requestdata.imgUrl = `${dataConstant.ImageUrl}/${this.requestdata.image}`;
          }
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  updateRequest() {
    if (this.id) {
      this.router.navigateByUrl(`/dashboard/olcarousel/update/${this.id}`);
    }
  }

  isUpdate() {
    if (this.requestdata?.status === this.CarouselStatus.publish){
      return false;  
    }
    if (this.requestdata?.status === this.CarouselStatus.draft){
      return true;  
    }
    if(this.requestdata?.transfer_user_id && !this.requestdata?.publisher_status && this.isReviewer){
      return false;
    }
    return true;
  }
  isPublish(){
    if (this.requestdata?.status === this.CarouselStatus.publish){
      return false;  
    }
    if(!this.isPublisher){
      return false;
    }
    if(this.requestdata?.transfer_user_id && !this.requestdata?.publisher_status && this.isReviewer){
      return false;
    }
    return true;
  }
  isForward(){
    if (this.requestdata?.status === this.CarouselStatus.publish){
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
    if (this.requestdata?.status === this.CarouselStatus.publish){
      return false;  
    }
    if(this.isRequester){
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
    const modalRef = this.modalService.open(CarouselForwardComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: 'Request Forward',
      data: this.requestdata.id,
      objectDetail: this.requestdata
    };
  }

  statusChangeRequest(status:any){
    const modalRef = this.modalService.open(CarouselPublishComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: `Request ${status == this.CarouselStatus.reject ? "Reject" : "Publish"}`,
      status: status,
      data: this.requestdata.id,
      objectDetail: this.requestdata
    };
  }

}
