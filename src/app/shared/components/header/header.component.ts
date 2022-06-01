import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { dataConstant } from '../../constant/dataConstant';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { CommonService } from '../../services/common/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  modules = dataConstant.Modules;
  getUserrole: any;
  userName: any;
  firstName: any;
  lastName: any;
  isRequester = false;
  Laungauges = dataConstant.Laungauges;
  selectedLaungauge: any = this.Laungauges.EN;
  totalNotification = 0;
  pendingRequestCount = {
    carousel_pending: 0,
    course_pending: 0,
    session_pending: 0,
    office_role_pending: 0
  };
  RoleID = dataConstant.RoleID;
  lableConstant: any = { french: {}, english: {} };

  constructor(private authService: AuthenticationService,
    private commonService: CommonService,
    private router: Router) {
    this.getUserrole = this.authService.getRolefromlocal();
    //this.getUserrole = JSON.parse(this.authService.getRolefromlocal());
    this.isRequester = this.getUserrole.id === this.RoleID.RequesterID;
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
  }
  public showUserMenu: boolean = false;
  getprofileDetails: any;

  ngOnInit(): void {
    this.getUserprofile();
    this.getPendingCount();
    if (localStorage.getItem('userName')) {
      this.userName = JSON.parse(localStorage.getItem('userName') as any);
    }
    if (this.userName) {
      this.firstName = this.userName.first_name;
      this.lastName = this.userName.last_name;
    }
    this.selectedLaungauge = localStorage.getItem('laungauge') ? localStorage.getItem('laungauge') : this.Laungauges.EN;
  }

  changeLaungauge(laungauge: any) {
    localStorage.setItem('laungauge', laungauge);
    this.selectedLaungauge = laungauge;
    location.reload();
  }

  getUserprofile() {
    this.commonService.showLoading();
    this.authService.getProfileDetails().subscribe((res: any) => {
      this.commonService.hideLoading();
      if (res != undefined) {
        this.getprofileDetails = res.data;
        localStorage.setItem('userName', JSON.stringify(this.getprofileDetails));
      }
      if (localStorage.getItem('userName')) {
        this.userName = JSON.parse(localStorage.getItem('userName') as any);
      }
      if (this.userName) {
        this.firstName = this.userName.first_name;
        this.lastName = this.userName.last_name;
      }
    }, (err: any) => {
      console.log(err);
      this.commonService.hideLoading();
    });
  }

  getPendingCount() {
    this.commonService.showLoading();
    this.commonService.dashboardCount().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.pendingRequestCount = res.data;
        this.totalNotification = (this.pendingRequestCount.carousel_pending ? this.pendingRequestCount.carousel_pending : 0) +
          (this.pendingRequestCount.course_pending ? this.pendingRequestCount.course_pending : 0) +
          (this.pendingRequestCount.office_role_pending ? this.pendingRequestCount.office_role_pending : 0) +
          (this.pendingRequestCount.session_pending ? this.pendingRequestCount.session_pending : 0)
      },
      (err: any) => {
        this.commonService.toastErrorMsg(err.error.error, err.error.message);
        this.commonService.hideLoading();
      }
    );
  }

  navigatetoPending(module: any) {
    if (module == this.modules.course) {
      const status = this.isRequester ? dataConstant.CarouselStatus.submitted : dataConstant.CarouselStatus.pending
      this.router.navigateByUrl(`/dashboard/cct?status=${status}`);
    }
    if (module == this.modules.carousel) {
      const status = this.isRequester ? dataConstant.CarouselStatus.submitted : dataConstant.CarouselStatus.pending
      this.router.navigateByUrl(`/dashboard/olcarousel?status=${status}`);
    }
    if (module == this.modules.session) {
      const status = this.isRequester ? dataConstant.CarouselStatus.submitted : dataConstant.CarouselStatus.pending
      this.router.navigateByUrl(`/dashboard/sct?status=${status}`);
    }
    if (module == this.modules.backOffice) {
      const status = this.isRequester ? dataConstant.BackOfficeStatus.submitted : dataConstant.BackOfficeStatus.pending
      this.router.navigateByUrl(`/dashboard/back-office?status=${status}`);
    }
  }

  userMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    console.log('he')
    this.authService.logOut();
    localStorage.removeItem('userName');
  }

}
