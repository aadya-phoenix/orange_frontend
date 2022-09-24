import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContcatUsComponent } from 'src/app/dashboard/contcat-us/contcat-us.component';
import { SwitchUserComponent } from 'src/app/dashboard/switch-user/switch-user.component';
import { MessageViewComponent } from 'src/app/message/message-view/message-view.component';
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
  isAdmin = false;
  isStaff = false;
  isROM = false;
  pdlMember = false;
  Laungauges = dataConstant.Laungauges;
  selectedLaungauge: any = this.Laungauges.EN;
  totalNotification = 0;
  totalMessages = 1;
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
    private modalService: NgbModal,
    private router: Router) {
    this.getUserrole = this.authService.getRolefromlocal();
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.isROM = this.getUserrole.includes(this.RoleID.Rom);
    this.isStaff = this.authService.getUserDetailslocal().staff == 1 ? true : false;
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
        this.isAdmin = this.userName.admin == 1 ? true: false;
        this.pdlMember = this.userName.pdl_member == 1 ? true : false;
        this.isRequester = this.userName.staff == 1 ? true : false;
      }
    }, (err: any) => {
      this.commonService.errorHandling(err); 
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
        this.commonService.errorHandling(err);
        this.commonService.hideLoading();
      }
    );
  }

  navigatetoPending(module: any) {
    if (module == this.modules.course) {
      const status = this.isRequester ? dataConstant.CarouselStatus.submitted : dataConstant.CarouselStatus.pending
      this.router.navigateByUrl(`/cct?status=${status}`);
    }
    if (module == this.modules.carousel) {
      const status = this.isRequester ? dataConstant.CarouselStatus.submitted : dataConstant.CarouselStatus.pending
      this.router.navigateByUrl(`/olcarousel?status=${status}`);
    }
    if (module == this.modules.session) {
      const status = this.isRequester ? dataConstant.CarouselStatus.submitted : dataConstant.CarouselStatus.pending
      this.router.navigateByUrl(`/sct?status=${status}`);
    }
    if (module == this.modules.backOffice) {
      const status = this.isRequester ? dataConstant.BackOfficeStatus.submitted : dataConstant.BackOfficeStatus.pending
      this.router.navigateByUrl(`/back-office?status=${status}`);
    }
  }

  userMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    this.authService.logOut();
    localStorage.removeItem('userName');
  }

  switchUser(){
      const modalRef = this.modalService.open(SwitchUserComponent, {
        centered: true,
        windowClass: 'alert-popup',
      });
  }

  contcatUs(){
    const modalRef = this.modalService.open(ContcatUsComponent, {
      centered: true,
      windowClass: 'alert-popup',
    });
}

  openMessages() {
    const modalRef = this.modalService.open(MessageViewComponent, {
      centered: true,
      size: 'xl',
      modalDialogClass: 'large-width',
      windowClass: 'alert-popup',
    });
    // modalRef.componentInstance.props = {
    //   title: 'View History',
    //   data: item.id,
    //   objectDetail: item,
    //   type: 'viewhistory'
    // };
  }

}
