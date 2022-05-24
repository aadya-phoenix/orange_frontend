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
  createCourceForm: FormGroup;
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
  learningTypes:any = [];
  cctExpiryType = [];
  publisherList = [];
  remainingText = 500;
  selectedLearningType: any = {};
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
  public tools: object = {
    items: [
      'UnorderedList']
  };
  public yesNo: any = [
    { id: 'yes', name: 'Yes' },
    { id: 'no', name: 'No' },
  ];
  fileToUpload: any = [];

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
    this.createCourceForm = this.formBuilder.group({
      title_single: new FormControl('', [Validators.required]),
      description_single: new FormControl('', [Validators.required]),
      training_provided_by: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
      objective_single: new FormControl('', [Validators.required]),
      subject: new FormControl('', [Validators.required]),
      keyword: new FormControl('', [Validators.required]),
      available_language: new FormControl('', [Validators.required]),
      level: new FormControl('', [Validators.required]),
      email_content_owner: new FormControl('', [Validators.required]),
      email_training_contact: new FormControl('', [Validators.required]),
      prerequisite: new FormControl(''),
      resource: [''],
      learning_type: new FormControl('', [Validators.required]),
      additional_comment: new FormControl(''),
      regional_cordinator: new FormControl('', [Validators.required]),
      delivery_method: new FormControl('', [Validators.required]),
      digital: new FormControl('', [Validators.required]),
      purchase_order: new FormControl('', [Validators.required]),
      manager_approval: new FormControl('', [Validators.required]),
      who_see_course: new FormControl(''),
      email_preffered_instructor: new FormControl('', [Validators.required]),
      first_session_date: new FormControl('', [Validators.required]),
      expiry_date: new FormControl('', [Validators.required]),
      expiry_date_type: new FormControl('', [Validators.required]),
      entity_business_area: new FormControl('', [Validators.required]),
      certification: new FormControl('', [Validators.required]),
      certification_expiry_type: new FormControl('', [Validators.required]),
      validity_period: new FormControl('', [Validators.required]),
      external_vendor: new FormControl('', [Validators.required]),
      external_vendor_name:new FormControl('', [Validators.required]),
      free_field_content: new FormControl(''),
      for_whoom_single:new FormControl('', [Validators.required]),
      learn_more_single: new FormControl(''),
      learner_guideline: this.formBuilder.array([]),
      curriculum_content:  this.formBuilder.array([]),
    });
    this.createCourceForm.get("learning_type")?.valueChanges.subscribe(x => {
      debugger;
      this.selectedLearningType = this.learningTypes.find((y: { id: any; }) => y.id == x);
      this.learnerguidelineFormArray.push(this.addMorelearnerGuideline('', ''));
      this.curriculumContentArray.push(this.addMoreCurriculumContent(''));
      // if (_.includes(x, 'Others')) {
      // }
      // else {
      //   this.createCourceForm.controls.other_training_offer.setValue(null);
      // }
    });
    this.createCourceForm.get("description_single")?.valueChanges.subscribe(() => {
      this.valueChange();
    });
  }




  ngOnInit(): void {
    this.getCordinators();
  }

  valueChange() {
    if (this.createCourceForm.value.description_single) {
      this.remainingText = 500 - this.createCourceForm.value.description_single.length;
    }
    else {
      this.remainingText = 500;
    }
  }
  
  get learnerguidelineFormArray(): FormArray {
    return this.createCourceForm.get("learner_guideline") as FormArray;
  }
  get curriculumContentArray(): FormArray {
    return this.createCourceForm.get("curriculum_content") as FormArray;
  }

  addMorelearnerGuideline(titleval: string, descriptionval: string) {
    return this.formBuilder.group({
      title: new FormControl(titleval),
      description: new FormControl(descriptionval),
    });
  }

  addMoreCurriculumContent(descriptionval: string) {
    return this.formBuilder.group({
      description: new FormControl(descriptionval),
    });
  }

  addLearnerGuideline(titleval: string, descriptionval: string) {
    return this.learnerguidelineFormArray.push(this.addMorelearnerGuideline(titleval, descriptionval));
  }

  addCurriculumContenttocurriculum(descriptionval: string) {
    return this.curriculumContentArray.push(this.addMoreCurriculumContent(descriptionval));
  }

  removeLearnerGuideline(i: any) {
    this.learnerguidelineFormArray.removeAt(i);
  }

  removeCurriculumContenttocurriculum(i: any) {
    this.curriculumContentArray.removeAt(i);
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


  handleFileInput(event: any) {
    console.log("event is", event.target.files[0]);
    this.FileConvertintoBytearray(event.target.files[0], async (f) => { // creating array bytes

      let objectdata: any = {
        fileName: f.name,
        base64FileBytes: this.byteArrayTobase64(f.bytes),
        attachmentId: - (this.fileToUpload.length + 1)
      };
      this.fileToUpload.push(objectdata);
    });
  }

  byteArrayTobase64(arr: any[]) {
    let base64: string = "";
    for (var i = 0; i < arr.length; i++) {
      base64 += String.fromCharCode(arr[i]);
    }
    return window.btoa(base64);
  }

  FileConvertintoBytearray(file: any, cb: (arg0: any) => void) { // making File to Array Bytes    
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onloadend = function () {
      const arrayBuffer: any = fileReader.result;
      const bytes = new Uint8Array(arrayBuffer);
      const array_bytes = Array.from(bytes);
      file.bytes = array_bytes;
      cb(file);
    };
  }

  get_learningType(event: any, target: any) {
    this.learningType = event.target.value;
    setTimeout(() => {
      var topOfElement = target.offsetTop;
      window.scroll({ top: topOfElement, behavior: "smooth" });
    }, 200);
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
