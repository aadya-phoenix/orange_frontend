import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CarouselService } from 'src/app/shared/services/carousel/carousel.service';

@Component({
  selector: 'app-carousel-view',
  templateUrl: './carousel-view.component.html',
  styleUrls: ['./carousel-view.component.scss']
})
export class CarouselViewComponent implements OnInit {
  id = 0;
  requestdata: any = {};
  isCollapsed=false;
  constructor(private route: ActivatedRoute,
    private carouselService: CarouselService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.id = Id ? parseInt(Id) : 0;
      this.getCarouselDetails();
    })
  }

  getCarouselDetails() {
    this.carouselService.getCarouselDetails(this.id).subscribe(
      (res: any) => {
        if (res.status === 1 && res.message === 'Success') {
          this.requestdata = res.data;
          this.requestdata.metadata.forEach((element:any) => {
            element.isCollapsed = false;
          });
          console.log(this.requestdata);
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

}
