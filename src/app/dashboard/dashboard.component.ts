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
  isFavoutite = false;
  activeTab = 'pills-profile';
  pendingRequestCount = {
    carousel_pending: 0,
    course_pending: 0,
    digital_learning: 0,
    get_report:0,
    session_pending: 0,
    new_learning: 0,
    office_role: 0
  };
  getUserrole: any;
  courcesList: any;
  profileDetails: any;
  RoleID = dataConstant.RoleID;
  isReviewer = false;
  isPublisher = false;
  isRequester = false;
  isPdlMember = false;
  isStaff = false;
  isManager = false;
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
    if(this.getUserrole){
      console.log("user role",this.getUserrole);
      this.isReviewer = this.getUserrole.includes(this.RoleID.BackOfficeReviewer);
      this.isPublisher = this.getUserrole.includes(this.RoleID.BackOfficePublisher);
      this.isRequester = this.profileDetails.data?.staff == 1 ? true : false;
    }
    if (this.profileDetails.data?.pdl_member) {
      this.isPdlMember = this.profileDetails.data.pdl_member;
    }
    this.isStaff = this.profileDetails.data?.staff == 1 ? true : false;
    this.isManager = this.profileDetails.data?.manager == 1 ? true : false;
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    if (this.lableConstant) {
      this.modulesArray_tab1 = [
        {
          id: 'course', name: 'Create new cource',
          routerLink: '/cct/create', image: '../../assets/images/first.jpg',
          lableConstantModule: this.lableConstant.create_new_course,
          lableConstantCatalog: this.lableConstant.request_course_catalog,
          navigateTo: this.modules.course,
          favourite: false, showFavourite: true,
          isShowPending: true,
          pendingRequestCount: this.pendingRequestCount.course_pending,
          setFavouriteModule: this.modules.course,
        }, {
          id: 'session', name: 'Open cource session(s)',
          routerLink: '/sct/create', image: '../../assets/images/Open course session.jpg ',
          lableConstantModule: this.lableConstant.open_course_session,
          lableConstantCatalog: this.lableConstant.request_create_session,
          navigateTo: this.modules.session,
          favourite: false, showFavourite: true,
          isShowPending: true,
          pendingRequestCount: this.pendingRequestCount.session_pending,
          setFavouriteModule: this.modules.session,
        }, {
          id: 'corousel', name: 'Promote on Carousel',
          routerLink: '/olcarousel/create',
          image: '../../assets/images/Promote on Carousel.jpg',
          lableConstantModule: this.lableConstant.promote_on_carousel,
          lableConstantCatalog: this.lableConstant.request_create_entity,
          navigateTo: this.modules.carousel,
          favourite: false, showFavourite: true,
          isShowPending: true,
          pendingRequestCount: this.pendingRequestCount.carousel_pending,
          setFavouriteModule: this.modules.carousel,
        }, {
          id: 'back_office', name: 'Request back-office role',
          routerLink: '/back-office/create', image: '../../assets/images/4.jpg',
          lableConstantModule: this.lableConstant.request_back_office_role,
          lableConstantCatalog: this.lableConstant.request_specific_role,
          navigateTo: this.modules.backOffice,
          isShowPending: true,
          favourite: false, showFavourite: true,
          pendingRequestCount: this.pendingRequestCount.office_role,
          setFavouriteModule: this.modules.backOffice,
        }];

      this.modulesArray_tab2 = [
        // {
        //   id: 'goldtool', name: 'Gold tool request',
        //   routerLink: '/gold-tool', image: '../../assets/images/second.jpg',
        //   lableConstantModule:'Gold tool request',
        //   lableConstantCatalog: this.lableConstant.request_learning_team,
        //   navigateTo: this.modules.goldTool,
        //   favourite: false, showFavourite: true,
        //   isShowPending: true,
        //   pendingRequestCount: this.pendingRequestCount.digital_learning,
        //   setFavouriteModule: this.modules.goldTool,
        // },
        {
          id: 'design', name: 'Design learning Module',
          routerLink: '/designlearning/create', image: '../../assets/images/Design learning module.jpg',
          lableConstantModule: this.lableConstant.design_learning_module,
          lableConstantCatalog: this.lableConstant.request_learning_team,
          navigateTo: this.modules.design,
          favourite: false, showFavourite: true,
          isShowPending: true,
          pendingRequestCount: this.pendingRequestCount.digital_learning,
          setFavouriteModule: this.modules.design,
        }, {
          id: 'get_report', name: 'Get a Report',
          routerLink: '/olreport/create', image: '../../assets/images/get a report.jpg',
          lableConstantModule: this.lableConstant.get_a_report,
          lableConstantCatalog: this.lableConstant.request_training_vc_report,
          navigateTo: this.modules.getReport,
          favourite: false, showFavourite: true,
          isShowPending: true,
          pendingRequestCount: this.pendingRequestCount.course_pending,
          setFavouriteModule: this.modules.getReport,
        }, {
          id: 'dna', name: 'Access Learning Needs Tool(DNA)',
          routerLink: '/dna', image: '../../assets/images/Access Learning Needs tool(DNA).jpg',
          lableConstantModule: this.lableConstant.access_learning_tool,
          lableConstantCatalog: this.lableConstant.dna_tool_feature,
          navigateTo:  this.modules.dna,
          favourite: false, showFavourite: true,
          isShowPending: true,
          pendingRequestCount: this.pendingRequestCount.new_learning,
          setFavouriteModule: this.modules.dna,
        },
        {
          id: 'sme', name: 'SME Database',
          routerLink: '/smedb', image: '../../assets/images/SME_DB.jpg',
          lableConstantModule: this.lableConstant.sme_database,
          lableConstantCatalog: this.lableConstant.sme_learning_community_feature,
          navigateTo:  this.modules.sme,
          favourite: false, showFavourite: true,
          isShowPending: false,
          pendingRequestCount: 0,
          setFavouriteModule: this.modules.sme,
        },
        {
          id: 'vendortraining', name: 'External Vendor Training Module',
          routerLink: '/vendortraining/create', image: '../../assets/images/Design learning module.jpg',
          lableConstantModule: 'External Vendor Training Module',
          lableConstantCatalog: this.lableConstant.request_learning_team,
          navigateTo: '',
          favourite: false, showFavourite: true,
          isShowPending: true,
          pendingRequestCount: this.pendingRequestCount.digital_learning,
          setFavouriteModule: this.modules.design,
        }
      ];

      this.modulesArray_tab3 = [{
        id: 'vendor', name: 'Manage Vendors',
        routerLink: '/vendormanagement',
        image: '../../assets/images/manage vendor.jpg',
        lableConstantModule: this.lableConstant.manage_vendors,
        lableConstantCatalog: this.lableConstant.view_manage_workshops,
        navigateTo:  this.modules.vendor,
        favourite: false, showFavourite: true,
        isShowPending: false,
        pendingRequestCount: 0,
        setFavouriteModule: this.modules.vendor,
      }]
    }
  }

  ngOnInit(): void {
    if(!this.isManager){
      this.modulesArray_tab2 = this.modulesArray_tab2.filter((x: { id: string; }) => x.id != 'dna');
    }
    this.getFavouriteList();
    this.getpendingCourses();
    this.pendingFlag = this.isStaff;
    // setTimeout(() => {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    // },1000);
  }

  activeTabChange(activeTab: string){
    this.activeTab = activeTab;
  }

  isOrangeLearningRelated() {
    return this.modulesArray_tab1.filter((x: { showFavourite: any; }) => x.showFavourite).length > 0 ? true : false;
  }
  isLearningAndDevelopment() {
    return this.modulesArray_tab2.filter((x: { showFavourite: any; }) => x.showFavourite).length > 0 ? true : false;
  }
  isPdlMemberTab() {
    return this.isPdlMember && this.modulesArray_tab3.filter((x: { showFavourite: any; }) => x.showFavourite).length > 0 ? true : false
  }
  navigatetoPending(module: any) {
    if (this.pendingFlag && this.profileDetails.data.role_id.length == 0) return;
    if (module == this.modules.course) {
      const status = this.getUserrole.includes(this.RoleID.CourseRequester) ? dataConstant.CarouselStatus.submitted : dataConstant.CarouselStatus.pending
      this.router.navigateByUrl(`/cct?status=${status}`);
    }
    if (module == this.modules.carousel) {
      const status = this.profileDetails.data?.staff == 1 ? dataConstant.CarouselStatus.submitted : dataConstant.CarouselStatus.pending
      this.router.navigateByUrl(`/olcarousel?status=${status}`);
    }
    if (module == this.modules.backOffice) {
      const status = this.profileDetails.data?.staff == 1 ? dataConstant.BackOfficeStatus.submitted : dataConstant.BackOfficeStatus.pending
      this.router.navigateByUrl(`/back-office?status=${status}`);
    }
    if (module == this.modules.session) {
      const status = dataConstant.BackOfficeStatus.pending;
      this.router.navigateByUrl(`/sct?status=${status}`);
    }
    if (module == this.modules.design) {
      const status = (this.getUserrole.includes(this.RoleID.DesignTeam) || this.getUserrole.includes(this.RoleID.HeadOfDesign)) ? dataConstant.BackOfficeStatus.pending : dataConstant.BackOfficeStatus.submitted;
      this.router.navigateByUrl(`/designlearning?status=${status}`);
    }
    if (module == this.modules.getReport) {
      const status = this.profileDetails.data?.staff == 1 ? dataConstant.BackOfficeStatus.submitted : dataConstant.BackOfficeStatus.pending
      this.router.navigateByUrl(`/olreport?status=${status}`);
    }
    if (module == this.modules.backOffice) {
      const status = this.profileDetails.data?.staff == 1 ? dataConstant.BackOfficeStatus.submitted : dataConstant.BackOfficeStatus.pending
      this.router.navigateByUrl(`/back-office?status=${status}`);
    }
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
        if (!res.status) {
          this.commonService.toastErrorMsg("Error", res.message);
        }
        else {
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
    this.isFavoutite = true;
    if (this.modulesArray_tab1.find((x: { favourite: any; }) => x.favourite)) {
      this.activeTab = 'pills-home';  
    } else  if (this.modulesArray_tab2.find((x: { favourite: any; }) => x.favourite)) {
      this.activeTab = 'pills-profile';  
    } else  if (this.modulesArray_tab3.find((x: { favourite: any; }) => x.favourite)) {
      this.activeTab = 'pills-contact';  
    } 
    for (let module of this.modulesArray_tab1) {
      module.showFavourite = module.favourite;
    }
    for (let module2 of this.modulesArray_tab2) {
      module2.showFavourite = module2.favourite;
    }
    for (let module3 of this.modulesArray_tab3) {
      module3.showFavourite = module3.favourite;
    }
  }

  showAll() {
    this.isFavoutite = false;
    this.activeTab = 'pills-home';
    this.modulesArray_tab1.forEach((element: { showFavourite: boolean; }) => {
      element.showFavourite = true;
    });
    this.modulesArray_tab2.forEach((element: { showFavourite: boolean; })  => {
      element.showFavourite = true;
    });
    this.modulesArray_tab3.forEach((element: { showFavourite: boolean; })  => {
      element.showFavourite = true;
    });
  }

  getpendingCourses() {
    this.commonService.showLoading();
    this.commonService.dashboardCount().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.pendingRequestCount = res.data;
        this.modulesArray_tab1.forEach((element: any) => {
          if (element.id == 'course') {
            element.pendingRequestCount = this.pendingRequestCount.course_pending;
          }
          if (element.id == 'session') {
            element.pendingRequestCount = this.pendingRequestCount.session_pending;
          }
          if (element.id == 'corousel') {
            element.pendingRequestCount = this.pendingRequestCount.carousel_pending;
          }
          if (element.id == 'back_office') {
            element.pendingRequestCount = this.pendingRequestCount.office_role;
          }
        });
        this.modulesArray_tab2.forEach((element: any) => {
          if (element.id == 'get_report') {
            element.pendingRequestCount = this.pendingRequestCount.get_report;
          }
          if (element.id == 'design') {
            element.pendingRequestCount = this.pendingRequestCount.digital_learning;
          }
          if (element.id == 'dna') {
            element.pendingRequestCount = this.pendingRequestCount.new_learning;
          }
        });
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  sendEmail(name: any) {
    //  console.log("link", name)
    /*  var email = '';
      var subject = '';
      var emailBody = this.baseUrl + link;
      window.location.href = "mailto:" + email + "?subject=" + subject + "&body=" + emailBody; */
  }
}
