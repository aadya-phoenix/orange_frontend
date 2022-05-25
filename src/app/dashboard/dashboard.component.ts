import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { dataConstant } from '../shared/constant/dataConstant';
import { AuthenticationService } from '../shared/services/auth/authentication.service';
import { CommonService } from '../shared/services/common/common.service';
import { CourcesService } from '../shared/services/cources/cources.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  pendingRequestCount = {
    carousel_pending: 0,
    course_pending: 0,
    session_pending: 0,
    office_role_pending: 0
  };
  getUserrole: any;
  courcesList: any;
  profileDetails:any;
  RoleID = dataConstant.RoleID;
  isReviewer = false;
  isPublisher = false;
  isRequester = false;
  isPdlMember = false;
  pendingFlag: boolean = true;
  lableConstant: any = { french: {}, english: {} };
  baseUrl = dataConstant.BaseUrl;
  constructor(private courseService: CourcesService, private router: Router,
    private authService: AuthenticationService,
    private commonService: CommonService) {
    this.getUserrole = this.authService.getRolefromlocal();
    this.profileDetails = this.authService.getProfileDetailsfromlocal();
    console.log("userrole",this.authService.getProfileDetailsfromlocal())
    this.isReviewer = this.getUserrole.id === this.RoleID.BackOfficeReviewer;
    this.isPublisher = this.getUserrole.id === this.RoleID.BackOfficePublisher;
    this.isRequester = this.getUserrole.id === this.RoleID.RequesterID;
    this.isPdlMember = this.profileDetails.data.pdl_member;
  }

  navigatetoPending(status: any) {
    let statusobj = { status: status };
    this.router.navigateByUrl('/dashboard/cources', {
      state: statusobj,
    });
  }

  navigatetoPendingCarousel() {
    const status = this.isRequester ? dataConstant.CarouselStatus.submitted : dataConstant.CarouselStatus.pending
    this.router.navigateByUrl(`/dashboard/olcarousel?status=${status}`);
  }

  navigatetoPendingBackOffice() {
    const status = this.isRequester ? dataConstant.BackOfficeStatus.submitted : dataConstant.BackOfficeStatus.pending
    this.router.navigateByUrl(`/dashboard/back-office?status=${status}`);
  }

  getFavourite(){
    console.log("favourite course");
  }
  
  getFavouriteList(){
    console.log("favourite list");
  }

  getpendingCourses() {
    this.commonService.showLoading();
    this.commonService.dashboardCount().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.pendingRequestCount = res.data;
      },
      (err: any) => {
        this.commonService.hideLoading();
        console.log(err);
      }
    );
  }

  ngOnInit(): void {
    this.getpendingCourses();
    if (this.getUserrole.id == 2) {
      this.pendingFlag = true;
    }
    else {
      this.pendingFlag = false;
    }
    // setTimeout(() => {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    // },1000);
  }

  sendEmail(link:any){
    console.log("link",link)
    var email ='';
    var subject = '';
    var emailBody = this.baseUrl+link;
    window.location.href = "mailto:"+email+"?subject="+subject+"&body="+emailBody;
  }
}
