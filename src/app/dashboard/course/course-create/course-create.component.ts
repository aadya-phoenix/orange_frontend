import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { brotliCompressSync } from 'zlib';
import { MultiLaunguageComponent } from '../multi-launguage/multi-launguage.component';

@Component({
  selector: 'app-course-create',
  templateUrl: './course-create.component.html',
  styleUrls: ['./course-create.component.scss']
})
export class CourseCreateComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  showCertificateExpiry = false;
  externalVendorname = false;
  regionTargetAudience = false;
  regionTargetAudiencePlaylist = false;
  isSubmitted = false;
  selectedPublisherId = null;
  rejectcomment = null;
  today = new Date();
  minDate = {};
  maxDate = {};
  RoleID = dataConstant.RoleID;
  dateFormate = dataConstant.dateFormate;
  CarouselStatus = dataConstant.CarouselStatus;
  LearningType = dataConstant.LearningType;
  course_id = 0;
  course_details: any = {};
  languageList: any = [];
  getUserrole: any = {};
  getprofileDetails: any;
  showrejectbutton: any;
  createCourceForm: FormGroup;
  public publishForm!: FormGroup;
  languageText = "";
  isReviewer = false;
  isPublisher = false;
  isRequester = false;
  isPlayListRole = false;
  isStaff = false;
  isRom = false;
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
  regionsTargetObj = []
  preferedInstructor = [];
  availableLanguages = [];
  learningTypes: any = [];
  cctExpiryType = [];
  publisherList = [];
  remainingText = 500;
  materialBased = "url";
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
  public cctExpiryperiod: any = [];
  isMaterialSource = '';
  isFileResouce = '';
  fileToUpload: any = [];
  fileToUpload_Material: any = [];

  constructor(private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private authService: AuthenticationService,
    private courseService: CourcesService) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.minDate = `${this.today.getFullYear()}-${("0" + (this.today.getMonth() + 1)).slice(-2)}-${("0" + this.today.getDate()).slice(-2)}`;
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.getUserrole = this.authService.getRolefromlocal();
    this.isStaff = this.getprofileDetails.data?.staff == 1 ? true : false;
    this.isReviewer = this.getUserrole.includes(this.RoleID.CourseReviewer);
    this.isRom = this.getUserrole.includes(this.RoleID.Rom);
    this.isPublisher = this.getUserrole.includes(this.RoleID.CoursePublisher);
    this.isPlayListRole = this.getUserrole.includes(this.RoleID.PlayListRole);
    this.isRequester = this.getprofileDetails.data?.staff == 1 ? true : false;
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.course_id = Id ? parseInt(Id) : 0;
    });
    this.createCourceForm = this.formBuilder.group({
      title_single: new FormControl('', [Validators.required]),
      title: new FormControl(''),
      description_single: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      for_whoom: new FormControl(''),
      learn_more: new FormControl(''),
      training_provided_by: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
      objective: this.formBuilder.array([]),
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
    //  regional_cordinator: new FormControl('', [Validators.required]),
      learner_guideline: this.formBuilder.array([]),
      curriculum_content: this.formBuilder.array([]),
      materialBased: new FormControl('')
    });
    this.objectiveContentArray.push(this.addMoreObjective(''));
    this.publishForm = this.formBuilder.group({
      intranet_url: new FormControl('', [
        Validators.required,
        Validators.pattern(dataConstant.UrlPattern),
      ]),
      internet_url: new FormControl('', [
        Validators.required,
        Validators.pattern(dataConstant.UrlPattern),
      ]),
      status_comment: new FormControl(''),
    });
    this.createCourceForm.get("learning_type")?.valueChanges.subscribe(x => {
      this.selectedLearningType = this.learningTypes.find((y: { id: any; }) => y.id == x);
      if (!this.isRequester) {
        this.createCourceForm.removeControl('regional_cordinator');
      }
      this.cctExpiryperiod = [
        {
          id: 2,
          name: '6 months',
          status: 1,
        },
        {
          id: 3,
          name: '12 months',
          status: 1,
        },
        {
          id: 4,
          name: '24 months',
          status: 1,
        },
      ];
      if (this.isILTAndvILT()) {
        this.cctExpiryperiod = [
          {
            id: 1,
            name: '3 months',
            status: 1,
          },
          {
            id: 2,
            name: '6 months',
            status: 1,
          },
          {
            id: 3,
            name: '12 months',
            status: 1,
          }
        ];
        this.createCourceForm.addControl('regional_cordinator', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('delivery_method', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('digital', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('purchase_order', new FormControl(''));
        this.createCourceForm.addControl('manager_approval', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('who_see_course', new FormControl(''));
        this.createCourceForm.removeControl('email_playlist_creator');
        this.createCourceForm.addControl('email_preffered_instructor', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('first_session_date', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('expiry_date', new FormControl(''));
        this.createCourceForm.addControl('expiry_date_type', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('entity_business_area', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('certification', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('external_vendor', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('free_field_content', new FormControl(''));
        this.createCourceForm.addControl('for_whoom_single', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('learn_more_single', new FormControl(''));
        this.createCourceForm.removeControl('video_link');
        this.createCourceForm.removeControl('target_audience');
        this.createCourceForm.removeControl('url');
        this.createCourceForm.addControl('training_provided_by', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('duration', new FormControl('', [Validators.required]));
        if (!this.createCourceForm.controls.objective) {
          this.createCourceForm.addControl('objective', new FormControl('', [Validators.required]));
          this.createCourceForm.controls.objective = this.formBuilder.array([]);
          this.objectiveContentArray.push(this.addMoreObjective(''));
        }
        this.createCourceForm.addControl('subject', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('keyword', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('available_language', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('level', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('email_content_owner', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('email_training_contact', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('prerequisite', new FormControl(''));
        this.createCourceForm.addControl('resource', new FormControl(''));
        if (this.course_details.id) {
          this.createCourceForm.controls.delivery_method.setValue(JSON.parse(this.course_details.delivery_method));
          this.createCourceForm.controls.digital.setValue(this.course_details.digital);
          if (this.course_details.purchase_order) {
            this.createCourceForm.controls.purchase_order.setValue(this.course_details.purchase_order);
          }
          this.createCourceForm.controls.manager_approval.setValue(this.course_details.manager_approval);
          this.createCourceForm.controls.who_see_course.setValue(Number(this.course_details.who_see_course));
          this.createCourceForm.controls.email_preffered_instructor.setValue(JSON.parse(this.course_details.email_preffered_instructor));
          this.createCourceForm.controls.first_session_date.setValue(this.course_details.first_session_date);
          if (this.course_details.expiry_date) {
            this.createCourceForm.controls.expiry_date.setValue(this.course_details.expiry_date);
          }
          this.createCourceForm.controls.expiry_date_type.setValue(this.course_details.expiry_date_type);
          this.createCourceForm.controls.entity_business_area.setValue(JSON.parse(this.course_details.entity_business_area));
          this.createCourceForm.controls.certification.setValue(this.course_details.certification);
          if (this.course_details.certification == 'yes') {
            this.showCertificateExpiry = true;
            this.createCourceForm.addControl('validity_period', new FormControl(this.course_details.validity_period, [Validators.required]));
            this.createCourceForm.addControl('certification_expiry_type', new FormControl(this.course_details.certification_expiry_type, [Validators.required]));
          }
          this.createCourceForm.controls.external_vendor.setValue(this.course_details.external_vendor);
          if (this.course_details.external_vendor == 'yes') {
            this.externalVendorname = true;
            this.createCourceForm.addControl('external_vendor_name', new FormControl(this.course_details.external_vendor_name, [Validators.required]));
          }
          this.createCourceForm.controls.free_field_content.setValue(this.course_details.free_field_content);
          if (this.course_details.for_whoom) {
            this.createCourceForm.controls.for_whoom_single.setValue(this.courseService.getTText(this.course_details.for_whoom));
            this.createCourceForm.controls.for_whoom.setValue(JSON.parse(this.course_details.for_whoom));
          }
          if (this.course_details.learn_more) {
            this.createCourceForm.controls.learn_more_single.setValue(this.courseService.getTText(this.course_details.learn_more));
            this.createCourceForm.controls.learn_more.setValue(JSON.parse(this.course_details.learn_more));
          }
          if (this.course_details.learner_guideline) {
            const learner_guideline = JSON.parse(this.course_details.learner_guideline);
            learner_guideline.forEach((element: any) => {
              this.learnerguidelineFormArray.push(this.addMorelearnerGuideline(element.title, element.description));
            });
          }
        }
        else {
          this.createCourceForm.controls.learner_guideline = this.formBuilder.array([]);
          this.learnerguidelineFormArray.push(this.addMorelearnerGuideline('', ''));
        }
        this.createCourceForm.get("first_session_date")?.valueChanges.subscribe((x) => {
          this.maxDate = x;
        })
      }
      if (this.isVideoBased()) {
        this.createCourceForm.addControl('regional_cordinator', new FormControl('', [Validators.required]));
        this.createCourceForm.removeControl('delivery_method');
        this.createCourceForm.removeControl('digital');
        this.createCourceForm.removeControl('purchase_order');
        this.createCourceForm.removeControl('manager_approval');
        this.createCourceForm.removeControl('who_see_course');
        this.createCourceForm.removeControl('email_playlist_creator');
        this.createCourceForm.removeControl('email_preffered_instructor');
        this.createCourceForm.removeControl('first_session_date');
        this.createCourceForm.removeControl('expiry_date');
        this.createCourceForm.addControl('expiry_date_type', new FormControl('', [Validators.required]));
        this.createCourceForm.removeControl('entity_business_area');
        this.createCourceForm.removeControl('certification');
        this.createCourceForm.removeControl('certification_expiry_type');
        this.createCourceForm.removeControl('validity_period');
        this.createCourceForm.removeControl('external_vendor');
        this.createCourceForm.removeControl('external_vendor_name');
        this.createCourceForm.removeControl('free_field_content');
        this.createCourceForm.addControl('for_whoom_single', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('learn_more_single', new FormControl(''));
        this.createCourceForm.removeControl('target_audience');
        this.createCourceForm.removeControl('url');
        this.createCourceForm.addControl('video_link', new FormControl('', [Validators.required, Validators.pattern(dataConstant.UrlPattern)]));
        this.createCourceForm.addControl('training_provided_by', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('duration', new FormControl('', [Validators.required]));
        if (!this.createCourceForm.controls.objective) {
          this.createCourceForm.addControl('objective', new FormControl('', [Validators.required]));
          this.createCourceForm.controls.objective = this.formBuilder.array([]);
          this.objectiveContentArray.push(this.addMoreObjective(''));
        }
        this.createCourceForm.addControl('subject', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('keyword', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('available_language', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('level', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('email_content_owner', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('email_training_contact', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('prerequisite', new FormControl(''));
        this.createCourceForm.addControl('resource', new FormControl(''));
        if (this.course_details.id) {
          this.createCourceForm.controls.video_link.setValue(this.course_details.video_link);
          this.createCourceForm.controls.expiry_date_type.setValue(this.course_details.expiry_date_type);
          if (this.course_details.for_whoom) {
            this.createCourceForm.controls.for_whoom_single.setValue(this.courseService.getTText(this.course_details.for_whoom));
            this.createCourceForm.controls.for_whoom.setValue(JSON.parse(this.course_details.for_whoom));
          }
          if (this.course_details.learn_more) {
            this.createCourceForm.controls.learn_more_single.setValue(this.courseService.getTText(this.course_details.learn_more));
            this.createCourceForm.controls.learn_more.setValue(JSON.parse(this.course_details.learn_more));
          }
          if (this.course_details.learner_guideline) {
            const learner_guideline = JSON.parse(this.course_details.learner_guideline);
            learner_guideline.forEach((element: any) => {
              this.learnerguidelineFormArray.push(this.addMorelearnerGuideline(element.title, element.description));
            });
          }
        }else{
          this.createCourceForm.controls.learner_guideline = this.formBuilder.array([]);
          this.learnerguidelineFormArray.push(this.addMorelearnerGuideline('', ''));
        }
      }
      if (this.isMaterialBased()) {
        this.createCourceForm.addControl('regional_cordinator', new FormControl('', [Validators.required]));
        this.createCourceForm.get("materialBased")?.setValue('url');
        this.createCourceForm.removeControl('delivery_method');
        this.createCourceForm.removeControl('digital');
        this.createCourceForm.removeControl('purchase_order');
        this.createCourceForm.removeControl('manager_approval');
        this.createCourceForm.removeControl('who_see_course');
        this.createCourceForm.removeControl('email_playlist_creator');
        this.createCourceForm.removeControl('email_preffered_instructor');
        this.createCourceForm.removeControl('first_session_date');
        this.createCourceForm.removeControl('expiry_date');
        this.createCourceForm.addControl('expiry_date_type', new FormControl('', [Validators.required]));
        this.createCourceForm.removeControl('entity_business_area');
        this.createCourceForm.removeControl('certification');
        this.createCourceForm.removeControl('certification_expiry_type');
        this.createCourceForm.removeControl('validity_period');
        this.createCourceForm.removeControl('external_vendor');
        this.createCourceForm.removeControl('external_vendor_name');
        this.createCourceForm.removeControl('free_field_content');
        this.createCourceForm.addControl('for_whoom_single', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('learn_more_single', new FormControl(''));
        this.createCourceForm.removeControl('video_link');
        this.createCourceForm.removeControl('target_audience');
        this.createCourceForm.addControl('url', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('training_provided_by', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('duration', new FormControl('', [Validators.required]));
        if (!this.createCourceForm.controls.objective) {
          this.createCourceForm.addControl('objective', new FormControl('', [Validators.required]));
          this.createCourceForm.controls.objective = this.formBuilder.array([]);
          this.objectiveContentArray.push(this.addMoreObjective(''));
        }
        this.createCourceForm.addControl('subject', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('keyword', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('available_language', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('level', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('email_content_owner', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('email_training_contact', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('prerequisite', new FormControl(''));
        this.createCourceForm.addControl('resource', new FormControl(''));
        if (this.course_details.id) {
          if (this.course_details.url) {
            this.createCourceForm.controls.url.setValue(this.course_details.url);
          } else if (this.course_details.material_source) {
            this.createCourceForm.get("materialBased")?.setValue('upload');
            this.getmaterialsource('upload');
          }
          this.createCourceForm.controls.expiry_date_type.setValue(this.course_details.expiry_date_type);
          if (this.course_details.for_whoom) {
            this.createCourceForm.controls.for_whoom_single.setValue(this.courseService.getTText(this.course_details.for_whoom));
            this.createCourceForm.controls.for_whoom.setValue(JSON.parse(this.course_details.for_whoom));
          }
          if (this.course_details.learn_more) {
            this.createCourceForm.controls.learn_more_single.setValue(this.courseService.getTText(this.course_details.learn_more));
            this.createCourceForm.controls.learn_more.setValue(JSON.parse(this.course_details.learn_more));
          }
          if (this.course_details.learner_guideline) {
            const learner_guideline = JSON.parse(this.course_details.learner_guideline);
            learner_guideline.forEach((element: any) => {
              this.learnerguidelineFormArray.push(this.addMorelearnerGuideline(element.title, element.description));
            });
          }
        }else{
          this.createCourceForm.controls.learner_guideline = this.formBuilder.array([]);
          this.learnerguidelineFormArray.push(this.addMorelearnerGuideline('', ''));
        }
      }
      if (this.isCurriculum()) {
        this.createCourceForm.addControl('regional_cordinator', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('digital', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('manager_approval', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('who_see_course', new FormControl(''));
        this.createCourceForm.addControl('expiry_date', new FormControl(''));
        this.createCourceForm.addControl('certification', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('for_whoom_single', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('learn_more_single', new FormControl(''));
        this.createCourceForm.removeControl('url');
        this.createCourceForm.removeControl('email_playlist_creator');
        this.createCourceForm.removeControl('video_link');
        this.createCourceForm.removeControl('delivery_method');
        this.createCourceForm.removeControl('purchase_order');
        this.createCourceForm.removeControl('email_preffered_instructor');
        this.createCourceForm.removeControl('first_session_date');
        this.createCourceForm.addControl('expiry_date_type', new FormControl('', [Validators.required]));
        this.createCourceForm.removeControl('entity_business_area');
        this.createCourceForm.removeControl('external_vendor');
        this.createCourceForm.removeControl('external_vendor_name');
        this.createCourceForm.removeControl('free_field_content');
        this.createCourceForm.removeControl('target_audience');
        this.createCourceForm.removeControl('url');
        this.createCourceForm.addControl('training_provided_by', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('duration', new FormControl('', [Validators.required]));
        if (!this.createCourceForm.controls.objective) {
          this.createCourceForm.addControl('objective', new FormControl('', [Validators.required]));
          this.createCourceForm.controls.objective = this.formBuilder.array([]);
          this.objectiveContentArray.push(this.addMoreObjective(''));
        }
        this.createCourceForm.addControl('subject', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('keyword', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('available_language', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('level', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('email_content_owner', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('email_training_contact', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('prerequisite', new FormControl(''));
        this.createCourceForm.addControl('resource', new FormControl(''));
        if (this.course_details.id) {
          this.createCourceForm.controls.digital.setValue(this.course_details.digital);
          this.createCourceForm.controls.manager_approval.setValue(this.course_details.manager_approval);
          this.createCourceForm.controls.who_see_course.setValue(Number(this.course_details.who_see_course));
          this.createCourceForm.controls.expiry_date_type.setValue(this.course_details.expiry_date_type);
          if (this.course_details.expiry_date) {
            this.createCourceForm.controls.expiry_date.setValue(this.course_details.expiry_date);
          }
          this.createCourceForm.controls.certification.setValue(this.course_details.certification);
          if (this.course_details.certification == 'yes') {
            this.showCertificateExpiry = true;
            this.createCourceForm.addControl('validity_period', new FormControl(this.course_details.validity_period, [Validators.required]));
            this.createCourceForm.addControl('certification_expiry_type', new FormControl(this.course_details.certification_expiry_type, [Validators.required]));
          }
          if (this.course_details.for_whoom) {
            this.createCourceForm.controls.for_whoom_single.setValue(this.courseService.getTText(this.course_details.for_whoom));
            this.createCourceForm.controls.for_whoom.setValue(JSON.parse(this.course_details.for_whoom));
          }
          if (this.course_details.learn_more) {
            this.createCourceForm.controls.learn_more_single.setValue(this.courseService.getTText(this.course_details.learn_more));
            this.createCourceForm.controls.learn_more.setValue(JSON.parse(this.course_details.learn_more));
          }
          if (this.course_details.learner_guideline) {
            const learner_guideline = JSON.parse(this.course_details.learner_guideline);
            learner_guideline.forEach((element: any) => {
              this.learnerguidelineFormArray.push(this.addMorelearnerGuideline(element.title, element.description));
            });
          }
          if (this.course_details.curriculum_content) {
            const curriculum_content = JSON.parse(this.course_details.curriculum_content);
            curriculum_content.forEach((element: any) => {
              this.curriculumContentArray.push(this.addMoreCurriculumContent(element.description));
            });
          }
        }
        else {
          this.createCourceForm.controls.learner_guideline = this.formBuilder.array([]);
          this.createCourceForm.controls.curriculum_content = this.formBuilder.array([]);
          this.learnerguidelineFormArray.push(this.addMorelearnerGuideline('', ''));
          this.curriculumContentArray.push(this.addMoreCurriculumContent(''));
        }
      }
      if (this.isWebBased()) {
        this.createCourceForm.addControl('regional_cordinator', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('digital', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('purchase_order', new FormControl(''));
        this.createCourceForm.addControl('who_see_course', new FormControl(''));
        this.createCourceForm.removeControl('external_vendor');
        this.createCourceForm.removeControl('external_vendor_name');
        this.createCourceForm.removeControl('video_link');
        this.createCourceForm.removeControl('delivery_method');
        this.createCourceForm.removeControl('manager_approval');
        this.createCourceForm.removeControl('who_see_course');
        this.createCourceForm.removeControl('email_preffered_instructor');
        this.createCourceForm.removeControl('first_session_date');
        this.createCourceForm.addControl('expiry_date_type', new FormControl('', [Validators.required]));
        this.createCourceForm.removeControl('entity_business_area');
        this.createCourceForm.removeControl('expiry_date');
        this.createCourceForm.removeControl('learn_more_single');
        this.createCourceForm.removeControl('free_field_content');
        this.createCourceForm.removeControl('target_audience');
        this.createCourceForm.removeControl('url');
        this.createCourceForm.removeControl('email_playlist_creator');
        this.createCourceForm.addControl('certification', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('training_provided_by', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('duration', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('for_whoom_single', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('learn_more_single', new FormControl(''));
        if (!this.createCourceForm.controls.objective) {
          this.createCourceForm.addControl('objective', new FormControl('', [Validators.required]));
          this.createCourceForm.controls.objective = this.formBuilder.array([]);
          this.objectiveContentArray.push(this.addMoreObjective(''));
        }
        this.createCourceForm.addControl('subject', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('keyword', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('available_language', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('level', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('email_content_owner', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('email_training_contact', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('prerequisite', new FormControl(''));
        this.createCourceForm.addControl('resource', new FormControl(''));
        if (this.course_details.id) {
          this.createCourceForm.controls.digital.setValue(this.course_details.digital);
          this.createCourceForm.controls.certification.setValue(this.course_details.certification);
          this.createCourceForm.controls.expiry_date_type.setValue(this.course_details.expiry_date_type);
          if (this.course_details.purchase_order) {
            this.createCourceForm.controls.purchase_order.setValue(this.course_details.purchase_order);
          }
          if (this.course_details.certification == 'yes') {
            this.showCertificateExpiry = true;
            this.createCourceForm.addControl('validity_period', new FormControl(this.course_details.validity_period, [Validators.required]));
            this.createCourceForm.addControl('certification_expiry_type', new FormControl(this.course_details.certification_expiry_type, [Validators.required]));
          }
          if (this.course_details.for_whoom) {
            this.createCourceForm.controls.for_whoom_single.setValue(this.courseService.getTText(this.course_details.for_whoom));
            this.createCourceForm.controls.for_whoom.setValue(JSON.parse(this.course_details.for_whoom));
          }
          if (this.course_details.learn_more) {
            this.createCourceForm.controls.learn_more_single.setValue(this.courseService.getTText(this.course_details.learn_more));
            this.createCourceForm.controls.learn_more.setValue(JSON.parse(this.course_details.learn_more));
          }
          if (this.course_details.learner_guideline) {
            const learner_guideline = JSON.parse(this.course_details.learner_guideline);
            learner_guideline.forEach((element: any) => {
              this.learnerguidelineFormArray.push(this.addMorelearnerGuideline(element.title, element.description));
            });
          }
        }else{
          this.createCourceForm.controls.learner_guideline = this.formBuilder.array([]);
          this.learnerguidelineFormArray.push(this.addMorelearnerGuideline('', ''));
        }
      }
      if (this.isPlaylist()) {
        this.createCourceForm.removeControl('regional_cordinator');
        this.createCourceForm.removeControl('training_provided_by');
        this.createCourceForm.removeControl('duration');
        this.createCourceForm.removeControl('objective');
        this.createCourceForm.removeControl('subject');
        this.createCourceForm.removeControl('keyword');
        this.createCourceForm.removeControl('available_language');
        this.createCourceForm.removeControl('level');
        this.createCourceForm.removeControl('email_content_owner');
        this.createCourceForm.removeControl('email_training_contact');
        this.createCourceForm.removeControl('prerequisite');
        this.createCourceForm.removeControl('resource');
        this.createCourceForm.removeControl('delivery_method');
        this.createCourceForm.removeControl('digital');
        this.createCourceForm.removeControl('purchase_order');
        this.createCourceForm.removeControl('manager_approval');
        this.createCourceForm.removeControl('email_preffered_instructor');
        this.createCourceForm.removeControl('first_session_date');
        this.createCourceForm.removeControl('expiry_date');
        this.createCourceForm.addControl('expiry_date_type', new FormControl('', [Validators.required]));
        this.createCourceForm.removeControl('entity_business_area');
        this.createCourceForm.removeControl('certification');
        this.createCourceForm.removeControl('certification_expiry_type');
        this.createCourceForm.removeControl('validity_period');
        this.createCourceForm.removeControl('external_vendor');
        this.createCourceForm.removeControl('external_vendor_name');
        this.createCourceForm.removeControl('free_field_content');
        this.createCourceForm.addControl('for_whoom_single', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('email_playlist_creator', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('learn_more_single', new FormControl(''));
        this.createCourceForm.removeControl('video_link');
        this.createCourceForm.addControl('url', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('video_link', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('for_whoom', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('level', new FormControl('no', [Validators.required]));
        this.createCourceForm.addControl('target_audience', new FormControl('', [Validators.required]));
        this.createCourceForm.addControl('email_preffered_instructor', new FormControl('', [Validators.required]));
        if (this.course_details.id) {
          this.createCourceForm.controls.url.setValue(this.course_details.url);
          this.createCourceForm.controls.video_link.setValue(this.course_details.video_link);
          this.createCourceForm.controls.for_whoom.setValue(this.course_details.for_whoom);
          this.createCourceForm.controls.level.setValue(this.course_details.level);
          this.createCourceForm.controls.expiry_date_type.setValue(this.course_details.expiry_date_type);
          this.createCourceForm.controls.email_preffered_instructor.setValue(JSON.parse(this.course_details.email_preffered_instructor));
          if (this.course_details.level == 'yes') {
            this.regionTargetAudience = true;
            this.createCourceForm.addControl('who_see_course', new FormControl(Number(this.course_details.who_see_course), [Validators.required]));
            this.createCourceForm.removeControl('target_audience');
            this.createCourceForm.removeControl('email_preffered_instructor');
          }
          else if (this.course_details.level == 'no') {
            this.regionTargetAudience = false;
            this.createCourceForm.controls.target_audience.setValue(this.course_details.target_audience);
            this.createCourceForm.controls.email_preffered_instructor.setValue(this.course_details.email_preffered_instructor);
            this.createCourceForm.removeControl('who_see_course');
          }
          if (this.course_details.target_audience == 1) {
            this.regionTargetAudiencePlaylist = false;
            this.createCourceForm.addControl('email_preffered_instructor', new FormControl('', [Validators.required]));
            this.createCourceForm.controls.email_preffered_instructor.setValue(JSON.parse(this.course_details.email_preffered_instructor));
          } else if (this.course_details.target_audience == 2) {
            this.regionTargetAudiencePlaylist = true;
            this.createCourceForm.removeControl('email_preffered_instructor');
          }
          if (this.course_details.for_whoom) {
            this.createCourceForm.controls.for_whoom_single.setValue(this.courseService.getTText(this.course_details.for_whoom));
            this.createCourceForm.controls.for_whoom.setValue(JSON.parse(this.course_details.for_whoom));
          }
          if (this.course_details.learn_more) {
            this.createCourceForm.controls.learn_more_single.setValue(this.courseService.getTText(this.course_details.learn_more));
            this.createCourceForm.controls.learn_more.setValue(JSON.parse(this.course_details.learn_more));
          }
          if (this.course_details.learner_guideline) {
            const learner_guideline = JSON.parse(this.course_details.learner_guideline);
            learner_guideline.forEach((element: any) => {
              this.learnerguidelineFormArray.push(this.addMorelearnerGuideline(element.title, element.description));
            });
          }
        }
        else{
          this.createCourceForm.controls.learner_guideline = this.formBuilder.array([]);
          this.learnerguidelineFormArray.push(this.addMorelearnerGuideline('', ''));
        }
      }
      if (!this.isPlaylist() && this.course_details && this.course_details.objective) {
        const objective = JSON.parse(this.course_details.objective);
        this.createCourceForm.controls.objective = this.formBuilder.array([]);
        if (objective && typeof objective != 'string') {
          objective.forEach((element: any) => {
            this.objectiveContentArray.push(this.addMoreObjective(element.description));
          });
        }
      }
    });
    this.createCourceForm.get("description_single")?.valueChanges.subscribe(() => {
      this.valueChange();
    });
    this.createCourceForm.get("materialBased")?.valueChanges.subscribe((x) => {
      this.getmaterialsource(x);
    });
  }


  ngOnInit(): void {
    this.getCordinators();
    console.log("getProfileDetailsfromlocal",this.getprofileDetails);
  }

  requiredMessage(field:any){
    return this.lableConstant.form_fieldname_cannot_be_blank.replace('<form fieldname>', field).replace('<nom du champ>', field);
  }

  isILTAndvILT() {
    return this.selectedLearningType.id === this.LearningType[0].id;
  }

  isVideoBased() {
    return this.selectedLearningType.id === this.LearningType[1].id;
  }

  isMaterialBased() {
    return this.selectedLearningType.id === this.LearningType[2].id;
  }

  isCurriculum() {
    return this.selectedLearningType.id === this.LearningType[3].id;
  }

  isWebBased() {
    return this.selectedLearningType.id === this.LearningType[4].id;
  }

  isPlaylist() {
    return this.selectedLearningType.id === this.LearningType[5].id;
  }

  getmaterialsource(material_source: string) {
    this.materialBased = material_source;
    if (material_source == 'url') {
      this.createCourceForm.addControl("url", new FormControl('', [Validators.required, Validators.pattern(dataConstant.UrlPattern)]));
      this.createCourceForm.removeControl("material_source");
    } else {
      this.createCourceForm.addControl("material_source", new FormControl('', this.course_details && this.course_details.id ? [] : [Validators.required]));
      this.createCourceForm.removeControl("url")
    }
  }

  valueChange() {
    if (this.createCourceForm.value.description_single) {
      this.remainingText = 500 - this.createCourceForm.value.description_single.length;
    }
    else {
      this.remainingText = 500;
    }
  }

  numbersOnly(val: any) {
    let ctrl = this.createCourceForm.get('duration') as FormControl;
    let y = ctrl.value
    y = y.replace(/\D/g, '');
    if (y.length == 3 && val.key > 6) {
      y = y.substring(0, 2);
    }
    if (y.length == 4) {
      if (y.substring(2, 4) > 60) {
        y = y.substring(0, 2) + y.substring(2, 3);
        var durationObj4 = { duration: y };
        this.createCourceForm.patchValue(durationObj4);
        return;
      }
      let valduration = y.substring(0, 2) + ":" + y.substring(2, 4)

      var durationObj = { duration: valduration };
      this.createCourceForm.patchValue(durationObj);
    }
    else {
      var durationObj1 = { duration: y };
      this.createCourceForm.patchValue(durationObj1);
    }
    if (y > 2400) {
      var durationObj2 = { duration: '' };
      this.createCourceForm.patchValue(durationObj2);
    }
  }

  get learnerguidelineFormArray(): FormArray {
    return this.createCourceForm.get("learner_guideline") as FormArray;
  }
  get curriculumContentArray(): FormArray {
    return this.createCourceForm.get("curriculum_content") as FormArray;
  }
  get objectiveContentArray(): FormArray {
    return this.createCourceForm.get("objective") as FormArray;
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

  addMoreObjective(descriptionval: string) {
    return this.formBuilder.group({
      description: new FormControl(descriptionval, [Validators.required]),
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

  addObjectiveContent(descriptionval: string) {
    return this.objectiveContentArray.push(this.addMoreObjective(descriptionval));
  }

  removeObjectiveContent(i: any) {
    this.objectiveContentArray.removeAt(i);
  }

  multilaungauge(title: any) {
    const Data = this.createCourceForm.get(`${title}`)?.value;
    const modalRef = this.modalService.open(MultiLaunguageComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      data: Data,
      title: title
    };
    modalRef.componentInstance.passEntry.subscribe((res: any) => {
      this.createCourceForm.get(`${title}`)?.setValue(res);
    });
  }

  //get regional cordinators
  getCordinators() {
    this.commonService.showLoading();
    this.courseService.getNewregionalCordinator().subscribe(
      (res: any) => {
        this.regionsTargetObj = res.data;
        this.cordinatorsList = res.data.filter((x: {
          status: number;
        }) => x.status == 1);
        this.getBackupRegionalCordinator();
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
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
        this.commonService.errorHandling(err);
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
        this.commonService.errorHandling(err);
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
        this.commonService.errorHandling(err);
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
        this.commonService.errorHandling(err);
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
        this.commonService.errorHandling(err);
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
        this.commonService.errorHandling(err);
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
        this.commonService.errorHandling(err);
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
        this.commonService.errorHandling(err);
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
        this.commonService.errorHandling(err);
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
        this.commonService.errorHandling(err);
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
        this.commonService.errorHandling(err);
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
        this.commonService.errorHandling(err);
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
        this.commonService.errorHandling(err);
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
        if (this.course_id) {
          this.getCourseDetails()
        }
        else {
          this.commonService.hideLoading();
        }
      },
      (err: any) => {
        this.commonService.errorHandling(err);
        this.commonService.hideLoading();
      }
    );
  }

  getCourseDetails() {
    this.commonService.showLoading();
    this.courseService.courseDetail(this.course_id).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.course_details = res.data;
          this.createCourceForm.controls.title_single.setValue(this.courseService.getTText(this.course_details.title));
          this.createCourceForm.controls.title.setValue(JSON.parse(this.course_details.title));
          this.createCourceForm.controls.description_single.setValue(this.courseService.getTText(this.course_details.description));
          this.createCourceForm.controls.description.setValue(JSON.parse(this.course_details.description));

          this.createCourceForm.controls.training_provided_by.setValue(this.course_details.training_provided_by);
          this.createCourceForm.controls.duration.setValue(this.course_details.duration);
          this.createCourceForm.controls.subject.setValue(JSON.parse(this.course_details.subject));
          this.createCourceForm.controls.keyword.setValue(this.course_details.keyword);
          this.createCourceForm.controls.available_language.setValue(JSON.parse(this.course_details.available_language));
          this.createCourceForm.controls.level.setValue(Number(this.course_details.level));
          this.createCourceForm.controls.email_content_owner.setValue(this.course_details.email_content_owner);
          this.createCourceForm.controls.email_training_contact.setValue(this.course_details.email_training_contact);
          this.createCourceForm.controls.prerequisite.setValue(this.course_details.prerequisite);
          // this.createCourceForm.controls.resource.setValue(this.course_details.resource);
          this.createCourceForm.controls.learning_type.setValue(this.course_details.learning_type);
          this.createCourceForm.controls.additional_comment.setValue(this.course_details.additional_comment);
          if (this.createCourceForm.controls.regional_cordinator) {
            this.createCourceForm.controls.regional_cordinator.setValue(this.course_details.regional_cordinator);
          }
          if (this.course_details.learning_type != "6" && this.course_details.resource) {
            this.isFileResouce = dataConstant.ImageUrl + '/' + this.course_details.resource;
          }
          if (this.course_details.learning_type == "3" && this.course_details.material_source) {
            this.isMaterialSource = dataConstant.ImageUrl + '/' + this.course_details.material_source;
          }
          this.setrejectbutton()
          this.commonService.hideLoading();
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  setrejectbutton() {
    if (this.course_id) {
      this.courseService.courseHistory(this.course_id).subscribe((res: any) => {
        if (res && res.status == 1) {
          let history = res.data;
          this.showrejectbutton = history[history.length - 1] ? history[history.length - 1].action_by : '';
        }
      })
    }
  }


  handleFileInput(event: any) {
    this.FileConvertintoBytearray(event.target.files[0], async (f) => { // creating array bytes

      let objectdata: any = {
        fileName: f.name,
        base64FileBytes: this.byteArrayTobase64(f.bytes),
        attachmentId: - (this.fileToUpload.length + 1)
      };
      this.fileToUpload.push(objectdata);
    });
  }

  handleFileInput_Material(event: any) {
    this.FileConvertintoBytearray(event.target.files[0], async (f) => { // creating array bytes

      let objectdata: any = {
        fileName: f.name,
        base64FileBytes: this.byteArrayTobase64(f.bytes),
        attachmentId: - (this.fileToUpload_Material.length + 1)
      };
      this.fileToUpload_Material.push(objectdata);
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

  get_learningType(event: any) {
    this.learningType = event.target.value;
    if(this.learningType == 6){
      
    }
    setTimeout(() => {
      // var topOfElement = target.offsetTop;
      // window.scroll({ top: topOfElement, behavior: "smooth" });
    }, 200);
  }

  getPublisher() {
    this.commonService.showLoading();
    this.courseService.getNewPublisherByLearningType(this.learningType).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.publisherList = res.data;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  certificationType(event: any) {
    if (event.id == 'yes') {
      this.showCertificateExpiry = true;
      this.createCourceForm.addControl('validity_period', new FormControl('', [Validators.required]));
      this.createCourceForm.addControl('certification_expiry_type', new FormControl('', [Validators.required]));
    } else {
      this.showCertificateExpiry = false;
      this.createCourceForm.removeControl('validity_period');
      this.createCourceForm.removeControl('certification_expiry_type');
    }
  }

  targetAudience(event: any) {
    if (event.id == 'yes') {
      this.regionTargetAudience = true;
      this.createCourceForm.addControl('who_see_course', new FormControl('', [Validators.required]));
      this.createCourceForm.removeControl('target_audience');
      this.createCourceForm.removeControl('email_preffered_instructor');
    }
    else if (event.id == 'no') {
      this.regionTargetAudience = false;
      this.createCourceForm.addControl('target_audience', new FormControl('1', [Validators.required]));
      this.createCourceForm.addControl('email_preffered_instructor', new FormControl('', [Validators.required]));
      this.createCourceForm.removeControl('who_see_course');
    }
  }

  targetAudiencePlaylsit(event: any) {
    if (event.target.value == 2) {
      this.regionTargetAudiencePlaylist = true;
      this.createCourceForm.removeControl('email_preffered_instructor');
    }
    if (event.target.value == 1) {
      this.regionTargetAudiencePlaylist = false;
      this.createCourceForm.addControl('email_preffered_instructor', new FormControl('', [Validators.required]));
    }
  }

  createUpdateCoursePublisher() {
    if (this.selectedPublisherId) {
      this.createUpdateCourse('pending');
    }
  }

  externalVendor(event: any) {
    if (event.id == 'yes') {
      this.externalVendorname = true;
      this.createCourceForm.addControl('external_vendor_name', new FormControl('', [Validators.required]));
    } else {
      this.externalVendorname = false;
      this.createCourceForm.removeControl('external_vendor_name');
    }
  }
  isDraft() {
    if (this.course_details?.status === this.CarouselStatus.publish || this.course_details?.status === this.CarouselStatus.expired || this.course_details?.status === this.CarouselStatus.pending || this.course_details?.status === this.CarouselStatus.reject) {
      return false;
    }
    if (this.getprofileDetails.data.id != this.course_details?.user_id && this.course_details?.transfer_user_id && !this.course_details?.publisher_status && this.isReviewer) {
      return false;
    }
    return true;
  }

  isReject() {
    if (this.course_details?.status === this.CarouselStatus.publish || this.course_details?.status === this.CarouselStatus.expired || this.course_details?.status === this.CarouselStatus.reject) {
      return false;
    }
    if (this.isRequester  || this.isPlayListRole || !this.course_details.id) {
      return false;
    }
    if (this.course_details?.status === this.CarouselStatus.draft) {
      return false;
    }
    if (this.course_details?.transfer_user_id && !this.course_details?.publisher_status && this.isReviewer) {
      return false;
    }
    return true;
  }

  isPublish() {
    if (this.course_details?.status === this.CarouselStatus.publish || this.course_details?.status === this.CarouselStatus.expired) {
      return false;
    }
    if (!this.isPublisher) {
      return false;
    }
    if (this.getprofileDetails.data.id != this.course_details?.user_id && this.course_details?.transfer_user_id && !this.course_details?.publisher_status && this.isReviewer) {
      return false;
    }
    return true;
  }

  isSubmit() {
    if (!this.isRequester || (this.isRequester && (this.isPublisher || this.isReviewer || this.isPlayListRole || 
      this.isRom))) {
      return false;
    }
    if (this.course_details?.status === this.CarouselStatus.publish || this.course_details?.status === this.CarouselStatus.expired) {
      return false;
    }
    if (this.getprofileDetails.data.id === this.course_details?.user_id && this.course_details?.status === this.CarouselStatus.pending) {
      return false;
    }
  /*  if (this.course_details?.status === this.CarouselStatus.pending && this.course_details?.status === this.CarouselStatus.pending) {
      return false;
    } */
    if (this.getprofileDetails.data.id != this.course_details?.user_id && this.course_details?.transfer_user_id && !this.course_details?.publisher_status && this.isReviewer) {
      return false;
    }

    return true;
  }

  reject() {
    this.commonService.showLoading();
    let statusobj = { course_id: this.course_details.id, status: 'reject', status_comment: this.rejectcomment }
    this.courseService.changeStatus(statusobj).subscribe((res: any) => {
      this.commonService.hideLoading();
      this.router.navigate(['/dashboard/cct']);
    }, (err: any) => {
      this.commonService.hideLoading();
      this.commonService.errorHandling(err);
    })
  }

  createUpdateCourse(status: string) {
    this.isSubmitted = true;
    if (this.createCourceForm.invalid) {
      return;
    }
    const body = this.createCourceForm.value;
    body.status = status;
    if (this.selectedPublisherId) {
      body.publisher_id = this.selectedPublisherId;
    }
    if (body.learning_type != "6") {
      this.fileToUpload.forEach((element: { fileName: string; base64FileBytes: any; }) => {
        body.resource_ext = element.fileName.split('.')[1]
        body.resource = element.base64FileBytes
      });
    }

    if (body.learning_type == "3") {
      this.fileToUpload_Material.forEach((element: { fileName: string; base64FileBytes: any; }) => {
        body.material_source_ext = element.fileName.split('.')[1]
        body.material_source = element.base64FileBytes
      });
    }
    if (status == "publish") {
      body.intranet_url = this.publishForm.value.intranet_url;
      body.internet_url = this.publishForm.value.internet_url;
      body.status_comment = this.publishForm.value.status_comment;
    }
    const englishSlug: any = 'english';
    if (body.title_single) {
      if (body.title) {
        let controlValue = body.title?.find((x: {}) => Object.keys(x) == englishSlug);
        if (controlValue) {
          body.title[body.title.indexOf(controlValue)][`${englishSlug}`] = body.title_single
        }
        else {
          body.title.push({ english: body.title_single });
        }
      } else {
        body.title = [{ english: body.title_single }];;
      }
    }
    if (body.description_single) {
      if (body.description) {
        let controlValue = body.description?.find((x: {}) => Object.keys(x) == englishSlug);
        if (controlValue) {
          body.description[body.description.indexOf(controlValue)][`${englishSlug}`] = body.description_single
        }
        else {
          body.description.push({ english: body.description_single });
        }
      } else {
        body.description = [{ english: body.description_single }];;
      }
    }
    if (body.for_whoom_single) {
      if (body.for_whoom) {
        let controlValue = body.for_whoom?.find((x: {}) => Object.keys(x) == englishSlug);
        if (controlValue) {
          body.for_whoom[body.for_whoom.indexOf(controlValue)][`${englishSlug}`] = body.for_whoom_single
        }
        else {
          body.for_whoom.push({ english: body.for_whoom_single });
        }
      } else {
        body.for_whoom = [{ english: body.for_whoom_single }];;
      }
    }
    if (body.learn_more_single) {
      if (body.learn_more) {
        let controlValue = body.learn_more?.find((x: {}) => Object.keys(x) == englishSlug);
        if (controlValue) {
          body.learn_more[body.learn_more.indexOf(controlValue)][`${englishSlug}`] = body.learn_more_single
        }
        else {
          body.learn_more.push({ english: body.learn_more_single });
        }
      } else {
        body.learn_more = [{ english: body.learn_more_single }];;
      }
    }
    if (!this.course_id) {
      this.commonService.showLoading();
      this.courseService.createCource(body).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('Course', 'Successfully Saved.');
          this.router.navigateByUrl(`/dashboard/cct/view/${res.data.id}`);
        },
        (err: any) => {
          this.commonService.errorHandling(err);
          this.commonService.toastErrorMsg('Error', err.message);
        }
      );
    }
    else {
      body.course_id = this.course_id;
      this.commonService.showLoading();
      this.courseService.updateCourse(body).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('Course', 'Successfully Saved.');
          this.router.navigateByUrl(`/dashboard/cct/view/${this.course_id}`);
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.errorHandling(err);
        }
      );
    }
  }
}
