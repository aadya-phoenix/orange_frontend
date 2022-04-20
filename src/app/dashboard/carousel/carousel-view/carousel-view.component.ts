import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CarouselService } from 'src/app/shared/services/carousel/carousel.service';

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
  CarouselStatus = dataConstant.CarouselStatus;
  constructor(private route: ActivatedRoute,
    private carouselService: CarouselService,
    private authService: AuthenticationService,
    private router: Router) {
      this.getUserrole = this.authService.getRolefromlocal();
      this.isReviewer = this.getUserrole.id === this.RoleID.CarouselReviewer;
      this.isPublisher = this.getUserrole.id === this.RoleID.CarouselPublisher;
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
    if (this.requestdata.status == this.CarouselStatus.draft || (this.requestdata.status == this.CarouselStatus.pending && this.isPublisher)){
      return true;
    }
    return false;
  }
  isPublish(){
    if (this.requestdata.status == this.CarouselStatus.pending && this.isPublisher){
      return true;
    }
    return false;
  }
  isForward(){
    return false;
  }
  isReject(){
    if (this.requestdata.status == this.CarouselStatus.pending && this.isPublisher){
      return true;
    }
    return false;
  }

}
