import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';
import { iif, Subscription } from 'rxjs';
import { ToolbarService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';

import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
const emailregexp = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
/* const urlregex = '^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$' ; */
/* const urlregex = '^(https:\/\/www\.|http:\/\/www\.|www\.)[a-zA-Z0-9\-_$]+\.[a-zA-Z]{2,5}$'; */
const urlregex ='^(https?:\\/\\/)?'+'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,5}|'+'((\\d{1,3}\\.){3}\\d{1,3}))'+'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+'(\\?[;&a-z\\d%_.~+=-]*)?'+'(\\#[-a-z\\d_]*)?$';
@Component({
  selector: 'app-create-new-course',
  templateUrl: './create-new-course.component.html',
  styleUrls: ['./create-new-course.component.scss'],
  providers: [ToolbarService, HtmlEditorService]
})
export class CreateNewCourseComponent implements OnInit {
  routergetdata: any;
  formCtrlSub: Subscription = new Subscription();
  isImageSaved: any;
  totalObjnew: any = {};


  public tools: object = {
    items: [
      'UnorderedList']
  };
  public newTools: object = {
    items: [
      'UnorderedList']
  };

  curriculumEditor: any;
  public cardImageBase64: any;
  public createCourceForm!: FormGroup;
  public commonCreateCourceForm!: FormGroup;
  public commonCreateCourceForm_playlist!: FormGroup;
  public iltandViltForm!: FormGroup;
  public videobasedForm!: FormGroup;
  public materialbasedForm!: FormGroup;
  public currriculumForm!: FormGroup;
  public webbasedForm!: FormGroup;
  public playlistForm!: FormGroup;
  public publishForm!: FormGroup;
  public showCertificateExpiry: boolean = false;
  public showCertificateExpiry_Curriculum: boolean = false;
  public showCertificateExpiry_Webbased: boolean = false;
  public regionTargetAudience: boolean = false;
  public regionTargetAudiencePlaylist: boolean = false;
  public externalVendorname: boolean = false;
  public externalVendorname_Webbased: boolean = false;
  public materialsourceurl: boolean = false;
  public materialsourceupload: boolean = false;
  showVendor: boolean = false;
  showVendor_Webbased: boolean = false;
  getprofileDetails: any;
  showrejectbutton: any;
  showStatus: any;
  user_id: any;
  courseId: any;
  corseId: any;
  public learnerGuidearray: any = [];
  public learningType: any = '';
  public learningTypeSelected: any = '0';
  public selectedLanguages: any = [];
  public learnerGuidelines: any = [];
  fieldArrObj: any = []
  public cctLevel: any;
  notification: boolean = false;
  fileToUpload: any[] = [];
  fileToUpload_Material: any[] = [];
  isFileResouce = '';
  j: any = 0;
  remainingText: any = 0;
  public lang;
  public imageError: string = "";
  public requiredFields: any = {
    "1": {
      "common":
      {
        "title": [Validators.required],
        //"duration":[Validators.required],
        "learning_type": [Validators.required],
        "description": [Validators.required],
        "objective": [Validators.required],
        "level": [Validators.required],
        "subject": [Validators.required],
        "keyword": [Validators.required],
        "email": [Validators.required, Validators.pattern(emailregexp)],
        "certification_expiry_type": [Validators.required],
        "validity_period": [Validators.required],
        "external_vendor_name": [Validators.required],
        "training_provided_by": [Validators.required],
        "available_language": [Validators.required],
        "email_training_contact": [Validators.required, Validators.pattern(emailregexp)]
      },
      'each': {
        "manager_approval": [Validators.required],
        "digital": [Validators.required],
        "certification": [Validators.required],
        "delivery_method": [Validators.required],
        "for_whoom": [Validators.required],
        "first_session_date": [Validators.required],
        "expiry_date": [Validators.required],
        "external_vendor": [Validators.required],
        "entity_business_area": [Validators.required],
        "email_preffered_instructor": [Validators.required],
        'regional_cordinator': [Validators.required]
      }
    },
    '2':
    {
      'common':
      {
        "title": [Validators.required],
        "duration": [Validators.required],
        "learning_type": [Validators.required],
        "description": [Validators.required],
        "objective": [Validators.required],
        "level": [Validators.required],
        "subject": [Validators.required],
        "keyword": [Validators.required],
        "email": [Validators.required, Validators.pattern(emailregexp)],
        "training_provided_by": [Validators.required],
        "available_language": [Validators.required],
        "email_training_contact": [Validators.required, Validators.pattern(emailregexp)]
      },
      'each': {
        "email_preffered_instructor": [Validators.required, Validators.pattern(emailregexp)]
      }
    },
    '3':
    {
      'common':
      {
        "title": [Validators.required],
        "duration": [Validators.required],
        "learning_type": [Validators.required],
        "description": [Validators.required],
        "objective": [Validators.required],
        "level": [Validators.required],
        "subject": [Validators.required],
        "keyword": [Validators.required],
        "email": [Validators.required, Validators.pattern(emailregexp)],
        "training_provided_by": [Validators.required],
        "available_language": [Validators.required],
        "email_training_contact": [Validators.required, Validators.pattern(emailregexp)]
      },
      'each': {
        "material_source": [Validators.required],
        "url": [Validators.required,Validators.pattern(urlregex)]
      }
    },
    '4':
    {
      'common':
      {
        "title": [Validators.required],
        "duration": [Validators.required],
        "learning_type": [Validators.required],
        "description": [Validators.required],
        "objective": [Validators.required],
        "level": [Validators.required],
        "subject": [Validators.required],
        "keyword": [Validators.required],
        "email": [Validators.required, Validators.pattern(emailregexp)],
        "training_provided_by": [Validators.required],
        "available_language": [Validators.required],
        "email_training_contact": [Validators.required, Validators.pattern(emailregexp)]
      },
      'each': {
        "manager_approval": [Validators.required],
        "digital": [Validators.required],
        "certification": [Validators.required],
        "for_whoom": [Validators.required],
        "external_vendor_name": [Validators.required]
      }
    }, '5':
    {
      'common':
      {
        "title": [Validators.required],
        "duration": [Validators.required],
        "learning_type": [Validators.required],
        "description": [Validators.required],
        "objective": [Validators.required],
        "level": [Validators.required],
        "subject": [Validators.required],
        "keyword": [Validators.required],
        "email": [Validators.required, Validators.pattern(emailregexp)],
        "training_provided_by": [Validators.required],
        "available_language": [Validators.required],

      },
      'each': {
        "digital": [Validators.required],
        "certification": [Validators.required],
        "external_vendor": [Validators.required],
        "email_preffered_instructor": [Validators.required, Validators.pattern(emailregexp)]
      }
    }, '6':
    {
      'common':
      {
        "title": [Validators.required],
        "description": [Validators.required],
      },
      'each': {
        "url": [Validators.required],
        "video_link": [Validators.required],
        "for_whoom": [Validators.required],
        "level": [Validators.required],
        "who_see_course": [Validators.required],
        "free_field_content": [Validators.required],
        "email_preffered_instructor": [Validators.required]
      }
    }
  };
  public cctExpiryperiod: any = [
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
    },
  ];

  public yesNo: any = [
    { id: 'yes', name: 'Yes' },
    { id: 'no', name: 'No' },
  ];
  target_audience_selected = 'no';
  public cctExpiryType: any;
  public validityPeriod: any;

  public vendorType: any;
  public cctSubjects: any;
  public entityList: any;

  public deliveryMethod: any;
  public selectedDeliveryMethod: any;
  public selectedemailPrefferedInstructor: any;
  public selectedentityBusinessArea: any;
  public selectedExternalVendor: any;
  public whocanSee: any;
  public preferedInstructor: any;
  public subjectId: any;
  public availableLanguages: any;
  public learningTypes: any;

  showtitle: any;
  showobjective: any;
  showdescription: any;
  showforwhoom: any;
  showlearnmore: any;
  showlevel: any;

  showCurriculumEmail: any;
  showCurriculumLink: any;
  showCurriculumFreeText: any;
  showCurriculumContent: any;
  showCurriculumLearnMore: any;
  showCurriculumForWhom: any;
  showCurriculumWhoSee: any;
  showCurriculumRegional: any;

  showMaterialURLchecked: boolean = false;
  showMaterialUploadchecked: boolean = false;

  showILTWhoSee: any;
  showILTEmail: any=[];
  showILTForWhom: any;
  showResource:any;
  showILTLearnMore: any;
  showILTtitleAdditional: any;
  showILTEntity: any;
  showILTVendorName: any;
  showILTRegional: any;
  showILTDeliveryMethod: any;
  showILTFree: any;

  public showPlaylistTargetAudience: any;
  showPlaylistEmail: any;
  rejectcomment: any;

  getUserrole: any; //to get user role
  public cordinatorsList: any = [];
  backupCordinatorsList: any =[];
  public course_count = {
    closed: 0,
    draft: 0,
    pending: 0,
    rejected: 0,
    submitted: 0,
    total: 0,
    transferred: 0
  };
  publisherList: any = [];
  selectedPublisherId: any;

  constructor(
    private fb: FormBuilder,
    private courceService: CourcesService,
    private router: Router,
    private authService: AuthenticationService
  ) {
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.getUserrole = this.authService.getRolefromlocal();
    //this.getUserrole = JSON.parse(this.authService.getRolefromlocal());
    this.lang = environment.lang;
    console.log(this.router.getCurrentNavigation()?.extras.state)

    if (this.router.getCurrentNavigation()?.extras.state != undefined) {

      this.routergetdata = this.router.getCurrentNavigation()?.extras.state;
      if (!this.routergetdata) {
        this.router.navigateByUrl('/dashboard/cources');
      }
      if (this.routergetdata.status != "draft") {
        this.user_id = this.routergetdata.user_id;
      }
      this.setrejectbutton(this.routergetdata.id);
      this.learningType = this.routergetdata.learning_type;
      this.selectedLanguages = JSON.parse(this.routergetdata['available_language']);
      //  this.learnerGuidelines = JSON.parse(this.routergetdata['learner_guideline']);
      this.subjectId = Number(this.routergetdata['subject']);
      this.showlevel = Number(this.routergetdata.level);
      console.log(this.routergetdata)
      this.showtitle = this.courceService.getTText(this.routergetdata.title);
      this.showobjective = this.courceService.getTText(this.routergetdata.objective);
      this.showdescription = this.courceService.getTText(this.routergetdata.description)
      this.showforwhoom = this.courceService.getTText(this.routergetdata.for_whoom)
      this.showlearnmore = this.courceService.getTText(this.routergetdata.learn_more);
      this.showResource = this.routergetdata.resource;
      if (this.learningType != "6") {
        if (this.routergetdata.resource != null) {
          this.isFileResouce = 'https://orange.mindscroll.info/public/public/' + this.routergetdata.resource;
          // let objectdata: any = {
          //   fileName: this.routergetdata.resource.split('/')[3],
          //   url: 'https://orange.mindscroll.info/public/public/' + this.routergetdata.resource
          // };
          // this.fileToUpload.push(objectdata);
        }
      }
      if (this.learningType == "3") {
        if (this.routergetdata.material_source != null) {
          let objectdata: any = {
            fileName: this.routergetdata.material_source.split('/')[3],
            url: 'https://orange.mindscroll.info/' + this.routergetdata.material_source
          };
          this.fileToUpload_Material.push(objectdata);
        }
      }
      //for (let l in learner_guide) {
      //  console.log(l[0])
      //  console.log(l[this.j][1])
      //  this.addLearnerGuideline(l[this.j][0], l[this.j][1]);
      //  //this.t.push({ title: l[this.j][0], description: l[this.j][1] })
      //  //this.j = this.j + 1;
      //}

      if (this.routergetdata.learning_type == "1") {
        this.showILTWhoSee = Number(this.routergetdata.who_see_course)
        this.showILTEmail = JSON.parse(this.routergetdata.email_preffered_instructor)
        this.showILTFree = this.routergetdata.free_field_content
        this.showILTDeliveryMethod = Number(this.routergetdata.delivery_method)
        this.showILTLearnMore = this.courceService.getTText(this.routergetdata.learn_more);
        this.showILTForWhom = this.courceService.getTText(this.routergetdata.for_whoom);
        this.showILTtitleAdditional = this.routergetdata.title_additional
        this.showILTEntity = Number(this.routergetdata.entity_business_area)
        //this.showILTExiryType = Number(this.routergetdata.entity_business_area)
        this.showILTRegional = Number(this.routergetdata.regional_cordinator)
        this.showILTVendorName = this.routergetdata.external_vendor_name
        console.log("prefered instructor",this.showILTEmail);
        if (this.routergetdata.certification == "yes") {
          this.showCertificateExpiry = true
        }
        else {
          this.showCertificateExpiry = false
        }
        if (this.routergetdata.external_vendor == "yes") {
          this.externalVendorname = true
        }
        else {
          this.externalVendorname = false
        }

      }
      else if (this.routergetdata.learning_type == "2") {

      }
      else if (this.routergetdata.learning_type == "3") {
        if (this.routergetdata.url != "") {
          this.showMaterialURLchecked = true;
          this.materialsourceurl = true;
          this.showMaterialUploadchecked = false;
          this.materialsourceupload = false;

        }
        else {
          this.showMaterialURLchecked = false;
          this.materialsourceurl = false;
          this.showMaterialUploadchecked = true;
          this.materialsourceupload = true;

        }

      }
      else if (this.routergetdata.learning_type == "4") {
        this.showCurriculumEmail = this.routergetdata.email_preffered_instructor
        this.showCurriculumLink = this.routergetdata.video_link
        this.showCurriculumFreeText = this.routergetdata.title_additional
        this.showCurriculumContent = this.routergetdata.external_vendor_name
        this.showCurriculumLearnMore = this.courceService.getTText(this.routergetdata.learn_more);
        //this.showCurriculumForWhom = this.courceService.getTText(this.routergetdata.for_whoom);
        this.showCurriculumWhoSee = this.routergetdata.who_see_course
        this.showCurriculumRegional = Number(this.routergetdata.regional_cordinator)
        if (this.routergetdata.certification == "yes") {
          this.showCertificateExpiry_Curriculum = true
        }
        else {
          this.showCertificateExpiry_Curriculum = false
        }
      }
      else if (this.routergetdata.learning_type == "5") {
        if (this.routergetdata.certification == "yes") {
          this.showCertificateExpiry_Webbased = true
        }
        else {
          this.showCertificateExpiry_Webbased = false
        }
        if (this.routergetdata.external_vendor == "yes") {
          this.externalVendorname_Webbased = true
        }
        else {
          this.externalVendorname_Webbased = false
        }
      }
      else if (this.routergetdata.learning_type == "6") {
        this.showPlaylistTargetAudience = this.routergetdata['level'] == "1" ? "yes" : "no";
        this.showPlaylistEmail = this.routergetdata.for_whoom.toString().replace('"', '').replace('"', '');
        if (this.routergetdata.level == "yes"){
          this.regionTargetAudience = true;
        }
        else{
          this.regionTargetAudience = false;
        }
      }
    }
  }

  /*  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'));
   var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
       return new boosted.Tooltip(tooltipTriggerEl)
    }); */
  /* editorConfig: AngularEditorConfig = {
    sanitize: false,
    editable: true,
    
    height: '100px',
    enableToolbar: true,
    showToolbar: true,
    toolbarHiddenButtons:[
      ['bold',
      'undo',
      'redo',
      'italic',
      'underline',
      'italic',
      'strikeThrough',
      'subscript',
      'superscript',     
      'indent',
      'outdent',
      'insertOrderedList',
      'heading',
      'fontName',
      'textColor',
      'backgroundColor',
      'insertImage',
      'insertVideo',
      'horizontalLine',
      'clearFormatting',
      'htmlCode'
    ],
    [
      'fontSize',
      'textColor',
      'backgroundColor',
      'customClasses',
      'link',
      'unlink',
      'insertImage',
      'insertVideo',
      'insertHorizontalRule',
      'removeFormat',
      'toggleEditorMode'
    ]]
  }; */
  //get regional cordinators
  getCordinators() {
    this.courceService.getNewregionalCordinator().subscribe(
      (res: any) => {
        console.log(res);
        this.cordinatorsList = res.data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  getBackupRegionalCordinator(){
    this.courceService.getBackupRegionalCordinator().subscribe(
      (res: any) => {
        this.backupCordinatorsList = res.data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  //publisherWithId
  /*  getNewPublisherId(){
     this.courceService.getNewPublisherId(id).subscribe(
       (res: any) => {
         console.log(res);
         this.publisherNewList = res.data;
       },
       (err: any) => {
         console.log(err);
       }
     );
   } */

  getvendorType() {
    this.courceService.getVendortype().subscribe(
      (res: any) => {
        this.vendorType = res.data;
        console.log(this.vendorType);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getLevel() {
    this.courceService.getcctLevel().subscribe(
      (res: any) => {
        this.cctLevel = res.data;
        console.log("cct level", this.cctLevel);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getSubjects() {
    this.courceService.getSubjects().subscribe(
      (res: any) => {
        this.cctSubjects = res.data;
        console.log(this.cctSubjects);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getValidityPeriod() {
    this.courceService.getValidityperiod().subscribe(
      (res: any) => {
        this.validityPeriod = res.data;
        console.log(this.validityPeriod);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getEntitylist() {
    this.courceService.getEntitylist().subscribe(
      (res: any) => {
        console.log(res);
        this.entityList = res.data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getDeliveryMethod() {
    this.courceService.getDeliveryMethod().subscribe(
      (res: any) => {
        console.log(res);
        this.deliveryMethod = res.data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getWhocansee() {
    this.courceService.whoSeeCourse().subscribe(
      (res: any) => {
        console.log(res);
        this.whocanSee = res.data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  //prefered instructor
  getPreferedInstructor() {
    this.courceService.getpreferedInstructor().subscribe(
      (res: any) => {
        console.log(res);
        this.preferedInstructor = res.data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  //get Languages
  getLanguages() {
    this.courceService.getLanguages().subscribe(
      (res: any) => {
        console.log(res);
        this.availableLanguages = res.data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  //getLearning type
  getLearningType() {
    this.courceService.getLearningType().subscribe(
      (res: any) => {
        console.log(res);
        this.learningTypes = res.data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  //get Expirytype
  getExpiryType() {
    this.courceService.getExpiryType().subscribe(
      (res: any) => {
        console.log(res);
        this.cctExpiryType = res.data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getPublisher() {
    this.courceService.getNewPublisherByLearningType(this.learningType).subscribe(
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

  getTotalCourse() {
    this.courceService.getCources().subscribe(
      (res: any) => {
        this.course_count = res.data.course_count;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  getpublisherData() {
    this.getPublisher();
  }

  ngOnInit(): void {

    this.getCordinators();
    this.getBackupRegionalCordinator();
    this.getvendorType();
    this.getLevel();
    this.getSubjects();
    this.getValidityPeriod();
    this.getTotalCourse();
    this.getEntitylist();
    this.getDeliveryMethod();
    this.getWhocansee();
    this.getPreferedInstructor();
    this.getLanguages();
    this.getLearningType();
    this.getExpiryType();

    //common form
    this.commonCreateCourceForm_playlist = this.fb.group({
      titleArr: new FormArray([]),
      descriptionArr: new FormArray([]),
      title: new FormControl(''),
      title_single: new FormControl('', [Validators.required]),
      description_single: new FormControl('', [Validators.required]),
      description: new FormControl(''),
    });
    this.commonCreateCourceForm = this.fb.group({
      titleArr: new FormArray([]),
      descriptionArr: new FormArray([]),
      objectiveArr: new FormArray([]),
      //title: new FormArray([]),
      title: new FormControl(''),
      title_single: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
      learning_type: new FormControl('', [Validators.required]),
      description_single: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      resource: [''],
      objective_single: new FormControl('', [Validators.required]),
      objective: new FormControl(''),
      level: new FormControl('', [Validators.required]),
      subject: new FormControl('', [Validators.required]),
      /* additional_comment: new FormControl(''), */
      prerequisite: new FormControl(''),
      keyword: new FormControl('', [Validators.required]),
      email_content_owner: new FormControl('', [
        Validators.required,
        Validators.pattern(emailregexp),
      ]),
      training_provided_by: new FormControl('', [Validators.required]),
      available_language: new FormControl('', [Validators.required]),
      //no field
      email_training_contact: new FormControl('', [
        Validators.required,
        Validators.pattern(emailregexp),
      ]),
    });
    if (this.routergetdata == undefined) {
      this.languageValueSet_new(this.commonCreateCourceForm, 'title_single', 'titleArr');
      this.languageValueSet_new(this.commonCreateCourceForm_playlist, 'title_single', 'titleArr');
      this.languageValueSet_new(this.commonCreateCourceForm_playlist, 'description_single', 'descriptionArr');
      this.languageValueSet_new(this.commonCreateCourceForm, 'description_single', 'descriptionArr');
      this.languageValueSet_new(this.commonCreateCourceForm, 'objective_single', 'objectiveArr');
      this.formCtrlSub = this.commonCreateCourceForm.valueChanges
        .debounceTime(500)
        .subscribe(($durationx: any) => {
          this.totalObjnew = {
            ...this.iltandViltForm.value,
            ...this.commonCreateCourceForm.value,
          };
          this.formatArrayData(this.totalObjnew, this.commonCreateCourceForm, 'title', 'titleArr');
          this.formatArrayData(this.totalObjnew, this.commonCreateCourceForm_playlist, 'title', 'titleArr');
          this.formatArrayData(this.totalObjnew, this.commonCreateCourceForm_playlist, 'description', 'descriptionArr');
          this.formatArrayData(this.totalObjnew, this.commonCreateCourceForm, 'description', 'descriptionArr');
          this.formatArrayData(this.totalObjnew, this.commonCreateCourceForm, 'objective', 'objectiveArr');
          this.formatArrayData(this.totalObjnew, this.iltandViltForm, 'for_whoom', 'forWhomArr');
          this.formatArrayData(this.totalObjnew, this.iltandViltForm, 'learn_more', 'learnMoreArr');
          this.formatArrayData(this.totalObjnew, this.currriculumForm, 'for_whoom', 'forWhomArr');
          this.formatArrayData(this.totalObjnew, this.currriculumForm, 'learn_more', 'learnMoreArr');
        });
    }
    this.iltandViltForm = this.fb.group({
      manager_approval: new FormControl('', [Validators.required]),
      digital: new FormControl('', [Validators.required]),
      certification: new FormControl('', [Validators.required]),
      certification_expiry_type: new FormControl(''),
      validity_period: new FormControl(''),
      external_vendor_name: new FormControl(''),
      expiry_date_type: new FormControl('', [Validators.required]),
      purchase_order: new FormControl(),
      // email_training_contact: new FormControl('', [Validators.required]),
      delivery_method: new FormControl('', [Validators.required]),
      forWhomArr: new FormArray([]),
      learnMoreArr: new FormArray([]),
      for_whoom: new FormControl(''),
      learn_more: new FormControl(''),
      for_whoom_single: new FormControl('', [Validators.required]),
      learn_more_single: new FormControl('',[
        Validators.required,
        Validators.pattern(urlregex),
      ]),
      cost_of_training: new FormControl(''),
      // cost_of_training: new FormControl('', [Validators.required]),	        
      free_field_content: new FormControl(''),
      url: new FormControl(''),
      //s need to add
      //provide_video_link: new FormControl(''),
      video_link: new FormControl(''),
      //e need to add
      first_session_date: new FormControl('', [Validators.required]),
      expiry_date: new FormControl(''),
      title_additional: new FormControl(''),
      external_vendor: new FormControl('', [Validators.required]),

      entity_business_area: new FormControl('', [Validators.required]),
      email_preffered_instructor: new FormControl('', [Validators.required]),

      who_see_course: new FormControl(),
      additional_comment: new FormControl(''),

      // learner_guideline: new FormControl(''),
      learner_guideline: this.fb.array([]),
      //ilt and vilt

      regional_cordinator:
        this.getUserrole.id === 2
          ? new FormControl('', [Validators.required])
          : new FormControl(),
    });
    if (this.routergetdata == undefined) {
      this.addLearnerGuideline('', '');
      this.languageValueSet_new(this.iltandViltForm, 'for_whoom_single', 'forWhomArr');
      this.languageValueSet_new(this.iltandViltForm, 'learn_more_single', 'learnMoreArr');
    }

    //video based
    this.videobasedForm = this.fb.group({
      video_link: new FormControl('',Validators.pattern(urlregex)),
      additional_comment: new FormControl(''),
      // email_preffered_instructor: new FormControl('', [Validators.required,
      //   Validators.pattern(emailregexp)]),
      regional_cordinator:
        this.getUserrole.id === 2
          ? new FormControl('', [Validators.required])
          : new FormControl()
    });

    //material based
    this.materialbasedForm = this.fb.group({
      //material based          
      material_source: new FormControl(''),
      url: new FormControl('',Validators.pattern(urlregex)),
      additional_comment: new FormControl(''),
      regional_cordinator:
        this.getUserrole.id === 2
          ? new FormControl('', [Validators.required])
          : new FormControl()
      //material
    });

    //curriculum
    this.currriculumForm = this.fb.group({
      /* email_preffered_instructor: new FormControl('', [Validators.required,
      Validators.pattern(emailregexp)]), */
      digital: new FormControl('', [Validators.required]),
      manager_approval: new FormControl('', [Validators.required]),
      certification: new FormControl('', [Validators.required]),
      certification_expiry_type: new FormControl(''),
      validity_period: new FormControl(''),
      learn_more: new FormControl(''),
      /*  video_link: new FormControl(''), */
      /*  title_additional: new FormControl(''), */
      /*  external_vendor_name: new FormControl('', [Validators.required]), */
      /*  free_field_content: new FormControl(''), */
      expiry_date: new FormControl(''),
      /*  url: new FormControl('', [Validators.required]), */
      who_see_course: new FormControl(''),
      for_whoom: new FormControl(''),
      learn_more_single: new FormControl('',[
        Validators.required,
        Validators.pattern(urlregex),
      ]),
      forWhomArr: new FormArray([]),
      learnMoreArr: new FormArray([]),
      for_whoom_single: new FormControl('', [Validators.required]),
      curriculum_content: this.fb.array([]),
      learner_guideline: this.fb.array([]),
      additional_comment: new FormControl(''),
      regional_cordinator:
        this.getUserrole.id === 2
          ? new FormControl('', [Validators.required])
          : new FormControl()
    });
    if (this.routergetdata == undefined) {
      this.addLearnerGuidelinetocurriculum('', '');
      this.addCurriculumContenttocurriculum('');
      this.languageValueSet_new(this.currriculumForm, 'for_whoom_single', 'forWhomArr');
      this.languageValueSet_new(this.currriculumForm, 'learn_more_single', 'learnMoreArr');
    }
    this.webbasedForm = this.fb.group({
      /*  email_preffered_instructor: new FormControl('', [Validators.required,
       Validators.pattern(emailregexp)]), */
      digital: new FormControl('', [Validators.required]),
      certification: new FormControl('', [Validators.required]),
      certification_expiry_type: new FormControl(''),
      validity_period: new FormControl(''),
      external_vendor: new FormControl('', [Validators.required]),
      external_vendor_name: new FormControl(''),
      purchase_order: new FormControl(''),
      additional_comment: new FormControl(''),
      regional_cordinator:
        this.getUserrole.id === 2
          ? new FormControl('', [Validators.required])
          : new FormControl()
    });
    this.playlistForm = this.fb.group({
      for_whoom: new FormControl('', [Validators.required,
      Validators.pattern(emailregexp)]),
      additional_comment: new FormControl(''),
      url: new FormControl('', [Validators.required, Validators.pattern(urlregex)]),
      video_link: new FormControl('', [Validators.required]),
      level: new FormControl('', [Validators.required]),
      who_see_course: new FormControl(''),
      target_audience: new FormControl(''),
      email_preffered_instructor: new FormControl(''),
      regional_cordinator:
        this.getUserrole.id === 2
          ? new FormControl('', [Validators.required])
          : new FormControl()
    });
    this.publishForm = this.fb.group({
      intranet_url: new FormControl('',[
        Validators.required,
        Validators.pattern(urlregex),
      ]),
      internet_url: new FormControl('',[
        Validators.required,
        Validators.pattern(urlregex),
      ]),
      status_comment: new FormControl(''),
    });


    if (this.routergetdata) {
      this.showStatus = this.routergetdata.status;
    }

    //this.addLearnerGuideline();
    //this.addLearnerGuidelinetocurriculum();
    //this.pushtoTitlearray();
    //console.log(this.commonCreateCourceForm.value);

    if (this.routergetdata != undefined) {
      //alert("1")

      //this.titlecontrol();
      //this.titlecontrol_description();
      this.learningType = this.routergetdata.learning_type;
      if (this.learningType == "6") {
        //alert("1");
        setTimeout(() => {
          this.bindarraydata();
        }, 3000);
        this.formatArrayData(this.totalObjnew, this.commonCreateCourceForm_playlist, 'description_single', 'descriptionArr');
        this.formatArrayData(this.totalObjnew, this.commonCreateCourceForm_playlist, 'title_single', 'titleArr');
        let setdata = JSON.parse(this.routergetdata.title);
        let newSetData = JSON.parse(this.routergetdata.description);
        console.log("descriptiondata " + newSetData)
        this.languageValueSet(this.commonCreateCourceForm_playlist, 'title_single', 'titleArr', setdata);
        this.languageValueSet(this.commonCreateCourceForm_playlist, 'description_single', 'descriptionArr', newSetData);
        this.formCtrlSub = this.commonCreateCourceForm_playlist.valueChanges
          //.debounceTime(500)
          .subscribe(($durationx: any) => {
            //alert("2")
            this.totalObjnew = {
              ...this.playlistForm.value,
              ...this.commonCreateCourceForm_playlist.value,
            };
            this.formatArrayData(this.totalObjnew, this.commonCreateCourceForm_playlist, 'title_single', 'titleArr');
            let setdata = JSON.parse(this.routergetdata.title);
            this.languageValueSet(this.commonCreateCourceForm_playlist, 'title_single', 'titleArr', setdata);

            this.formatArrayData(this.totalObjnew, this.commonCreateCourceForm_playlist, 'description_single', 'descriptionArr');
            let newsetdata = JSON.parse(this.routergetdata.description);
            this.languageValueSet(this.commonCreateCourceForm_playlist, 'description_single', 'descriptionArr', newsetdata);

          });

      }
      else {
        setTimeout(() => {
          this.bindarraydata();
        }, 3000);
        //this.commonCreateCourceForm.patchValue(this.routergetdata, { emitEvent: false });
        //this.pushtoTitlearray(this.commonCreateCourceForm);
        this.pushtoTitlearray(this.commonCreateCourceForm);
        this.commonCreateCourceForm.patchValue(this.routergetdata, { emitEvent: false });
        this.commonCreateCourceForm.controls['learning_type'].disable({ onlySelf: true });



        this.formatArrayData(this.totalObjnew, this.commonCreateCourceForm, 'title', 'titleArr');
        this.formatArrayData(this.totalObjnew, this.commonCreateCourceForm, 'description', 'descriptionArr');
        this.formatArrayData(this.totalObjnew, this.commonCreateCourceForm, 'objective', 'objectiveArr');

        let setdata = JSON.parse(this.routergetdata.title);
        this.languageValueSet(this.commonCreateCourceForm, 'title_single', 'titleArr', setdata);
        setdata = JSON.parse(this.routergetdata.description);
        this.languageValueSet(this.commonCreateCourceForm, 'description_single', 'descriptionArr', setdata);
        setdata = JSON.parse(this.routergetdata.objective);
        this.languageValueSet(this.commonCreateCourceForm, 'objective_single', 'objectiveArr', setdata);


        if (this.learningType == "1") {
          this.formatArrayData(this.totalObjnew, this.iltandViltForm, 'for_whoom', 'forWhomArr');
          this.formatArrayData(this.totalObjnew, this.iltandViltForm, 'learn_more', 'learnMoreArr');
          setdata = JSON.parse(this.routergetdata.for_whoom);
          this.languageValueSet(this.iltandViltForm, 'for_whoom_single', 'forWhomArr', setdata);
          setdata = JSON.parse(this.routergetdata.learn_more);
          this.languageValueSet(this.iltandViltForm, 'learn_more_single', 'learnMoreArr', setdata);
          this.formCtrlSub = this.commonCreateCourceForm.valueChanges
            //.debounceTime(500)
            .subscribe(($durationx: any) => {
              //alert("2")
              this.totalObjnew = {
                ...this.iltandViltForm.value,
                ...this.commonCreateCourceForm.value,
              };
              this.formatArrayData(this.totalObjnew, this.commonCreateCourceForm, 'title', 'titleArr');
              this.formatArrayData(this.totalObjnew, this.commonCreateCourceForm, 'description', 'descriptionArr');
              this.formatArrayData(this.totalObjnew, this.commonCreateCourceForm, 'objective', 'objectiveArr');
              this.formatArrayData(this.totalObjnew, this.iltandViltForm, 'for_whoom', 'forWhomArr');
              this.formatArrayData(this.totalObjnew, this.iltandViltForm, 'learn_more', 'learnMoreArr');
            });
        }
        else if (this.learningType == "4") {
          this.formatArrayData(this.totalObjnew, this.currriculumForm, 'for_whoom', 'forWhomArr');
          this.formatArrayData(this.totalObjnew, this.currriculumForm, 'learn_more', 'learnMoreArr');
          setdata = JSON.parse(this.routergetdata.for_whoom);
          this.languageValueSet(this.currriculumForm, 'for_whoom_single', 'forWhomArr', setdata);
          setdata = JSON.parse(this.routergetdata.learn_more);
          this.languageValueSet(this.currriculumForm, 'learn_more_single', 'learnMoreArr', setdata);
          this.formCtrlSub = this.commonCreateCourceForm.valueChanges
            //.debounceTime(500)
            .subscribe(($durationx: any) => {
              //alert("2")
              this.totalObjnew = {
                ...this.currriculumForm.value,
                ...this.commonCreateCourceForm.value,
              };
              this.formatArrayData(this.totalObjnew, this.commonCreateCourceForm, 'title', 'titleArr');
              this.formatArrayData(this.totalObjnew, this.commonCreateCourceForm, 'description', 'descriptionArr');
              this.formatArrayData(this.totalObjnew, this.commonCreateCourceForm, 'objective', 'objectiveArr');
              this.formatArrayData(this.totalObjnew, this.currriculumForm, 'for_whoom', 'forWhomArr');
              this.formatArrayData(this.totalObjnew, this.currriculumForm, 'learn_more', 'learnMoreArr');
            });
        }

      }

      //this.delay(3000);
      //alert("1");


      if (this.learningType == "1") {
        let learner_guide = JSON.parse(this.routergetdata.learner_guideline);
        console.log(learner_guide)
        learner_guide.forEach((element: { title: string; description: string; }) => {
          console.log(element.title)
          console.log(element.description)
          this.addLearnerGuideline(element.title, element.description);
        });
        this.iltandViltForm.patchValue(this.routergetdata);
        
      }
      else if (this.learningType == "2") {
        this.videobasedForm.patchValue(this.routergetdata);
      }
      else if (this.learningType == "3") {
        this.materialbasedForm.patchValue(this.routergetdata);
        if (this.routergetdata.url != "") {

          this.materialbasedForm
            .get('url')
            ?.setValidators(Validators.required);
          this.materialbasedForm.get('video_link')?.clearValidators();
        }
        else {

          this.materialbasedForm
            .get('video_link')
            ?.setValidators(Validators.required);
          this.materialbasedForm.get('url')?.clearValidators();
        }
      }
      else if (this.learningType == "4") {
        let learner_guide = JSON.parse(this.routergetdata.learner_guideline);
        console.log(learner_guide)
        learner_guide.forEach((element: { title: string; description: string; }) => {
          console.log(element.title)
          console.log(element.description)
          this.addLearnerGuidelinetocurriculum(element.title, element.description);
        });
        let curr_content = JSON.parse(this.routergetdata.curriculum_content);
        console.log(curr_content)
        curr_content.forEach((element: { description: string; }) => {
          console.log(element.description)
          this.addCurriculumContenttocurriculum(element.description);
        });
        this.currriculumForm.patchValue(this.routergetdata);
      }
      else if (this.learningType == "5") {
        this.webbasedForm.patchValue(this.routergetdata);
      }
      else if (this.learningType == "6") {
        this.commonCreateCourceForm_playlist.patchValue(this.routergetdata);
        this.pushtoTitlearray(this.commonCreateCourceForm_playlist);
        this.playlistForm.patchValue(this.routergetdata);
      }
      console.log(this.routergetdata);
      

      //this.commonCreateCourceForm.value.subject = this.routergetdata.subject;


      if (this.routergetdata.external_vendor == 'yes') {
        this.externalVendorname = true;
      } else {
        this.externalVendorname = false;
      }
      if (this.routergetdata.certification == 'yes') {
        this.showCertificateExpiry = true;
      }


    }
    else {

      this.pushtoTitlearray(this.commonCreateCourceForm);
      this.pushtoTitlearray(this.commonCreateCourceForm_playlist);
    }


  }

  get f() {
    return this.iltandViltForm.controls;
  }

  get commonFormtitle() {
    return this.commonCreateCourceForm.controls;
  }

  // get titlearray(){
  //   return this.commonFormtitle.titleArr as FormArray;
  // }

  get t() {
    return this.f.learner_guideline as FormArray;
  }

  get currriculum() {
    return this.currriculumForm.controls;
  }

  get curriculumArray() {
    return this.currriculum.learner_guideline as FormArray;
  }
  get curriculumContentArray() {
    return this.currriculum.curriculum_content as FormArray;
  }
  bindarraydata() {
    if (this.routergetdata.learning_type == "6") {
      let ctrl1 = this.commonCreateCourceForm_playlist.get('title_single') as FormControl;
      ctrl1.setValue(ctrl1.value);
      let ctrl2 = this.commonCreateCourceForm_playlist.get('description_single') as FormControl;
      ctrl2.setValue(ctrl2.value);
    }
    else {
      let ctrl1 = this.commonCreateCourceForm.get('title_single') as FormControl;
      let ctrl2 = this.commonCreateCourceForm.get('description_single') as FormControl;
      let ctrl3 = this.commonCreateCourceForm.get('objective_single') as FormControl;
      ctrl1.setValue(ctrl1.value);
      ctrl2.setValue(ctrl2.value);
      ctrl3.setValue(ctrl3.value);
    }

    if (this.routergetdata.learning_type == "1") {
      let ctrl1 = this.iltandViltForm.get('for_whoom_single') as FormControl;
      let ctrl2 = this.iltandViltForm.get('learn_more_single') as FormControl;
      ctrl1.setValue(ctrl1.value);
      ctrl2.setValue(ctrl2.value);
    }
    if (this.routergetdata.learning_type == "4") {
      let ctrl1 = this.currriculumForm.get('for_whoom_single') as FormControl;
      let ctrl2 = this.currriculumForm.get('learn_more_single') as FormControl;
      ctrl1.setValue(ctrl1.value);
      ctrl2.setValue(ctrl2.value);
    }
  }
  addtitlemultilanguage(formObj: FormGroup): any {
    //debugger
    this.courceService.getLanguages().subscribe(
      (res: any) => {
        console.log('language', res);
        console.log('rawvalue', formObj);
        let languages = res.data;
        let i = 0;
        let languageData: any = [];
        for (let index in languages) {
          console.log(languages[index]);
          const languageLength = formObj.controls.titleArr as FormArray;
          const descriptionFormArr = formObj.controls.descriptionArr as FormArray;
          const objectiveFormArr = formObj.controls.objectiveArr as FormArray;

          languageLength.push(
            this.fb.group({ name: [languages[index].slug], value: '' })
          );
          if (descriptionFormArr != undefined) {
            descriptionFormArr.push(
              this.fb.group({ name: [languages[index].slug], value: '' })
            );
          }
          if (objectiveFormArr != undefined) {
            objectiveFormArr.push(
              this.fb.group({ name: [languages[index].slug], value: '' })
            );
          }


          const forWhomFormArr = this.iltandViltForm.controls.forWhomArr as FormArray;
          const learnMoreFormArr = this.iltandViltForm.controls.learnMoreArr as FormArray;
          if (forWhomFormArr != undefined) {
            forWhomFormArr.push(
              this.fb.group({ name: [languages[index].slug], value: '' })
            );
          }
          if (learnMoreFormArr != undefined) {
            learnMoreFormArr.push(
              this.fb.group({ name: [languages[index].slug], value: '' })
            );
          }

          const forWhomFormArr_cur = this.currriculumForm.controls.forWhomArr as FormArray;
          const learnMoreFormArr_cur = this.currriculumForm.controls.learnMoreArr as FormArray;
          if (forWhomFormArr_cur != undefined) {
            forWhomFormArr_cur.push(
              this.fb.group({ name: [languages[index].slug], value: '' })
            );
          }
          if (learnMoreFormArr_cur != undefined) {
            learnMoreFormArr_cur.push(
              this.fb.group({ name: [languages[index].slug], value: '' })
            );
          }




          //  }
        }
        // for(let i=0;i<languageData.length;i++){

        // }
        //  this.titlearray.push(
        //   this.fb.group({languageData })
        //   )
        console.log(formObj);
        console.log('languageData', languageData);

        // this.titlearray.push(languageData)
      },
      (err: any) => {
        console.log(err);
      }
    );

    //return formObj.addControl('test',new FormControl('fdfd'))
    // return this.fb.group({
    //   title: new FormControl(''),
    //   description: new FormControl(''),
    // });
  }

  get titlecontrol() {

    return (<FormArray>this.commonCreateCourceForm.get('titleArr')).controls;
  }
  get titlecontrol_playlist() {

    return (<FormArray>this.commonCreateCourceForm_playlist.get('titleArr')).controls;
  }
  get playlist_description() {
    return (<FormArray>this.commonCreateCourceForm_playlist.get('descriptionArr')).controls;
  }
  get titlecontrol_description() {
    return (<FormArray>this.commonCreateCourceForm.get('descriptionArr')).controls;
  }

  pushtoTitlearray(formObj: FormGroup) {
    return this.addtitlemultilanguage(formObj);
  }


  gettitlelanguage() {
    console.log(this.commonCreateCourceForm.value);
  }

  addMorelearnerGuideline(titleval: string, descriptionval: string) {
    return this.fb.group({
      title: new FormControl(titleval),
      description: new FormControl(descriptionval),
    });
  }

  addMoreCurriculumContent(descriptionval: string) {
    return this.fb.group({
      description: new FormControl(descriptionval),
    });
  }

  addLearnerGuideline(titleval: string, descriptionval: string) {
    //console.log(this.t);
    return this.t.push(this.addMorelearnerGuideline(titleval, descriptionval));
  }

  addLearnerGuidelinetocurriculum(titleval: string, descriptionval: string) {
    return this.curriculumArray.push(this.addMorelearnerGuideline(titleval, descriptionval));
  }

  addCurriculumContenttocurriculum(descriptionval: string) {
    return this.curriculumContentArray.push(this.addMoreCurriculumContent(descriptionval));
  }

  removeLearnerGuideline(i: any) {
    this.t.removeAt(i);
  }

  removeLearnerGuidelinetocurriculum(i: any) {
    this.curriculumArray.removeAt(i);
  }
  removeCurriculumContenttocurriculum(i: any) {
    this.curriculumContentArray.removeAt(i);
  }
  selectLearning() {
    // this.createCourceForm.setValue({
    //   name:new FormControl('Test')
    // })
  }

  //get ILT validation erros
  getFormValidationErrors(formObj: FormGroup) {
    Object.keys(formObj.controls).forEach((key) => {
      const controlErrors: any = formObj.get(key)?.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          console.log(
            'Key control: ' + key + ', keyError: ' + keyError + ', err value: ',
            controlErrors[keyError]
          );
        });
      }
    });
  }
  createUpdateCoursePublisher(status: any) {
    if (this.selectedPublisherId) {
      if (this.learningType == "1") {
        this.createNewCource_Save(this.commonCreateCourceForm, this.iltandViltForm, status)
      }
      else if (this.learningType == "2") {
        this.createNewCource_Save(this.commonCreateCourceForm, this.videobasedForm, status)
      }
      else if (this.learningType == "3") {
        this.createNewCource_Save(this.commonCreateCourceForm, this.materialbasedForm, status)
      }
      else if (this.learningType == "4") {
        this.createNewCource_Save(this.commonCreateCourceForm, this.currriculumForm, status)
      }
      else if (this.learningType == "5") {
        this.createNewCource_Save(this.commonCreateCourceForm, this.webbasedForm, status)
      }
      else if (this.learningType == "6") {
        this.createNewCource_Save(this.commonCreateCourceForm_playlist, this.playlistForm, status)
      }
    }
  }

  createUpdateCourse(status: any) {
    if (this.learningType == "1") {
      this.createNewCource_Save(this.commonCreateCourceForm, this.iltandViltForm, status)
    }
    else if (this.learningType == "2") {
      this.createNewCource_Save(this.commonCreateCourceForm, this.videobasedForm, status)
    }
    else if (this.learningType == "3") {
      this.createNewCource_Save(this.commonCreateCourceForm, this.materialbasedForm, status)
    }
    else if (this.learningType == "4") {
      this.createNewCource_Save(this.commonCreateCourceForm, this.currriculumForm, status)
    }
    else if (this.learningType == "5") {
      this.createNewCource_Save(this.commonCreateCourceForm, this.webbasedForm, status)
    }
    else if (this.learningType == "6") {
      this.createNewCource_Save(this.commonCreateCourceForm_playlist, this.playlistForm, status)
    }
  }
  createNewCource_Save(commonformObj: FormGroup, formObj: FormGroup, status: any) {
    console.log("status video is ", status);
    console.log(this.learnerGuidearray);
    let savetype = { status: status };
    let courseid = { course_id: this.routergetdata == undefined ? null : this.routergetdata.id, resource_ext: '', material_source_ext: '' };

    let titlearray: any = [];
    let descriptionarray: any = [];
    let objectivearray: any = [];
    let for_whomarray: any = [];
    let learn_morearray: any = [];
    let titleForm: any;
    let obj: any;

    titleForm = commonformObj.value.titleArr;
    for (let i = 0; i < commonformObj.value.titleArr.length; i++) {
      if (commonformObj.value.titleArr[i].value != '') {
        titlearray.push({
          [`${commonformObj.value.titleArr[i].name}`]:
            commonformObj.value.titleArr[i].value,
        });
      } else {
        if (commonformObj.value.titleArr[i].slug == this.lang) {
          titlearray.push({
            [`${commonformObj.value.titleArr[i].name}`]:
              commonformObj.value.title_single,
          });
        }
      }
    }
    if (!titlearray.includes("english")) {
      titlearray.push({
        'english':
          commonformObj.value.title_single,
      });
    }
    commonformObj.value.title = titlearray;

    if (this.learningType != "6") {
      for (let i = 0; i < commonformObj.value.descriptionArr.length; i++) {
        if (commonformObj.value.descriptionArr[i].value != '') {
          descriptionarray.push({
            [`${commonformObj.value.descriptionArr[i].name}`]:
              commonformObj.value.descriptionArr[i].value,
          });
        } else {
          if (commonformObj.value.descriptionArr[i].slug == this.lang) {
            descriptionarray.push({
              [`${commonformObj.value.descriptionArr[i].name}`]:
                commonformObj.value.description_single,
            });
          }
        }
      }
      for (let i = 0; i < commonformObj.value.objectiveArr.length; i++) {
        if (commonformObj.value.objectiveArr[i].value != '') {
          objectivearray.push({
            [`${commonformObj.value.objectiveArr[i].name}`]:
              commonformObj.value.objectiveArr[i].value,
          });
        } else {
          if (commonformObj.value.objectiveArr[i].slug == this.lang) {
            objectivearray.push({
              [`${commonformObj.value.objectiveArr[i].name}`]:
                commonformObj.value.objective_single,
            });
          }
        }
      }
      if (!descriptionarray.includes("english")) {
        descriptionarray.push({
          'english':
            commonformObj.value.description_single,
        });
      }
      if (!objectivearray.includes("english")) {
        objectivearray.push({
          'english':
            commonformObj.value.objective_single,
        });
      }
      commonformObj.value.description = descriptionarray;
      commonformObj.value.objective = objectivearray;
    }
    else {
      for (let i = 0; i < commonformObj.value.descriptionArr.length; i++) {
        if (commonformObj.value.descriptionArr[i].value != '') {
          descriptionarray.push({
            [`${commonformObj.value.descriptionArr[i].name}`]:
              commonformObj.value.descriptionArr[i].value,
          });
        } else {
          if (commonformObj.value.descriptionArr[i].slug == this.lang) {
            descriptionarray.push({
              [`${commonformObj.value.descriptionArr[i].name}`]:
                commonformObj.value.description_single,
            });
          }
        }
      }
      if (!descriptionarray.includes("english")) {
        descriptionarray.push({
          'english':
            commonformObj.value.description_single,
        });
      }
      commonformObj.value.description = descriptionarray;
    }



    if (this.learningType == "1" || this.learningType == "4") {
      for (let i = 0; i < formObj.value.forWhomArr.length; i++) {
        if (formObj.value.forWhomArr[i].value != '') {



          for_whomarray.push({
            [`${formObj.value.forWhomArr[i].name}`]:
              formObj.value.forWhomArr[i].value,
          });

        } else {
          if (formObj.value.forWhomArr[i].slug == this.lang) {
            for_whomarray.push({
              [`${formObj.value.forWhomArr[i].name}`]:
                formObj.value.for_whoom_single,
            });
          }
        }
      }
      for (let i = 0; i < formObj.value.learnMoreArr.length; i++) {
        if (formObj.value.learnMoreArr[i].value != '') {
          learn_morearray.push({
            [`${formObj.value.learnMoreArr[i].name}`]:
              formObj.value.learnMoreArr[i].value,
          });

        } else {
          if (formObj.value.learnMoreArr[i].slug == this.lang) {
            learn_morearray.push({
              [`${formObj.value.learnMoreArr[i].name}`]:
                formObj.value.learn_more_single,
            });
          }
        }
      }
      if (!for_whomarray.includes("english")) {
        for_whomarray.push({
          'english':
            formObj.value.for_whoom_single,
        });
      }
      if (!learn_morearray.includes("english")) {
        learn_morearray.push({
          'english':
            formObj.value.learn_more_single,
        });
      }
      formObj.value.for_whoom = for_whomarray;
      formObj.value.learn_more = learn_morearray;
    }
    //let otherdata = {
    //  title: titlearray,
    //  description: descriptionarray,
    //  objective: objectivearray,
    //  for_whoom: for_whomarray,
    //  learn_more: learn_morearray,
    //  learning_type: this.learningType
    //}
    //let totalObj = {};
    //if (this.routergetdata.id != undefined) {
    let totalObj = {
      ...formObj.value,
      ...savetype,
      ...commonformObj.value,
      ...courseid
    };
    console.log("total obj is", totalObj);
    if (this.learningType != "6") {
      this.fileToUpload.forEach(element => {
        console.log("element is", element)
        totalObj.resource_ext = element.fileName.split('.')[1]
        totalObj.resource = element.base64FileBytes
      });
    }

    if (this.learningType == "3") {
      this.fileToUpload_Material.forEach(element => {
        console.log(element)
        totalObj.material_source_ext = element.fileName.split('.')[1]
        totalObj.material_source = element.base64FileBytes
      });
    }

    this.getFormValidationErrors(formObj);
    if (formObj.valid && commonformObj.valid) {
      console.log(totalObj);
      if (totalObj.learning_type == null || totalObj.learning_type == "") {
        totalObj.learning_type = this.learningType.toString();
      }
      if (status == "draft" || status == "pending") {
        if (this.routergetdata == undefined) {
          this.courceService.createCource(totalObj).subscribe(
            (res: any) => {
              console.log(res);
              if (res) {
                this.courceService.courseDetail(res.data.id).subscribe((res: any) => {
                  console.log(res);
                  let coursedetail = res.data;
                  console.log(coursedetail)
                  let username = { showbuttons: '#false' }
                  this.router.navigateByUrl('/dashboard/cources/request-detail', {
                    state: { ...coursedetail, ...username },
                  });
                }, (err: any) => {
                  console.log(err)
                })
              }
            },
            (err: any) => {
              console.log(err);
            }
          );
        }
        else {
          console.log(totalObj)
          this.courceService.updateCourse(totalObj).subscribe(
            (res: any) => {
              console.log(res);
              if (res) {
                this.courceService.courseDetail(this.routergetdata.id).subscribe((res: any) => {
                  console.log(res);
                  let coursedetail = res.data;
                  console.log(coursedetail)
                  let username = { showbuttons: '#false' }
                  this.router.navigateByUrl('/dashboard/cources/request-detail', {
                    state: { ...coursedetail, ...username },
                  });
                }, (err: any) => {
                  console.log(err)
                })
              }
            },
            (err: any) => {
              console.log(err);
            }
          );
        }
      }
      else if (status == "transfer") {
        totalObj.status = "pending";
        if (totalObj.course_id) {
          totalObj.publisher_id = this.selectedPublisherId;
          this.courceService.updateCourse(totalObj).subscribe(
            (res: any) => {
              console.log(res);
              if (res) {
                //  debugger
                // this.router.navigate(['/dashboard/cources']);
                if (this.routergetdata) {
                  this.courseId = this.routergetdata.id;
                }
                // let transferobj = { course_id: this.courseId, transfer_id: this.selectedPublisherId };
                // this.courceService.courseTransfer(transferobj).subscribe((res: any) => {
                //   console.log(res);
                this.router.navigate(['/dashboard/cources']);
                // }, (err: any) => {
                //   console.log(err)
                // })
              }
            },
            (err: any) => {
              console.log(err);
            }
          );
        }
        else {
          totalObj.publisher_id = this.selectedPublisherId;
          this.courceService.createCource(totalObj).subscribe(
            (res: any) => {
              console.log(res);
              if (res) {
                // this.router.navigate(['/dashboard/cources']);
                if (this.routergetdata) {
                  this.courseId = this.routergetdata.id;
                }
                // let transferobj = { course_id: this.courseId, transfer_id: this.selectedPublisherId };
                // this.courceService.courseTransfer(transferobj).subscribe((res: any) => {
                //   console.log(res);
                this.router.navigate(['/dashboard/cources']);
                // }, (err: any) => {
                //   console.log(err)
                // })
              }
            },
            (err: any) => {
              console.log(err);
            }
          );
        }
      }
      else if (status == "publish") {
        console.log("publisheddd");
        //debugger;
        totalObj.intranet_url = this.publishForm.value.intranet_url;
        totalObj.internet_url = this.publishForm.value.internet_url;
        totalObj.publisher_id = this.selectedPublisherId;
        totalObj.status_comment = this.publishForm.value.status_comment;
        this.getFormValidationErrors(this.publishForm);
        if (totalObj.course_id) {
          if(this.publishForm.valid){
            console.log("form valid");
          this.courceService.updateCourse(totalObj).subscribe(
            (res: any) => {
              console.log("update course", res);
              if (res) {
                if (this.routergetdata) {
                  this.corseId = this.routergetdata.id;
                }
                // let transferobj = { course_id: this.corseId , transfer_id: this.selectedPublisherId, status: 'publish', intranet_url: this.publishForm.value.intranet_url, internet_url: this.publishForm.value.internet_url };
                // this.courceService.courceStatus(transferobj).subscribe(
                //   (res: any) => {
                //     console.log(res);
                //     if (res) {
                this.router.navigate(['/dashboard/cources']);
                //     }
                //   },
                //   (err: any) => {
                //     console.log(err);
                //   }
                // );
              }
            },
            (err: any) => {
              console.log(err);
            }
          );
          }
          else{
            this.publishForm.markAllAsTouched();
            console.log("invalid publish form")
          }
        }
        else {
          this.courceService.createCource(totalObj).subscribe(
            (res: any) => {
              console.log(res);
              if (res) {
                // this.router.navigate(['/dashboard/cources']);
                if (this.routergetdata) {
                  this.courseId = this.routergetdata.id;
                }
                // let transferobj = { course_id: this.courseId, transfer_id: this.selectedPublisherId };
                // this.courceService.courseTransfer(transferobj).subscribe((res: any) => {
                //   console.log(res);
                this.router.navigate(['/dashboard/cources']);
                // }, (err: any) => {
                //   console.log(err)
                // })
              }
            },
            (err: any) => {
              console.log(err);
            }
          );
        }
      }
    } else {
      console.log("form is invalid");
      commonformObj.markAllAsTouched();
      formObj.markAllAsTouched();
    }
  }
  reject() {
    let statusobj = { course_id: this.routergetdata.id, status: 'reject', status_comment: this.rejectcomment }
    this.courceService.changeStatus(statusobj).subscribe((res: any) => {
      console.log(res);
      this.router.navigate(['/dashboard/cources']);
    }, (err: any) => {
      console.log(err)
    })
  }
  curriculumSubmit() {
    console.log(this.currriculumForm.value);
  }

  scrollToElement($element: { scrollIntoView: (arg0: { behavior: string; block: string; inline: string; }) => void; }): void {
    console.log($element);
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  certificationType(event: any) {
    console.log(event);
    if (event.id == 'yes') {
      this.showCertificateExpiry = true;
      this.iltandViltForm
        .get('certification_expiry_type')
        ?.setValidators(Validators.required);
      this.iltandViltForm
        .get('validity_period')
        ?.setValidators(Validators.required);
    } else {
      this.showCertificateExpiry = false;
      this.iltandViltForm.get('certification_expiry_type')?.clearValidators();
      this.iltandViltForm.get('validity_period')?.clearValidators();
      this.iltandViltForm.patchValue({
        certification_expiry_type: null,
        validity_period: null
      });
    }

  }

  targetAudience(event: any) {
    if (event.id == 'yes') {
      this.regionTargetAudience = true;
      this.playlistForm.get('who_see_course')?.setValidators(Validators.required);
      this.playlistForm.get('target_audience')?.clearValidators();
      this.playlistForm.get('email_preffered_instructor')?.clearValidators();
      this.playlistForm.patchValue({
        target_audience: null,
        email_preffered_instructor: null
      });
    }
    else if (event.id == 'no') {
      this.regionTargetAudience = false;
      this.playlistForm.get('target_audience')?.setValidators(Validators.required);
      this.playlistForm.get('email_preffered_instructor')?.setValidators(Validators.required);
      this.playlistForm.get('who_see_course')?.clearValidators();
      this.playlistForm.patchValue({
        who_see_course: null,
      });
    }
  }
  targetAudiencePlaylsit(event: any) {
    console.log("event is", event.target.value)
    if (event.target.value == 2) {
      this.regionTargetAudiencePlaylist = true;
      this.playlistForm.get('email_preffered_instructor')?.setValidators(Validators.required);
    }
    if (event.target.value == 1) {
      this.regionTargetAudiencePlaylist = false;
      this.playlistForm.get('email_preffered_instructor')?.clearValidators();
      this.playlistForm.patchValue({
        email_preffered_instructor: null
      });
    }
  }
  certificationType_Curriculum(event: any) {
    console.log(event.id);
    if (event.id == 'yes') {
      this.showCertificateExpiry_Curriculum = true;
      this.currriculumForm
        .get('certification_expiry_type')
        ?.setValidators(Validators.required);
      this.currriculumForm
        .get('validity_period')
        ?.setValidators(Validators.required);
    } else {
      this.showCertificateExpiry_Curriculum = false;
      this.currriculumForm.get('certification_expiry_type')?.clearValidators();
      this.currriculumForm.get('validity_period')?.clearValidators();
      this.currriculumForm.patchValue({
        certification_expiry_type: null,
        validity_period: null
      });
    }

  }
  certificationType_Webbased(event: any) {
    console.log(event.id);
    if (event.id == 'yes') {
      this.showCertificateExpiry_Webbased = true;
      this.webbasedForm
        .get('certification_expiry_type')
        ?.setValidators(Validators.required);
      this.webbasedForm
        .get('validity_period')
        ?.setValidators(Validators.required);
    } else {
      this.showCertificateExpiry_Webbased = false;
      this.webbasedForm.get('certification_expiry_type')?.clearValidators();
      this.webbasedForm.get('validity_period')?.clearValidators();
      this.iltandViltForm.patchValue({
        certification_expiry_type: null,
        validity_period: null
      });
    }

  }
  externalVendor(event: any) {
    if (event.id == 'yes') {
      this.externalVendorname = true;
      this.showVendor = true;
      this.iltandViltForm
        .get('external_vendor_name')
        ?.setValidators(Validators.required);
    } else {
      this.externalVendorname = false;
      this.showVendor = false;
      this.iltandViltForm.get('external_vendor_name')?.clearValidators();
      this.iltandViltForm.patchValue({
        external_vendor_name: null,
      });
    }

    // if (event.target.value == 'yes') {
    //   this.externalVendorname = true;
    //   this.showVendor = true;
    //   this.iltandViltForm
    //     .get('external_vendor_name')
    //     ?.setValidators(Validators.required);
    // } else {
    //   this.externalVendorname = false;
    //   this.showVendor = false;
    //   this.iltandViltForm.get('external_vendor_name')?.clearValidators();
    // }
  }
  externalVendor_Webbased(event: any) {
    if (event.id == 'yes') {
      this.externalVendorname_Webbased = true;
      this.showVendor_Webbased = true;
      this.webbasedForm
        .get('external_vendor_name')
        ?.setValidators(Validators.required);
    } else {
      this.externalVendorname_Webbased = false;
      this.showVendor_Webbased = false;
      this.webbasedForm.get('external_vendor_name')?.clearValidators();
      this.webbasedForm.patchValue({
        external_vendor_name: null
      });
    }

  }
  getmaterialsource(event: any) {
    if (event == 'Url') {
      this.materialsourceurl = true;
      this.materialsourceupload = false;
      this.materialbasedForm
        .get('url')
        ?.setValidators(Validators.required);
      this.materialbasedForm.get('video_link')?.clearValidators();
      this.materialbasedForm.patchValue({
        video_link: null
      });
    } else {
      this.materialsourceurl = false;
      this.materialsourceupload = true;
      this.materialbasedForm
        .get('video_link')
        ?.setValidators(Validators.required);
      this.materialbasedForm.get('url')?.clearValidators();
      this.materialbasedForm.patchValue({
        url: null
      });
    }
  }

  get_learningType(event: any) {
    console.log(event.target.value);
    this.learningType = event.target.value;
    let selectedLid = this.requiredFields[this.learningType];
    for (let x in this.requiredFields) {
      if (x == selectedLid) {

      } else {

      }
    }
    /* const curriculumContentTextEditor = document.getElementById('curriculumTextEditor');
    if(curriculumContentTextEditor){
      curriculumContentTextEditor.click();
    } */
  }

  getPublisherselected(event: any) {
    console.log(event.target.value);
    this.selectedPublisherId = event.target.value;
  }

  valueChange(value: any) {
    if (value != undefined) {
      this.remainingText = 500 - value.length;
    }
  }

  onCreate() {
    this.curriculumEditor = this;
    this.curriculumEditor.refreshUI();
  }
  //getallFormValidationErrors(formObj: FormGroup, name:any) {
  //	console.log("name = "+name);
  //	if(formObj){
  //		Object.keys(formObj.controls).forEach(key => {
  //			if(key){
  //	  const controlErrors: ValidationErrors = formObj.get(key).errors;
  //	  if (controlErrors != null) {
  //			Object.keys(controlErrors).forEach(keyError => {
  //			  console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
  //			});
  //		  }
  //			}
  //		});
  //}
  // }
  //validateforms(){
  //	console.log("working");
  //	this.getallFormValidationErrors(this.commonCreateCourceForm, 'commonCreateCourceForm');
  //	this.getallFormValidationErrors(this.iltandViltForm, 'iltandViltForm');
  //	this.getallFormValidationErrors(this.materialbasedForm, 'materialbasedForm');
  //	this.getallFormValidationErrors(this.currriculumForm, 'currriculumForm');

  //}
  formatdurationText($durationEvent: any) {
    alert("format");
    var $duration = $durationEvent.target.value;


    console.log($duration);
    console.log("uuuu");
    if (!$duration.includes(":")) {
      if ($duration.length == 2) {
        $duration = "00:" + $duration;
      } else if ($duration.length == 3) {
        $duration = "0" + $duration.substring(0, 1) + ":" + $duration.substring(1, 3);
      } else if ($duration.length == 4) {
        $duration = $duration.substring(0, 2) + ":" + $duration.substring(2, 4);
      } else if ($duration.length > 4) {
        $duration = $duration.substring(0, 2) + ":" + $duration.substring(2, 4);
      } else {

      }
      var durationObj = { duration: $duration };
      this.commonCreateCourceForm.patchValue(durationObj);
    } else {
      console.log("aa");
    }

  }
  debounce(callback: any, delay: any) {
    alert("debounce");
    var timeout: any;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(callback, delay);
    }
  }
  numbersOnly(val: any) {
    console.log(val.key);
    let ctrl = this.commonCreateCourceForm.get('duration') as FormControl;
    let y = ctrl.value
    y = y.replace(/\D/g, '');
    console.log(y)
    if (y.length == 3 && val.key > 6) {
      y = y.substring(0, 2);
    }
    if (y.length == 4) {
      if (y.substring(2, 4) > 60) {
        y = y.substring(0, 2) + y.substring(2, 3);
        var durationObj4 = { duration: y };
        this.commonCreateCourceForm.patchValue(durationObj4);
        return;
      }
      let valduration = y.substring(0, 2) + ":" + y.substring(2, 4)

      var durationObj = { duration: valduration };
      this.commonCreateCourceForm.patchValue(durationObj);
    }
    else {
      var durationObj1 = { duration: y };
      this.commonCreateCourceForm.patchValue(durationObj1);
    }
    if (y > 2400) {
      var durationObj2 = { duration: '' };
      this.commonCreateCourceForm.patchValue(durationObj2);
    }
  }
  languageValueSet(formObj: FormGroup, fieldName: string, fieldArr: string, setdata: any) {
    console.log(formObj.get(fieldName))
    let ctrl = formObj.get(fieldName) as FormControl;
    this.formCtrlSub = ctrl.valueChanges
      .debounceTime(500)
      .subscribe(($data: any) => {

        var fdata = formObj.value;
        if (fdata[fieldName] != '') {
          console.log(fdata[fieldArr])
          for (let x in fdata[fieldArr]) {

            for (let y in setdata) {
              console.log(Object.keys(setdata[y])[0])
              if (fdata[fieldArr][x]['name'] == Object.keys(setdata[y])[0]) {
                fdata[fieldArr][x]['value'] = Object.values(setdata[y])[0];
              }
            }
          }
          this.fieldArrObj[fieldArr] = fdata[fieldArr];
          console.log(this.fieldArrObj);
          formObj.patchValue(this.fieldArrObj);
        }
      });
  }
  languageValueSet_new(formObj: FormGroup, fieldName: string, fieldArr: any) {
    let ctrl = formObj.get(fieldName) as FormControl;
    this.formCtrlSub = ctrl.valueChanges
      .debounceTime(500)
      .subscribe(($data: any) => {
        var fdata = formObj.value;
        if (fdata[fieldName] != '') {
          for (let x in fdata[fieldArr]) {
            if (fdata[fieldArr][x]['name'] == this.lang) {
              fdata[fieldArr][x]['value'] = fdata[fieldName];
            }
          }
          this.fieldArrObj[fieldArr] = fdata[fieldArr];
          console.log(this.fieldArrObj);
          formObj.patchValue(this.fieldArrObj);
        }
      });
  }
  //  languageValueSet(formObj: FormGroup, fieldName: string, fieldArr: string) {
  //    console.log(formObj.value);
  ////this.formCtrlSub = formObj.get(fieldName).valueChanges
  //      //.debounceTime(500)
  //  //.subscribe((data: any) => {
  //    //alert("language");
  //        let fdata = formObj.value;
  //    console.log(fdata[fieldName]);


  //	  if(fdata[fieldName] != ''){
  //      for (let x in fdata[fieldArr]) {
  //        console.log(fdata[fieldArr][x]['name'] + ":" + this.lang)
  //			if(fdata[fieldArr][x]['name'] == this.lang){
  //					fdata[fieldArr][x]['value'] = fdata[fieldName];
  //			}
  //		}
  //		let fieldArrObj = {};
  //		//fieldArrObj[fieldArr] = fdata[fieldArr];
  //		formObj.patchValue(fieldArrObj);
  //	  }
  //	  //});
  //}

  formatArrayData(cFormObj: any, formObj: FormGroup, fieldName: string, fieldArr: string) {
    let fdata = formObj.value;
    let langArr = [];
    for (let i = 0; i < fdata[fieldArr].length; i++) {
      if (fdata[fieldArr][i].value != '') {
        langArr.push({
          [`${fdata[fieldArr][i].name}`]:
            fdata[fieldArr][i].value,
        });
      }
    }
    cFormObj[fieldName] = langArr;
  }

  fileChangeEvent(fileInput: any, fieldName: any) {
    this.imageError = '';
    if (fileInput.target.files && fileInput.target.files[0]) {
      // Size Filter Bytes
      const max_size = 20971520;
      const allowed_types = ['application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpg',
        'image/jpeg',
        'application/pdf', 'image/png', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        let fdata = this.commonCreateCourceForm.value;
        fdata[fieldName] = e.target.result;
        let pdata = {};
        //pdata[fieldName] = "fgfgffhg";
        console.log(pdata);
        //this.cardImageBase64 = fileInput.target.files[0];
        let ctrl = this.commonCreateCourceForm.get('resource') as FormControl;
        ctrl.setValue(fileInput.target.files[0]);
        //this.commonCreateCourceForm.patchValue(pdata)
      };

      reader.readAsDataURL(fileInput.target.files[0]);
    }
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
  setrejectbutton(id: any) {
    this.courceService.courseHistory(id).subscribe((res: any) => {
      console.log(res);
      if (res && res.status == 1) {
        let history = res.data;
        this.showrejectbutton = history[history.length - 1].action_by;
        console.log(" this.showrejectbutton" + this.showrejectbutton);
        console.log("history", res.data);
        console.log("getprofileDetails.data.id", this.getprofileDetails.data.id);
      }
    })
  }
}

