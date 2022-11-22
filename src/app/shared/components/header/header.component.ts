import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContcatUsComponent } from 'src/app/dashboard/contcat-us/contcat-us.component';
import { SwitchUserComponent } from 'src/app/dashboard/switch-user/switch-user.component';
import { MessageViewComponent } from 'src/app/message/message-view/message-view.component';
import { dataConstant } from '../../constant/dataConstant';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { CommonService } from '../../services/common/common.service';
import { MessageService } from '../../services/message/message.service';

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
  Laungauges = [];
  selectedLaungauge: any = dataConstant.Laungauges.EN;
  totalNotification = 0;
  totalMessages = 0;
  profileDetails: any;
  pendingRequestCount = {
    carousel_notify: 0,
    course_notify: 0,
    digital_learning_notify: 0,
    get_report_notify: 0,
    office_role_notify:0,
    session_notify:0,
    new_learning_notify: 0
  };
  RoleID = dataConstant.RoleID;
  lableConstant: any = { french: {}, english: {} };

  constructor(private authService: AuthenticationService,
    private commonService: CommonService,
    private messageSerice: MessageService,
    private modalService: NgbModal,
    private router: Router) {
    this.getUserrole = this.authService.getRolefromlocal();
    this.profileDetails = this.authService.getProfileDetailsfromlocal();
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.isROM = this.getUserrole.includes(this.RoleID.Rom);
    this.isStaff = this.authService.getUserDetailslocal().staff == 1 ? true : false;
  }
  public showUserMenu: boolean = false;
  getprofileDetails: any;

  ngOnInit(): void {
    this.getUserprofile();
    this.getPendingCount();
    this.getActiveMessage();
    this.getLanguageList();
    if (localStorage.getItem('userName')) {
      this.userName = JSON.parse(localStorage.getItem('userName') as any);
    }
    if (this.userName) {
      this.firstName = this.userName.first_name;
      this.lastName = this.userName.last_name;
    }
    this.selectedLaungauge = localStorage.getItem('laungauge') && localStorage.getItem('laungauge') == dataConstant.Laungauges.FR ? 'FR' : 'EN' ;
  }

  getLanguageList() {
    this.commonService.showLoading();
    this.commonService.getLanguages().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.Laungauges = res.data.filter((x: { is_translate: number; }) => x.is_translate === 1);
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  changeLaungauge(laungauge: any) {
    this.commonService.showLoading();
    this.commonService.setLanguages({ language: laungauge }).subscribe((res: any) => {
      this.commonService.hideLoading();
      localStorage.setItem('laungauge', laungauge);
      this.selectedLaungauge = laungauge;
      location.reload();
    }, (err: any) => {
      this.commonService.errorHandling(err);
      this.commonService.hideLoading();
    });
  }

  getUserprofile() {
    this.commonService.showLoading();
    this.authService.getProfileDetails().subscribe((res: any) => {
      this.commonService.hideLoading();
      if (res != undefined) {
        this.getprofileDetails = res.data;
        localStorage.setItem('userName', JSON.stringify(this.getprofileDetails));
        if(this.getprofileDetails.language){
          localStorage.setItem('laungauge', this.getprofileDetails.language);
          this.selectedLaungauge = localStorage.getItem('laungauge') && localStorage.getItem('laungauge') == dataConstant.Laungauges.FR ? 'FR' : 'EN' ;
        }
      }
      if (localStorage.getItem('userName')) {
        this.userName = JSON.parse(localStorage.getItem('userName') as any);
      }
      if (this.userName) {
        this.firstName = this.userName.first_name;
        this.lastName = this.userName.last_name;
        this.isAdmin = this.userName.admin == 1 ? true : false;
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
        this.totalNotification = (this.pendingRequestCount.carousel_notify ? this.pendingRequestCount.carousel_notify : 0) +
          (this.pendingRequestCount.course_notify ? this.pendingRequestCount.course_notify : 0) +
          (this.pendingRequestCount.digital_learning_notify ? this.pendingRequestCount.digital_learning_notify : 0) +
          (this.pendingRequestCount.get_report_notify ? this.pendingRequestCount.get_report_notify : 0) +
          (this.pendingRequestCount.new_learning_notify ? this.pendingRequestCount.new_learning_notify : 0) +
          (this.pendingRequestCount.office_role_notify ? this.pendingRequestCount.office_role_notify : 0) +
          (this.pendingRequestCount.session_notify ? this.pendingRequestCount.session_notify : 0)
      },
      (err: any) => {
        this.commonService.errorHandling(err);
        this.commonService.hideLoading();
      }
    );
  }

  getActiveMessage() {
    this.commonService.showLoading();
    this.messageSerice.getActiveMessage().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.totalMessages = res.data?.length;
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
    if (module == this.modules.design) {
      const status = (this.getUserrole.includes(this.RoleID.DesignTeam) || this.getUserrole.includes(this.RoleID.HeadOfDesign)) ? dataConstant.BackOfficeStatus.pending : dataConstant.BackOfficeStatus.submitted;
      this.router.navigateByUrl(`/designlearning?status=${status}`);
    }
    if (module == this.modules.getReport) {
      const status = this.profileDetails.data?.staff == 1 ? dataConstant.BackOfficeStatus.submitted : dataConstant.BackOfficeStatus.pending
      this.router.navigateByUrl(`/olreport?status=${status}`);
    }
    if (module == this.modules.dna) {
      const status = this.profileDetails.data?.staff == 1 ? dataConstant.BackOfficeStatus.submitted : dataConstant.BackOfficeStatus.pending
      this.router.navigateByUrl(`/dna`);
    }
  }

  userMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    this.authService.logOut();
    localStorage.removeItem('userName');
  }

  switchUser() {
    const modalRef = this.modalService.open(SwitchUserComponent, {
      centered: true,
      windowClass: 'alert-popup',
    });
  }

  contcatUs() {
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
