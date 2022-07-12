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
  profileDetails: any;
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

  favoriteList: any = [];

  isCourseShow = true;
  isSessionShow = true;
  isCarouselShow = true;
  isBackOfficeShow = true;
  isDesignShow = true;
  isGetReportShow = true;
  isAccessLearningShow = true;
  isSmeShow = true;
  isVendorShow = true;

  modulesArray_tab1: any = [];
  modulesArray_tab2: any = [];
  modulesArray_tab3: any = [];

  constructor(private courseService: CourcesService, private router: Router,
    private authService: AuthenticationService,
    private commonService: CommonService) {
    this.getUserrole = this.authService.getRolefromlocal();
    this.profileDetails = this.authService.getProfileDetailsfromlocal();
    this.isReviewer = this.getUserrole.id === this.RoleID.BackOfficeReviewer;
    this.isPublisher = this.getUserrole.id === this.RoleID.BackOfficePublisher;
    this.isRequester = this.getUserrole.id === this.RoleID.RequesterID;
    if (this.profileDetails.data?.pdl_member) {
      this.isPdlMember = this.profileDetails.data.pdl_member;
    }
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    if (this.lableConstant) {
      this.modulesArray_tab1 = [
        {
          id: 'course', name:'Create new cource',
          routerLink: '/dashboard/cct', image: '../../assets/images/first.jpg',
          lableConstantModule: this.lableConstant.create_new_course,
          lableConstantCatalog: this.lableConstant.request_course_catalog,
          navigateTo: this.modules.course,
          favourite: false, showFavourite: true,
          pendingRequestCount: this.pendingRequestCount.course_pending,
          setFavouriteModule: this.modules.course,
        }, {
          id: 'session', name:'Open cource session(s)',
          routerLink: '/dashboard/sct', image: '../../assets/images/Open course session.jpg ',
          lableConstantModule: this.lableConstant.open_course_session,
          lableConstantCatalog: this.lableConstant.request_create_session,
          navigateTo: this.modules.session,
          favourite: false, showFavourite: true,
          pendingRequestCount: this.pendingRequestCount.session_pending,
          setFavouriteModule: this.modules.session,
        }, {
          id: 'corousel', name:'Promote on Carousel',
          routerLink: '/dashboard/olcarousel',
          image: '../../assets/images/Promote on Carousel.jpg',
          lableConstantModule: this.lableConstant.promote_on_carousel,
          lableConstantCatalog: this.lableConstant.request_create_entity,
          navigateTo: this.modules.carousel,
          favourite: false, showFavourite: true,
          pendingRequestCount: this.pendingRequestCount.carousel_pending,
          setFavouriteModule: this.modules.carousel,
        }, {
          id: 'back_office', name:'Request back-office role',
          routerLink: '/dashboard/back-office', image: '../../assets/images/4.jpg',
          lableConstantModule: this.lableConstant.request_back_office_role,
          lableConstantCatalog: this.lableConstant.request_specific_role,
          navigateTo: this.modules.backOffice,
          favourite: false, showFavourite: true,
          pendingRequestCount: this.pendingRequestCount.office_role_pending,
          setFavouriteModule: this.modules.backOffice,
        }];

      this.modulesArray_tab2 = [
        {
          id: 'design', name:'Design learning Module',
          routerLink: '/dashboard/designlearning', image: '../../assets/images/Design learning module.jpg',
          lableConstantModule: this.lableConstant.design_learning_module,
          lableConstantCatalog: this.lableConstant.request_learning_team,
          navigateTo: '',
          favourite: false, showFavourite: true,
          pendingRequestCount: '',
          setFavouriteModule: this.modules.design,
        }, {
          id: 'get_report', name:'Get a Report',
          routerLink: '/dashboard/olreport', image: '../../assets/images/get a report.jpg',
          lableConstantModule: this.lableConstant.get_a_report,
          lableConstantCatalog: this.lableConstant.request_training_vc_report,
          navigateTo: this.modules.getReport,
          favourite: false, showFavourite: true,
          pendingRequestCount: this.pendingRequestCount.course_pending,
          setFavouriteModule: this.modules.getReport,
        }, {
          id: 'dna', name:'Access Learning Needs Tool(DNA)',
          routerLink: '/dashboard/dna', image: '../../assets/images/Access Learning Needs tool(DNA).jpg',
          lableConstantModule: this.lableConstant.access_learning_tool,
          lableConstantCatalog: this.lableConstant.dna_tool_feature,
          navigateTo: '',
          favourite: false, showFavourite: true,
          pendingRequestCount: '',
          setFavouriteModule: this.modules.dna,
        }, 
        {
          id: 'sme', name:'SME Database',
          routerLink: '/dashboard/smedb', image: '../../assets/images/SME_DB.jpg',
          lableConstantModule: this.lableConstant.sme_database,
          lableConstantCatalog: this.lableConstant.sme_learning_community_feature,
          navigateTo: '',
          favourite: false, showFavourite: true,
          pendingRequestCount: '',
          setFavouriteModule: this.modules.sme,
        }
      ];

      this.modulesArray_tab3 = [{
        id: 'vendor', name:'Manage Vendors',
        routerLink: '/dashboard/vendormanagement',
        image: '../../assets/images/manage vendor.jpg',
        lableConstantModule: this.lableConstant.manage_vendors,
        lableConstantCatalog: this.lableConstant.view_manage_workshops,
        navigateTo: '',
        favourite: false, showFavourite: true,
        pendingRequestCount: '',
        setFavouriteModule: this.modules.vendor,
      }]
    }
  }

  ngOnInit(): void {
    this.getFavouriteList();
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

  navigatetoPending(module:any){
    if(this.pendingFlag) return;
    if(module == this.modules.course){
    const status = this.isRequester ? dataConstant.CarouselStatus.submitted : dataConstant.CarouselStatus.pending
    this.router.navigateByUrl(`/dashboard/cct?status=${status}`);
   }
   if(module == this.modules.carousel){
    const status = this.isRequester ? dataConstant.CarouselStatus.submitted : dataConstant.CarouselStatus.pending
    this.router.navigateByUrl(`/dashboard/olcarousel?status=${status}`);
   }
   if(module == this.modules.backOffice){
    const status = this.isRequester ? dataConstant.BackOfficeStatus.submitted : dataConstant.BackOfficeStatus.pending
    this.router.navigateByUrl(`/dashboard/back-office?status=${status}`);
   }
  }

  navigatetoPendingCarousel() {
    const status = this.isRequester ? dataConstant.CarouselStatus.submitted : dataConstant.CarouselStatus.pending
    this.router.navigateByUrl(`/dashboard/olcarousel?status=${status}`);
  }

  navigatetoPendingBackOffice() {
    const status = this.isRequester ? dataConstant.BackOfficeStatus.submitted : dataConstant.BackOfficeStatus.pending
    this.router.navigateByUrl(`/dashboard/back-office?status=${status}`);
  }

  setFavourite(item: any) {
    // let favorite;
    // for (let item of this.modulesArray_tab1) {
    //   if (module == item.id) {
    //     item.favourite = !item.favourite;
    //     favorite = item.favourite;
    //   }
    // }
    // for (let item of this.modulesArray_tab2) {
    //   if (module == item.id) {
    //     item.favourite = !item.favourite;
    //     favorite = item.favourite;
    //   }
    // }
    // for (let item of this.modulesArray_tab3) {
    //   if (module == item.id) {
    //     item.favourite = !item.favourite;
    //     favorite = item.favourite;
    //   }
    // }
    const body = { module: item.setFavouriteModule, favorite: !item.favourite }
    this.commonService.showLoading();
    this.courseService.setFavourites(body).subscribe(
      (res: any) => {
        if(!res.status){
          this.commonService.toastErrorMsg("Error", res.message);  
        }
        else{
          item.favourite = !item.favourite;
        }
        this.commonService.hideLoading();
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  getFavouriteList() {
    this.commonService.showLoading();
    this.courseService.getFavourites().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.favoriteList = res.data;
        if (this.favoriteList && this.favoriteList.length) {
          this.favoriteList.forEach((module: any) => {
            let tab1module = this.modulesArray_tab1.find((x: { setFavouriteModule: any; }) => x.setFavouriteModule == module.module);
            if (tab1module) {
              tab1module.favourite = true;
            }
            else {
              let tab2module = this.modulesArray_tab2.find((x: { setFavouriteModule: any; }) => x.setFavouriteModule == module.module);
              if (tab2module) {
                tab2module.favourite = true;
              }
              else {
                let tab3module = this.modulesArray_tab3.find((x: { setFavouriteModule: any; }) => x.setFavouriteModule == module.module);
                if (tab3module) {
                  tab3module.favourite = true;
                }
              }
            }
          });
          // for(let module of this.favoriteList){
          //  for(let item of this.modulesArray_tab1){
          //   if(module.module == item.setFavouriteModule){
          //     item.favourite =true;
          //   }

          //  }
          //  for(let item of this.modulesArray_tab2){
          //   if(module.module == item.setFavouriteModule){
          //     item.favourite =true;
          //   }
          //  }
          //  for(let item of this.modulesArray_tab3){
          //   if(module.module == item.setFavouriteModule){
          //     item.favourite =true;
          //   }
          //  }
          // }
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  onlyFavourite() {
   for(let module of this.modulesArray_tab1){
     module.showFavourite = module.favourite;
    }
   for(let module2 of this.modulesArray_tab2){
    module2.showFavourite = module2.favourite;
    }
   for(let module3 of this.modulesArray_tab3){
    module3.showFavourite = module3.favourite;
   }
  }

  getpendingCourses() {
    this.commonService.showLoading();
    this.commonService.dashboardCount().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.pendingRequestCount = res.data;
        this.modulesArray_tab1.forEach((element: any) => {
          if(element.id == 'course'){
            element.pendingRequestCount = this.pendingRequestCount.course_pending;
          }
          if(element.id == 'session'){
            element.pendingRequestCount = this.pendingRequestCount.session_pending;
          }
          if(element.id == 'corousel'){
            element.pendingRequestCount = this.pendingRequestCount.carousel_pending;
          }
          if(element.id == 'back_office'){
            element.pendingRequestCount = this.pendingRequestCount.office_role_pending;
          }
        });
        this.modulesArray_tab2.forEach((element: any) => {
          if(element.id == 'get_report'){
            element.pendingRequestCount = this.pendingRequestCount.course_pending;
          }
        });
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  sendEmail(name:any) {
    //  console.log("link", name)
  /*  var email = '';
    var subject = '';
    var emailBody = this.baseUrl + link;
    window.location.href = "mailto:" + email + "?subject=" + subject + "&body=" + emailBody; */
  }
}
