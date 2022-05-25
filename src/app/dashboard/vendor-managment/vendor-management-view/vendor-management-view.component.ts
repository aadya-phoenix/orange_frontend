import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import * as _ from 'lodash';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { VendorService } from 'src/app/shared/services/vendor/vendor.service';

@Component({
  selector: 'app-vendor-management-view',
  templateUrl: './vendor-management-view.component.html',
  styleUrls: ['./vendor-management-view.component.scss']
})
export class VendorManagementViewComponent implements OnInit {
  id = 0;
  requestdata: any = {};
  getUserrole: any = {};
  getprofileDetails:any = {};
  activeIds: any = [];
  dateFormate = dataConstant.dateFormate;
  model = 0;
  RatingList = dataConstant.Ratings;
  VendorStatus = dataConstant.VendorStatus;
  constructor(private route: ActivatedRoute,
    private vendorService: VendorService,
    private authService: AuthenticationService,
    private commonService: CommonService,
    private router: Router) {
      this.getUserrole = this.authService.getRolefromlocal();
      this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
     }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.id = Id ? parseInt(Id) : 0;
      this.getVendorDetails();
    });
  }

  getVendorDetails() {
    this.commonService.showLoading();
    this.vendorService.getVendorDetails(this.id).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.requestdata = res.data;
          if(this.requestdata?.rating){
            this.model = Math.round(_.mean(_.map(this.requestdata?.rating, 'rating')));
          }
          this.requestdata.contact.forEach((element: any, index:number) => {
            this.activeIds.push(`panel-${index}`);
          });
          if(this.requestdata.location){
            this.requestdata.location = JSON.parse(this.requestdata.location).join(', ');
          }
          if(this.requestdata.nfps_entity){
            this.requestdata.nfps_entity = JSON.parse(this.requestdata.nfps_entity).join(', ');
          }
          if(this.requestdata.region){
            this.requestdata.region = JSON.parse(this.requestdata.region).join(', ');
          }
          if(this.requestdata.training_offer){
            this.requestdata.training_offer = JSON.parse(this.requestdata.training_offer).join(', ');
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
      this.router.navigateByUrl(`/dashboard/vendormanagement/update/${this.id}`);
    }
  }

}
