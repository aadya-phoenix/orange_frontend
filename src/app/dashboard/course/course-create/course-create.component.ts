import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';

@Component({
  selector: 'app-course-create',
  templateUrl: './course-create.component.html',
  styleUrls: ['./course-create.component.scss']
})
export class CourseCreateComponent implements OnInit {

  today = new Date();
  minDate = {};
  RoleID = dataConstant.RoleID;
  dateFormate = dataConstant.dateFormate;
  CarouselStatus = dataConstant.CarouselStatus;
  course_id = 0;
  course_details: any = {};
  languageList: any = [];
  getUserrole: any = {};
  getprofileDetails: any = {};
  createCourseForm: FormGroup;
  languageText = "";
  isReviewer = false;
  isPublisher = false;
  isRequester = false;
  cordinatorsList = [];
  backupCordinatorsList = [];
  vendorType = [];
  vendor = [];
  cctLevel = [];
  cctSubjects = [];
  validityPeriod = [];
  entityList = [];
  deliveryMethod = [];
  whocanSee = [];
  preferedInstructor = [];
  availableLanguages = [];
  learningTypes = [];
  cctExpiryType = [];
  publisherList = [];
  course_count = {    
    closed: 0,
    draft: 0,
    pending: 0,
    rejected: 0,
    submitted: 0,
    total: 0,
    transferred: 0
  };
  learningType = 1

  constructor(private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private authService: AuthenticationService,
    private courseService: CourcesService) {
    this.minDate = `${this.today.getFullYear()}-${("0" + (this.today.getMonth() + 1)).slice(-2)}-${("0" + this.today.getDate()).slice(-2)}`;
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.getUserrole = this.authService.getRolefromlocal();
    this.isReviewer = this.getUserrole.id === this.RoleID.CarouselReviewer;
    this.isPublisher = this.getUserrole.id === this.RoleID.CarouselPublisher;
    this.isRequester = this.getUserrole.id === this.RoleID.RequesterID;
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.course_id = Id ? parseInt(Id) : 0;
    });
    this.createCourseForm = this.formBuilder.group({
      languages: new FormArray([]),
      metadata: this.formBuilder.array([]),
      image: new FormControl('', this.course_id ? [] : [Validators.required]),
      publication_date: new FormControl('', [Validators.required]),
      expiry_type: new FormControl('', [Validators.required]),
      additional_comment: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.getCordinators();
  }

  //get regional cordinators
  getCordinators() {
    this.commonService.showLoading();
    this.courseService.getNewregionalCordinator().subscribe(
      (res: any) => {
        this.cordinatorsList = res.data;
        this.getBackupRegionalCordinator();
      },
      (err: any) => {
        this.commonService.hideLoading();
        console.log(err);
      }
    );
  }
  getBackupRegionalCordinator() {
    this.commonService.showLoading();
    this.courseService.getBackupRegionalCordinator().subscribe(
      (res: any) => {
        this.backupCordinatorsList = res.data;
        this.getvendorType();
      },
      (err: any) => {
        console.log(err);
        this.commonService.hideLoading();
      }
    );
  }
  getvendorType() {
    this.commonService.showLoading();
    this.courseService.getVendortype().subscribe(
      (res: any) => {
        this.vendorType = res.data;
        this.getvendor();
      },
      (err: any) => {
        console.log(err);
        this.commonService.hideLoading();
      }
    );
  }


  getvendor() {
    this.commonService.showLoading();
    this.courseService.getVendor().subscribe(
      (res: any) => {
        this.vendor = res.data;
        this.getLevel();
      },
      (err: any) => {
        console.log(err);
        this.commonService.hideLoading();
      }
    );
  }

  getLevel() {
    this.commonService.showLoading();
    this.courseService.getcctLevel().subscribe(
      (res: any) => {
        this.cctLevel = res.data;
        this.getSubjects();
      },
      (err: any) => {
        console.log(err);
        this.commonService.hideLoading();
      }
    );
  }

  getSubjects() {
    this.commonService.showLoading();
    this.courseService.getSubjects().subscribe(
      (res: any) => {
        this.cctSubjects = res.data;
        this.getValidityPeriod();
      },
      (err: any) => {
        console.log(err);
        this.commonService.hideLoading();
      }
    );
  }

  getValidityPeriod() {
    this.commonService.showLoading();
    this.courseService.getValidityperiod().subscribe(
      (res: any) => {
        this.validityPeriod = res.data;
        this.getTotalCourse();
      },
      (err: any) => {
        console.log(err);
        this.commonService.hideLoading();
      }
    );
  }

  getTotalCourse() {
    this.commonService.showLoading();
    this.courseService.getCources().subscribe(
      (res: any) => {
        this.course_count = res.data.course_count;
        this.getEntitylist();
      },
      (err: any) => {
        console.log(err);
        this.commonService.hideLoading();
      }
    );
  }


  getEntitylist() {
    this.commonService.showLoading();
    this.courseService.getEntitylist().subscribe(
      (res: any) => {
        this.entityList = res.data;
        this.getDeliveryMethod();
      },
      (err: any) => {
        console.log(err);
        this.commonService.hideLoading();
      }
    );
  }

  getDeliveryMethod() {
    this.commonService.showLoading();
    this.courseService.getDeliveryMethod().subscribe(
      (res: any) => {
        this.deliveryMethod = res.data;
        this.getWhocansee();
      },
      (err: any) => {
        console.log(err);
        this.commonService.hideLoading();
      }
    );
  }

  getWhocansee() {
    this.commonService.showLoading();
    this.courseService.whoSeeCourse().subscribe(
      (res: any) => {
        this.whocanSee = res.data;
        this.getPreferedInstructor();
      },
      (err: any) => {
        console.log(err);
        this.commonService.hideLoading();
      }
    );
  }

  //prefered instructor
  getPreferedInstructor() {
    this.commonService.showLoading();
    this.courseService.getpreferedInstructor().subscribe(
      (res: any) => {
        this.preferedInstructor = res.data;
        this.getLanguages();
      },
      (err: any) => {
        console.log(err);
        this.commonService.hideLoading();
      }
    );
  }

  //get Languages
  getLanguages() {
    this.commonService.showLoading();
    this.courseService.getLanguages().subscribe(
      (res: any) => {
        this.availableLanguages = res.data;
        this.getLearningType();
      },
      (err: any) => {
        console.log(err);
        this.commonService.hideLoading();
      }
    );
  }

  //getLearning type
  getLearningType() {
    this.commonService.showLoading();
    this.courseService.getLearningType().subscribe(
      (res: any) => {
        this.learningTypes = res.data;
        this.getExpiryType();
      },
      (err: any) => {
        console.log(err);
        this.commonService.hideLoading();
      }
    );
  }

  //get Expirytype
  getExpiryType() {
    this.commonService.showLoading();
    this.courseService.getExpiryType().subscribe(
      (res: any) => {
        this.cctExpiryType = res.data;
        this.commonService.hideLoading();
      },
      (err: any) => {
        console.log(err);
        this.commonService.hideLoading();
      }
    );
  }

  getPublisher() {
    this.courseService.getNewPublisherByLearningType(this.learningType).subscribe(
      (res: any) => {
        console.log(res);
        this.publisherList = res.data;
        console.log("pub res is", res.data);
        console.log("this.learningType", this.learningType);
        console.log("new publisher list", this.publisherList);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

 
}
