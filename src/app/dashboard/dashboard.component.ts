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
  modules = dataConstant.Modules;
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

  isCourseFavourite = false;
  isSessionFavourite = false;
  isCarouselFavourite = false;
  isBackOfficeFavourite = false;
  isDesignFavourite = false;
  isGetReportFavourite = false;
  isAccessLearningFavourite = false;
  isSmeFavourite = false;
  isVendorFavourite = false;

  modulesArray=[{
    tabClass: 'tab-pane fade show active', aria_labelledby:'pills-home-tab',
    id:'pills-home', routerLink:'/dashboard/cources', image:'../../assets/images/first.jpg',
    lableConstantModule : this.lableConstant.create_new_course,
    lableConstantCatalog: this.lableConstant.request_course_catalog,
    navigateTo: '',
    pendingRequestCount : this.pendingRequestCount.course_pending,
    getFavouriteModule: this.modules.course,
   },{
    tabClass: 'tab-pane fade show active', aria_labelledby:'pills-home-tab',
    id:'pills-home', routerLink:'/dashboard/sct', image:'../../assets/images/Open course session.jpg ',
    lableConstantModule : this.lableConstant.open_course_session,
    lableConstantCatalog: this.lableConstant.request_create_session,
    navigateTo: '',
    pendingRequestCount : this.pendingRequestCount.session_pending,
    getFavouriteModule: this.modules.session,
   },{
    tabClass: 'tab-pane fade show active', aria_labelledby:'pills-home-tab',
    id:'pills-home', routerLink:'/dashboard/olcarousel', 
    image:'../../assets/images/Promote on Carousel.jpg',
    lableConstantModule : this.lableConstant.promote_on_carousel,
    lableConstantCatalog: this.lableConstant.request_create_entity,
    navigateTo:'',
    pendingRequestCount : this.pendingRequestCount.carousel_pending,
    getFavouriteModule: this.modules.carousel,
   },{
    tabClass: 'tab-pane fade show active', aria_labelledby:'pills-home-tab',
    id:'pills-home', routerLink:'/dashboard/back-office', image:'../../assets/images/4.jpg',
    lableConstantModule : this.lableConstant.request_back_office_role,
    lableConstantCatalog: this.lableConstant.request_specific_role,
    navigateTo:'',
    pendingRequestCount : this.pendingRequestCount.office_role_pending,
    getFavouriteModule: this.modules.backOffice,
   },{
    tabClass: 'tab-pane fade', aria_labelledby:'pills-profile-tab',
    id:'pills-profile', routerLink:'', image:'../../assets/images/Design learning module.jpg',
    lableConstantModule : this.lableConstant.design_learning_module,
    lableConstantCatalog: this.lableConstant.request_learning_team,
    navigateTo: '',
    pendingRequestCount : '',
    getFavouriteModule: this.modules.design,
   },{
    tabClass: 'tab-pane fade', aria_labelledby:'pills-profile-tab',
    id:'pills-profile', routerLink:'/dashboard/olreport', image:'../../assets/images/get a report.jpg',
    lableConstantModule : this.lableConstant.get_a_report,
    lableConstantCatalog: this.lableConstant.request_training_vc_report,
    navigateTo:'',
    pendingRequestCount : this.pendingRequestCount.course_pending,
    getFavouriteModule: this.modules.getReport,
   },{
    tabClass: 'tab-pane fade', aria_labelledby:'pills-profile-tab',
    id:'pills-profile', routerLink:'', image:'../../assets/images/Access Learning Needs tool(DNA).jpg',
    lableConstantModule : this.lableConstant.access_learning_tool,
    lableConstantCatalog: this.lableConstant.dna_tool_feature,
    navigateTo:'',
    pendingRequestCount : '',
    getFavouriteModule: '',
   },{
    tabClass: 'tab-pane fade', aria_labelledby:'pills-profile-tab',
    id:'pills-profile', routerLink:'', image:'../../assets/images/SME_DB.jpg',
    lableConstantModule : this.lableConstant.sme_database,
    lableConstantCatalog: this.lableConstant.sme_learning_community_feature,
    navigateTo:'',
    pendingRequestCount : '',
    getFavouriteModule: '',
   },{ 
    tabClass: 'tab-pane fade', aria_labelledby:'pills-contact-tab',
    id:'pills-contact', routerLink:'/dashboard/vendormanagement',
    image:'../../assets/images/manage vendor.jpg',
    lableConstantModule : this.lableConstant.manage_vendors,
    lableConstantCatalog: this.lableConstant.view_manage_workshops,
    navigateTo:'',
    pendingRequestCount : '',
    getFavouriteModule: this.modules.vendor,
   }];
  
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

  getFavourite(module:any){
    let favourite ;
    if(module == this.modules.course){
      this.isCourseFavourite = !this.isCourseFavourite;
      favourite = this.isCourseFavourite;
    }
    if(module == this.modules.session){
      this.isSessionFavourite = !this.isSessionFavourite;
      favourite = this.isSessionFavourite;
    }
    if(module ==  this.modules.carousel){
      this.isCarouselFavourite = !this.isCarouselFavourite;
      favourite = this.isCarouselFavourite;
    }
    if(module ==  this.modules.backOffice){
      this.isBackOfficeFavourite = !this.isBackOfficeFavourite;
      favourite = this.isBackOfficeFavourite;
    }
    if(module ==  this.modules.design){
      this.isDesignFavourite = !this.isDesignFavourite;
      favourite = this.isDesignFavourite;
    }
    if(module ==  this.modules.getReport){
      this.isGetReportFavourite = !this.isGetReportFavourite;
      favourite = this.isGetReportFavourite;
    }
    if(module == this.modules.access){
      this.isAccessLearningFavourite = !this.isAccessLearningFavourite;
      favourite = this.isAccessLearningFavourite;
    }
    if(module == this.modules.sme){
      this.isSmeFavourite = !this.isSmeFavourite;
      favourite = this.isSmeFavourite;
    }
    if(module ==  this.modules.vendor){
      this.isVendorFavourite = !this.isVendorFavourite;
      favourite = this.isVendorFavourite;
    }
    
    const body = {module:module, favorite:favourite}
    console.log("favourite course",body);
    this.commonService.showLoading();
    this.courseService.getFavourites(body).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
      },
      (err: any) => {
        this.commonService.hideLoading();
        console.log(err);
      }
    );
    
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
