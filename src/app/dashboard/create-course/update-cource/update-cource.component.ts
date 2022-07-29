import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-update-cource',
  templateUrl: './update-cource.component.html',
  styleUrls: ['./update-cource.component.scss'],
})
export class UpdateCourceComponent implements OnInit {
  
  routergetdata: any;
  public createCourceForm!: FormGroup;
  public commonCreateCourceForm!: FormGroup;
  public iltandViltForm!: FormGroup;
  public videobasedForm!: FormGroup;
  public materialbasedForm!: FormGroup;
  public currriculumForm!: FormGroup;
  public webbasedForm!: FormGroup;
  public playlistForm!: FormGroup;
  public showCertificateExpiry: boolean = false;
  public showCertificateExpiry_Curriculum: boolean = false;
  public showCertificateExpiry_Webbased: boolean = false;
  public externalVendorname: boolean = false;
  public externalVendorname_Webbased: boolean = false;
  public materialsourceurl: boolean = false;
  public materialsourceupload: boolean = false;  
  showVendor: boolean = false;
  showVendor_Webbased: boolean = false;
  public learnerGuidearray: any = [];
  public learningType: any = '';
  public selectedLanguages:any = [];
  public cctLevel: any;
  coursesList: any;
  courseLength: any;
  notifications: boolean = false;
  public subjectId: any;


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

  public cctExpiryType: any;

  public validityPeriod: any;

  public vendorType: any;
  public cctSubjects: any;
  public entityList: any;

  public deliveryMethod: any;
  public whocanSee: any;
  public preferedInstructor: any;

  public availableLanguages: any;
  public learningTypes: any;

  getUserrole: any; //to get user role
  public cordinatorsList: any = [];
  draftRequests: any = [];
  pendingRequests: any = [];
  rejectedRequests: any = [];
  closedRequests: any = [];
  publisherList:any=[];
  stringArray: any = [];
  selectedPublisherId:any;
  profileDetails: any;
  showtitle: any;
  showobjective: any;
  showdescription: any;

  showCurriculumEmail: any;
  showCurriculumLink: any;
  showCurriculumFreeText: any;
  showCurriculumContent: any;
  showCurriculumForWhom: any;
  showCurriculumLearnMore: any;
  showCurriculumWhoSee: any;
  showCurriculumRegional: any;

  showMaterialURLchecked: boolean = false;
  showMaterialUploadchecked: boolean = false;

  showILTWhoSee: any;
  showILTEmail: any;
  showILTForWhom: any;
  showILTLearnMore: any;
  showILTtitleAdditional: any;
  showILTEntity: any;
  showILTVendorName: any;
  showILTRegional: any;

  public showPlaylistTargetAudience: any;
  showPlaylistEmail: any;
  rejectcomment: any;
  constructor(
    private fb: FormBuilder,
    private courceService: CourcesService,
    private router: Router,
    private authService: AuthenticationService
  ) {

    this.routergetdata = this.router.getCurrentNavigation()?.extras.state;
    if (!this.routergetdata) {
      this.router.navigateByUrl('/dashboard/cources');
    }
    this.selectedLanguages = JSON.parse(this.routergetdata['available_language']);
    this.subjectId = Number(this.routergetdata['subject']);
    console.log(this.routergetdata)
    this.showtitle = this.courceService.getTText(this.routergetdata.title);
    this.showobjective = this.courceService.getTText(this.routergetdata.objective);
    this.showdescription = this.courceService.getTText(this.routergetdata.description)
    if (this.routergetdata.learning_type == "1") {
      this.showILTWhoSee = this.routergetdata.who_see_course
      this.showILTEmail = this.routergetdata.email_preffered_instructor
      this.showILTLearnMore = this.courceService.getTText(this.routergetdata.learn_more);
      this.showILTForWhom = this.courceService.getTText(this.routergetdata.for_whoom);
      this.showILTtitleAdditional = this.routergetdata.title_additional
      this.showILTEntity = Number(this.routergetdata.entity_business_area)
      //this.showILTExiryType = Number(this.routergetdata.entity_business_area)
      this.showILTRegional = Number(this.routergetdata.regional_cordinator)
      this.showILTVendorName = this.routergetdata.external_vendor_name
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
      this.showCurriculumLearnMore = this.routergetdata.learn_more.toString().replace('"', '').replace('"', '')
      this.showCurriculumForWhom = this.routergetdata.for_whoom.toString().replace('"', '').replace('"', '')
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
      this.showPlaylistEmail = this.routergetdata.for_whoom.toString().replace('"', '').replace('"', '') 
    }
  }

  getRole() {
    this.getUserrole = this.authService.getRolefromlocal();
    //this.getUserrole = JSON.parse(this.authService.getRolefromlocal());
  }

  getCordinators() {
    this.courceService.getregionalCordinator().subscribe(
      (res: any) => {
        
        this.cordinatorsList = res.data;
      },
      (err: any) => {
        
      }
    );
  }

  getvendorType() {
    this.courceService.getVendortype().subscribe(
      (res: any) => {
        this.vendorType = res.data;
        console.log(this.vendorType);
      },
      (err: any) => {
        
      }
    );
  }

  getLevel() {
    this.courceService.getcctLevel().subscribe(
      (res: any) => {
        this.cctLevel = res.data;
        console.log(this.cctLevel);
      },
      (err: any) => {
        
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
        
      }
    );
  }

  getEntitylist() {
    this.courceService.getEntitylist().subscribe(
      (res: any) => {
        
        this.entityList = res.data;
      },
      (err: any) => {
        
      }
    );
  }

  getDeliveryMethod() {
    this.courceService.getDeliveryMethod().subscribe(
      (res: any) => {
        
        this.deliveryMethod = res.data;
      },
      (err: any) => {
        
      }
    );
  }

  getWhocansee() {
    this.courceService.whoSeeCourse().subscribe(
      (res: any) => {
        
        this.whocanSee = res.data;
      },
      (err: any) => {
        
      }
    );
  }

  //prefered instructor
  getPreferedInstructor() {
    this.courceService.getpreferedInstructor().subscribe(
      (res: any) => {
        
        this.preferedInstructor = res.data;
      },
      (err: any) => {
        
      }
    );
  }

  //get Languages
  getLanguages() {
    this.courceService.getLanguages().subscribe(
      (res: any) => {
        
        this.availableLanguages = res.data;
      },
      (err: any) => {
        
      }
    );
  }

  //getLearning type
  getLearningType() {
    this.courceService.getLearningType().subscribe(
      (res: any) => {
        
        this.learningTypes = res.data;
      },
      (err: any) => {
        
      }
    );
  }

  //get Expirytype
  getExpiryType() {
    this.courceService.getExpiryType().subscribe(
      (res: any) => {
        
        this.cctExpiryType = res.data;
      },
      (err: any) => {
        
      }
    );
  }

  getPublisher(){
    this.authService.getUserRoles().subscribe((res:any)=>{
      
      this.publisherList = res.data['4'];
      console.log(this.publisherList)
    },(err:any)=>{
      console.log(err)
    })
  }

  getprofileDetails(){
  this.profileDetails = this.authService.getProfileDetailsfromlocal();
  }

  getTotalCourse() {
    this.courceService.getCources().subscribe(
      (res: any) => {
        this.coursesList = res.data;
        this.courseLength = this.coursesList.length;
        this.coursesList.map((course: any) => {
          if (course.status === 'pending') {
            this.pendingRequests.push(course);
          }
          if (course.status === 'reject') {
            this.rejectedRequests.push(course);
          }
          if (course.status === 'draft') {
            this.draftRequests.push(course);
          }
          if (course.status === 'close') {
            this.closedRequests.push(course);
          }
        });
        
      },
      (err: any) => {
        
      }
    );
  }

  getpublisher(){
    this.getPublisher();
  }

  ngOnInit(): void {
    
    const emailregexp = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
    this.getCordinators();
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
    this.getprofileDetails();
    console.log(this.profileDetails)
    console.log(this.routergetdata);
    this.getRole();
    this.learningType = this.routergetdata.learning_type;
    //common form
    this.commonCreateCourceForm = this.fb.group({
      titleArr: new FormArray([]),
      descriptionArr: new FormArray([]),
      objectiveArr: new FormArray([]),
      //title: new FormArray([]),
      title: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
      learning_type: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      resource: new FormControl(''),
      objective: new FormControl('', [Validators.required]),
      level: new FormControl([Validators.required]),
      subject: new FormControl([Validators.required]),
      // additional_comment: new FormControl(''),
      prerequisite: new FormControl(''),
      keyword: new FormControl('', [Validators.required]),
      email_content_owner: new FormControl('', [
        Validators.required,
        Validators.pattern(emailregexp),
      ]),
      training_provided_by: new FormControl([Validators.required]),
      available_language: new FormControl([Validators.required]),

      //no field
      email_training_contact: new FormControl('', [
        Validators.required,
        Validators.pattern(emailregexp),
      ]),
    });

    //ilt and vilt
    this.iltandViltForm = this.fb.group({
      manager_approval: new FormControl('',[Validators.required]),
      digital: new FormControl('',[Validators.required]),
      certification: new FormControl('',[Validators.required]),
      certification_expiry_type: new FormControl('', [Validators.required]),
      validity_period: new FormControl('', [Validators.required]),
      external_vendor_name: new FormControl('', [Validators.required]),
      purchase_order: new FormControl(),
      // email_training_contact: new FormControl('', [Validators.required]),
      delivery_method: new FormControl('',[Validators.required]),
      for_whoom: new FormControl('', [Validators.required]),
	  	  forWhomArr: new FormArray([]),
	  learnMoreArr: new FormArray([]),
      cost_of_training: new FormControl(''),
      // cost_of_training: new FormControl('', [Validators.required]),
      learn_more: new FormControl(''),
      free_field_content: new FormControl(''),
      url: new FormControl(''),
      //s need to add
      //provide_video_link: new FormControl(''),
      video_link: new FormControl(''),
      //e need to add
      first_session_date: new FormControl('', [Validators.required]),
      expiry_date: new FormControl('', [Validators.required]),
      expiry_date_type: new FormControl('', [Validators.required]),
      title_additional: new FormControl(''),
      external_vendor: new FormControl('',[Validators.required]),

      entity_business_area: new FormControl('',[Validators.required]),
      email_preffered_instructor: new FormControl('',[Validators.required]),

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

    //video based
    this.videobasedForm = this.fb.group({
      video_link: new FormControl(''),
      additional_comment: new FormControl(''),
      email_preffered_instructor: new FormControl('', [Validators.required,
        Validators.pattern(emailregexp)]),
      regional_cordinator:
        this.getUserrole.id === 2
          ? new FormControl('', [Validators.required])
          : new FormControl()
    });

    this.materialbasedForm = this.fb.group({
      //material based
      video_link: new FormControl('', [Validators.required]),
      additional_comment: new FormControl(''),
      url: new FormControl('', [Validators.required]),
      regional_cordinator:
        this.getUserrole.id === 2
          ? new FormControl('', [Validators.required])
          : new FormControl()
      //material
    });

    //curriculum
    this.currriculumForm = this.fb.group({
      email_preffered_instructor: new FormControl('', [Validators.required,
        Validators.pattern(emailregexp)]),
      digital: new FormControl('', [Validators.required]),
      additional_comment: new FormControl(''),
      certification: new FormControl('', [Validators.required]),
      certification_expiry_type: new FormControl('', [Validators.required]),
      validity_period: new FormControl('', [Validators.required]),
      learn_more: new FormControl(''),
      video_link: new FormControl(''),
      title_additional: new FormControl(''),
      external_vendor_name: new FormControl(''),
      free_field_content: new FormControl(''),
      expiry_date: new FormControl(''),
      who_see_course: new FormControl(''),
      url: new FormControl('', [Validators.required]),
      for_whoom: new FormControl('', [Validators.required]),
      learner_guideline: this.fb.array([]),
      regional_cordinator:
        this.getUserrole.id === 2
          ? new FormControl('', [Validators.required])
          : new FormControl()
    });
    this.webbasedForm = this.fb.group({
      email_preffered_instructor: new FormControl('', [Validators.required,
        Validators.pattern(emailregexp)]),
      additional_comment: new FormControl(''),
      digital: new FormControl('', [Validators.required]),
      certification: new FormControl('', [Validators.required]),
      certification_expiry_type: new FormControl('', [Validators.required]),
      validity_period: new FormControl('', [Validators.required]),
      external_vendor: new FormControl('', [Validators.required]),
      external_vendor_name: new FormControl('', [Validators.required]),
      purchase_order: new FormControl(''),
      regional_cordinator:
        this.getUserrole.id === 2
          ? new FormControl('', [Validators.required])
          : new FormControl()
    });
    this.playlistForm = this.fb.group({
      for_whoom: new FormControl('', [Validators.required,
        Validators.pattern(emailregexp)]),
      additional_comment: new FormControl(''),
      url: new FormControl('', [Validators.required]),
      video_link: new FormControl('', [Validators.required]),
      level: new FormControl('', [Validators.required]),
      who_see_course: new FormControl('', [Validators.required]),
      free_field_content: new FormControl('', [Validators.required]),
      email_preffered_instructor: new FormControl('', [Validators.required]),
      regional_cordinator: new FormControl('', [Validators.required])
        //this.getUserrole.id === 2
        //  ? new FormControl('', [Validators.required])
        //  : new FormControl('')
    });

    this.commonCreateCourceForm.patchValue(this.routergetdata);
    console.log('patch', this.routergetdata)
    this.pushtoTitlearray();
    this.commonCreateCourceForm.controls['learning_type'].disable({ onlySelf: true });
    
    if (this.learningType == "1") {
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
      this.currriculumForm.patchValue(this.routergetdata);
    }
    else if (this.learningType == "5") {
      this.webbasedForm.patchValue(this.routergetdata);
    }
    else if (this.learningType == "6") {
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
    //this.commonCreateCourceForm.patchValue({
    //  //subject: Number(this.routergetdata.subject),
    //});
    

    //this.subjectId = this.routergetdata.subject;
    //console.log(this.routergetdata.subject);

    this.addLearnerGuideline();
   
  }

  get f() {
    return this.iltandViltForm.controls;
  }

  get t() {
    return this.f.learner_guideline as FormArray;
  }
  get currriculum() {
    return this.currriculumForm.controls;
  }

  get curriculumArray() {
    return this.currriculum.learner_guideline as FormArray;
  }
  addMorelearnerGuideline() {
    return this.fb.group({
      title: new FormControl(''),
      description: new FormControl(''),
    });
  }

  addLearnerGuideline() {
    console.log(this.t);
    return this.t.push(this.addMorelearnerGuideline());
  }
  addLearnerGuidelinetocurriculum() {
    return this.curriculumArray.push(this.addMorelearnerGuideline());
  }
  removeLearnerGuideline(i: any) {
    this.t.removeAt(i);
    // this.learnerGuidearray.splice(i,1)
  }
  removeLearnerGuidelinetocurriculum(i: any) {
    this.curriculumArray.removeAt(i);
  }
  selectLearning() {
    // this.createCourceForm.setValue({
    //   name:new FormControl('Test')
    // })
  }

  getFormValidationErrors() {
    Object.keys(this.commonCreateCourceForm.controls).forEach((key) => {
      const controlErrors: any = this.commonCreateCourceForm.get(key)?.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          console.log(
            'Key control: ' + key + ', keyError: ' + keyError + ', err value: ',
            controlErrors[keyError]
          );
        });
      }
    });
	
	    Object.keys(this.iltandViltForm.controls).forEach((key) => {
      const controlErrors: any = this.iltandViltForm.get(key)?.errors;
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
  getFormValidationErrors_ILT() {
    Object.keys(this.iltandViltForm.controls).forEach((key) => {
      const controlErrors: any = this.iltandViltForm.get(key)?.errors;
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
  //create ilt vilt form
  createNewCourceIlt(status: any) {
  this.getFormValidationErrors();
    console.log(this.stringArray);
    console.log(this.learnerGuidearray);
    let courseid = { course_id: this.routergetdata.id };
    let savetype = { status: status };

    let titlearray: any = [];
    let descriptionarray: any = [];
    let objectivearray: any = [];
    let for_whomarray: any = [];
    let learn_morearray: any = [];
    let titleForm: any;
    let obj: any;
    titleForm = this.commonCreateCourceForm.value.titleArr;
    for (let i = 0; i < this.commonCreateCourceForm.value.titleArr.length; i++) {
      if (this.commonCreateCourceForm.value.titleArr[i].value != '') {
        titlearray.push({
          [`${this.commonCreateCourceForm.value.titleArr[i].name}`]:
            this.commonCreateCourceForm.value.titleArr[i].value,
        });
      }
    }
	    for (let i = 0; i < this.commonCreateCourceForm.value.descriptionArr.length; i++) {
      if (this.commonCreateCourceForm.value.descriptionArr[i].value != '') {
        descriptionarray.push({
          [`${this.commonCreateCourceForm.value.descriptionArr[i].name}`]:
            this.commonCreateCourceForm.value.descriptionArr[i].value,
        });
      }
    }
	    for (let i = 0; i < this.commonCreateCourceForm.value.objectiveArr.length; i++) {
      if (this.commonCreateCourceForm.value.objectiveArr[i].value != '') {
        objectivearray.push({
          [`${this.commonCreateCourceForm.value.objectiveArr[i].name}`]:
            this.commonCreateCourceForm.value.objectiveArr[i].value,
        });
      }
    }
	    for (let i = 0; i < this.iltandViltForm.value.forWhomArr.length; i++) {
      if (this.iltandViltForm.value.forWhomArr[i].value != '') {
        for_whomarray.push({
          [`${this.iltandViltForm.value.forWhomArr[i].name}`]:
            this.iltandViltForm.value.forWhomArr[i].value,
        });
      }
    }
		    for (let i = 0; i < this.iltandViltForm.value.learnMoreArr.length; i++) {
      if (this.iltandViltForm.value.learnMoreArr[i].value != '') {
        learn_morearray.push({
          [`${this.iltandViltForm.value.learnMoreArr[i].name}`]:
            this.iltandViltForm.value.learnMoreArr[i].value,
        });
      }
    }
    console.log('titleForm', titlearray);
    
    this.commonCreateCourceForm.value.title = titlearray;
    this.commonCreateCourceForm.value.description	= descriptionarray;
    this.commonCreateCourceForm.value.objective = objectivearray;
    this.iltandViltForm.value.for_whoom	= for_whomarray;
    this.iltandViltForm.value.learn_more	= learn_morearray;
    console.log('titleForm', titlearray);
    if (titlearray.length == 0) {
      titlearray.push({ "english": this.commonCreateCourceForm.value.title });
    }
    console.log(this.commonCreateCourceForm.value);
    let totalObj = {
      ...this.iltandViltForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
      ...courseid
    };
	console.log(totalObj);
    this.getFormValidationErrors_ILT();
		          console.log("this.iltandViltForm.valid = "+this.iltandViltForm.valid);
	          console.log("this.commonCreateCourceForm.valid = "+this.commonCreateCourceForm.valid);

    if (this.iltandViltForm.valid && this.commonCreateCourceForm.valid) {
	          console.log("valid");

      if (totalObj.learning_type == null || totalObj.learning_type == "") {
        totalObj.learning_type = this.learningType.toString();
      }
      this.courceService.updateCourse(totalObj).subscribe(
        (res: any) => {
          
          if (res) {
            let statedata = this.routergetdata;
            let saveobj = { issave: true, ...courseid };
            let stateobj = { ...statedata, ...saveobj };
            // this.router.navigate(['/dashboard/cources']);
            this.router.navigateByUrl('/dashboard/cources/request-detail', {
              state: stateobj,
            });
          }
        },
        (err: any) => {
          
        }
      );
      console.log(totalObj);
    } else {
	console.log("invalid");
      this.commonCreateCourceForm.markAllAsTouched();
      this.iltandViltForm.markAllAsTouched();      
    }
    //if (status == "draft") {
    //  this.saveasDraftIlt();
    //}
    //else {
    //  if (totalObj.learning_type == null || totalObj.learning_type == "") {
    //    totalObj.learning_type = this.learningType.toString();
    //  }
      
    //  this.courceService.updateCourse(totalObj).subscribe(
    //    (res: any) => {
    //      
    //      if (res) {
    //        this.router.navigate(['/dashboard/cources']);
    //      }
    //    },
    //    (err: any) => {
    //      
    //    }
    //  );
    //}
  }
  //get Video validation erros
  getFormValidationErrors_Video() {
    Object.keys(this.videobasedForm.controls).forEach((key) => {
      const controlErrors: any = this.videobasedForm.get(key)?.errors;
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
  //create Video vilt form
  createNewCourceVideo(status: any) {
    console.log(this.stringArray);
    console.log(this.learnerGuidearray);
    let courseid = { course_id: this.routergetdata.id };
    let savetype = { status: status };
    let totalObj = {
      ...this.videobasedForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
      ...courseid
    };
    let titlearray: any = [];
    let titleForm: any;
    let obj: any;
    titleForm = this.commonCreateCourceForm.value.titleArr;
    for (let i = 0; i < this.commonCreateCourceForm.value.titleArr.length; i++) {
      if (this.commonCreateCourceForm.value.titleArr[i].value != '') {
        titlearray.push({
          [`${this.commonCreateCourceForm.value.titleArr[i].name}`]:
            this.commonCreateCourceForm.value.titleArr[i].value,
        });
      }
    }
    console.log('titleForm', titlearray);
    if (titlearray.length == 0) {
      titlearray.push({ "english": this.commonCreateCourceForm.value.title });
    }
    this.commonCreateCourceForm.value.title = titlearray;
    console.log(this.commonCreateCourceForm.value);

    this.getFormValidationErrors_Video();
    if (this.videobasedForm.valid && this.commonCreateCourceForm.valid) {
      console.log(totalObj);
      if (totalObj.learning_type == null || totalObj.learning_type == "") {
        totalObj.learning_type = this.learningType.toString();
      }
      this.courceService.updateCourse(totalObj).subscribe(
        (res: any) => {
          
          if (res) {
            let statedata = this.routergetdata;
            let saveobj = { issave: true, ...courseid };
            let stateobj = { ...statedata, ...saveobj };
            console.log(stateobj);
            // this.router.navigate(['/dashboard/cources']);
            this.router.navigateByUrl('/dashboard/cources/request-detail', {
              state: stateobj,
            });
          }
        },
        (err: any) => {
          
        }
      );
    } else {
      this.commonCreateCourceForm.markAllAsTouched();
      this.videobasedForm.markAllAsTouched();
      console.log(this.learnerGuidearray);
      console.log(totalObj);
    }
  }

  //get Material validation erros
  getFormValidationErrors_Material() {
    Object.keys(this.materialbasedForm.controls).forEach((key) => {
      const controlErrors: any = this.materialbasedForm.get(key)?.errors;
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
  //create Material form
  createNewCourceMaterial(status: any) {
    console.log(this.stringArray);
    console.log(this.learnerGuidearray);
    let courseid = { course_id: this.routergetdata.id };
    let savetype = { status: status };
    let totalObj = {
      ...this.materialbasedForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
      ...courseid
    };
    let titlearray: any = [];
    let titleForm: any;
    let obj: any;
    titleForm = this.commonCreateCourceForm.value.titleArr;
    for (let i = 0; i < this.commonCreateCourceForm.value.titleArr.length; i++) {
      if (this.commonCreateCourceForm.value.titleArr[i].value != '') {
        titlearray.push({
          [`${this.commonCreateCourceForm.value.titleArr[i].name}`]:
            this.commonCreateCourceForm.value.titleArr[i].value,
        });
      }
    }
    console.log('titleForm', titlearray);
    if (titlearray.length == 0) {
      titlearray.push({ "english": this.commonCreateCourceForm.value.title });
    }
    this.commonCreateCourceForm.value.title = titlearray;
    console.log(this.commonCreateCourceForm.value);

    this.getFormValidationErrors_Material();
    if (this.materialbasedForm.valid && this.commonCreateCourceForm.valid) {
      console.log(totalObj);
      if (totalObj.learning_type == null || totalObj.learning_type == "") {
        totalObj.learning_type = this.learningType.toString();
      }
      this.courceService.updateCourse(totalObj).subscribe(
        (res: any) => {
          
          if (res) {
            let statedata = this.routergetdata;
            let saveobj = { issave: true, ...courseid };
            let stateobj = { ...statedata, ...saveobj };
            console.log(stateobj);
            // this.router.navigate(['/dashboard/cources']);
            this.router.navigateByUrl('/dashboard/cources/request-detail', {
              state: stateobj,
            });
          }
        },
        (err: any) => {
          
        }
      );
    } else {
      this.commonCreateCourceForm.markAllAsTouched();
      this.materialbasedForm.markAllAsTouched();
      console.log(this.learnerGuidearray);
      console.log(totalObj);
    }
  }

  //get Currriculum validation erros
  getFormValidationErrors_Currriculum() {
    Object.keys(this.currriculumForm.controls).forEach((key) => {
      const controlErrors: any = this.currriculumForm.get(key)?.errors;
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
  //create Currriculum form
  createNewCourceCurrriculum(status: any) {
    console.log(this.stringArray);
    console.log(this.learnerGuidearray);
    let courseid = { course_id: this.routergetdata.id };
    let savetype = { status: status };
    let totalObj = {
      ...this.currriculumForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
      ...courseid
    };
    let titlearray: any = [];
    let titleForm: any;
    let obj: any;
    titleForm = this.commonCreateCourceForm.value.titleArr;
    for (let i = 0; i < this.commonCreateCourceForm.value.titleArr.length; i++) {
      if (this.commonCreateCourceForm.value.titleArr[i].value != '') {
        titlearray.push({
          [`${this.commonCreateCourceForm.value.titleArr[i].name}`]:
            this.commonCreateCourceForm.value.titleArr[i].value,
        });
      }
    }
    console.log('titleForm', titlearray);
    if (titlearray.length == 0) {
      titlearray.push({ "english": this.commonCreateCourceForm.value.title });
    }
    this.commonCreateCourceForm.value.title = titlearray;
    console.log(this.commonCreateCourceForm.value);

    this.getFormValidationErrors_Currriculum();
    if (this.currriculumForm.valid && this.commonCreateCourceForm.valid) {
      console.log(totalObj);
      if (totalObj.learning_type == null || totalObj.learning_type == "") {
        totalObj.learning_type = this.learningType.toString();
      }
      this.courceService.updateCourse(totalObj).subscribe(
        (res: any) => {
          
          if (res) {
            
            let statedata = this.routergetdata;
            let saveobj = { issave: true, ...courseid };
            let stateobj = { ...statedata, ...saveobj };
            console.log(stateobj);
            // this.router.navigate(['/dashboard/cources']);
            this.router.navigateByUrl('/dashboard/cources/request-detail', {
              state: stateobj,
            });
          }
        },
        (err: any) => {
          
        }
      );
    } else {
      this.commonCreateCourceForm.markAllAsTouched();
      this.currriculumForm.markAllAsTouched();
      console.log(this.learnerGuidearray);
      console.log(totalObj);
    }
  }

  //get Webbased validation erros
  getFormValidationErrors_Webbased() {
    Object.keys(this.webbasedForm.controls).forEach((key) => {
      const controlErrors: any = this.webbasedForm.get(key)?.errors;
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
  //create Webbased form
  createNewCourceWebbased(status: any) {
    console.log(this.stringArray);
    console.log(this.learnerGuidearray);
    let courseid = { course_id: this.routergetdata.id };
    let savetype = { status: status };
    let totalObj = {
      ...this.webbasedForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
      ...courseid
    };
    let titlearray: any = [];
    let titleForm: any;
    let obj: any;
    titleForm = this.commonCreateCourceForm.value.titleArr;
    for (let i = 0; i < this.commonCreateCourceForm.value.titleArr.length; i++) {
      if (this.commonCreateCourceForm.value.titleArr[i].value != '') {
        titlearray.push({
          [`${this.commonCreateCourceForm.value.titleArr[i].name}`]:
            this.commonCreateCourceForm.value.titleArr[i].value,
        });
      }
    }
    console.log('titleForm', titlearray);
    if (titlearray.length == 0) {
      titlearray.push({ "english": this.commonCreateCourceForm.value.title });
    }
    this.commonCreateCourceForm.value.title = titlearray;
    console.log(this.commonCreateCourceForm.value);

    this.getFormValidationErrors_Webbased();
    if (this.webbasedForm.valid && this.commonCreateCourceForm.valid) {
      console.log(totalObj);
      if (totalObj.learning_type == null || totalObj.learning_type == "") {
        totalObj.learning_type = this.learningType.toString();
      }
      this.courceService.updateCourse(totalObj).subscribe(
        (res: any) => {
          
          if (res) {
            let statedata = this.routergetdata;
            let saveobj = { issave: true, ...courseid };
            let stateobj = { ...statedata, ...saveobj };
            console.log(stateobj);
            // this.router.navigate(['/dashboard/cources']);
            this.router.navigateByUrl('/dashboard/cources/request-detail', {
              state: stateobj,
            });
          }
        },
        (err: any) => {
          
        }
      );
    } else {
      this.commonCreateCourceForm.markAllAsTouched();
      this.webbasedForm.markAllAsTouched();
      console.log(this.learnerGuidearray);
      console.log(totalObj);
    }
  }

  //get Playlist validation erros
  getFormValidationErrors_Playlist() {
    Object.keys(this.playlistForm.controls).forEach((key) => {
      const controlErrors: any = this.playlistForm.get(key)?.errors;
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
  //create Webbased form
  createNewCourcePlaylist(status: any) {
    console.log(this.stringArray);
    console.log(this.learnerGuidearray);
    let courseid = { course_id: this.routergetdata.id };
    let savetype = { status: status };
    let totalObj = {
      ...this.playlistForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
      ...courseid
    };
    let titlearray: any = [];
    let titleForm: any;
    let obj: any;
    titleForm = this.commonCreateCourceForm.value.titleArr;
    for (let i = 0; i < this.commonCreateCourceForm.value.titleArr.length; i++) {
      if (this.commonCreateCourceForm.value.titleArr[i].value != '') {
        titlearray.push({
          [`${this.commonCreateCourceForm.value.titleArr[i].name}`]:
            this.commonCreateCourceForm.value.titleArr[i].value,
        });
      }
    }
    console.log('titleForm', titlearray);
    if (titlearray.length == 0) {
      titlearray.push({ "english": this.commonCreateCourceForm.value.title });
    }
    this.commonCreateCourceForm.value.title = titlearray;
    console.log(this.commonCreateCourceForm.value);

    this.getFormValidationErrors_Playlist();
    if (this.playlistForm.valid) {
      console.log(totalObj);
      if (totalObj.learning_type == null || totalObj.learning_type == "") {
        totalObj.learning_type = this.learningType.toString();
      }
      this.courceService.updateCourse(totalObj).subscribe(
        (res: any) => {
          
          if (res) {
            let statedata = this.routergetdata;
            let saveobj = { issave: true, ...courseid };
            let stateobj = { ...statedata, ...saveobj };
            console.log(stateobj);
            // this.router.navigate(['/dashboard/cources']);
            this.router.navigateByUrl('/dashboard/cources/request-detail', {
              state: stateobj,
            });
          }
        },
        (err: any) => {
          
        }
      );
    } else {
      this.commonCreateCourceForm.markAllAsTouched();
      this.playlistForm.markAllAsTouched();
      console.log(this.learnerGuidearray);
      console.log(totalObj);
    }
  }

  //draft ilt and vilt
  saveasDraftIlt() {
    let savetype = { status: 'draft' };
    let courseid = { course_id: this.routergetdata.id };
    let totalObj = {
      ...this.iltandViltForm.value,
      ...savetype,
      ...courseid,
      ...this.commonCreateCourceForm.value,
      ...{learning_type:this.routergetdata.learning_type}
    };
    if (totalObj.learning_type == null || totalObj.learning_type == "") {
      totalObj.learning_type = this.learningType.toString();
    }    
    if (this.iltandViltForm.valid && this.commonCreateCourceForm.valid) {
      console.log(totalObj);
      this.courceService.createCource(totalObj).subscribe(
        (res: any) => {
          
          if (res) {
            this.router.navigate(['/dashboard/cources']);
          }
        },
        (err: any) => {
          
        }
      );
    } else {
      this.commonCreateCourceForm.markAllAsTouched();
      this.iltandViltForm.markAllAsTouched();
      console.log(totalObj);
    }
  }

  transfertoPublishData() {
    if (this.routergetdata.learning_type == "1") {
      this.transfertoPublishData_ILT()
    }
    else if (this.routergetdata.learning_type == "2") {
      this.transfertoPublishData_Video()
    }
    else if (this.routergetdata.learning_type == "3") {
      this.transfertoPublishData_Material()
    }
    else if (this.routergetdata.learning_type == "4") {
      this.transfertoPublishData_Curriculum()
    }
    else if (this.routergetdata.learning_type == "5") {
      this.transfertoPublishData_Webbased()
    }
    else if (this.routergetdata.learning_type == "6") {
      this.transfertoPublishData_Playlist()
    }
  }
  transfertoPublishData_ILT() {
    let courseid = { course_id: this.routergetdata.id };
    let savetype = { status: 'pending' };
    //let publisher = {trasfer_user_id:this.selectedPublisherId}
    let totalObj = {
      ...this.iltandViltForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
      ...courseid,
      ...{learning_type:this.routergetdata.learning_type},

    };
    this.getFormValidationErrors_ILT();
    if (this.iltandViltForm.valid && this.commonCreateCourceForm.valid) {
      this.courceService.updateCourse(totalObj).subscribe(
        (res: any) => {
          
          if (res) {
            debugger
           // this.router.navigate(['/dashboard/cources']);
            let transferobj ={ course_id:this.routergetdata.id ,transfer_id:this.selectedPublisherId};
            this.courceService.courseTransfer(transferobj).subscribe((res:any)=>{
              
              this.router.navigate(['/dashboard/cources']);
            },(err:any)=>{
              console.log(err)
            })
          }
        },
        (err: any) => {
          
        }
      );
      console.log(totalObj);
    } else {
      this.commonCreateCourceForm.markAllAsTouched();
      this.iltandViltForm.markAllAsTouched();
      
    }
  }
  transfertoPublishData_Video() {
    let courseid = { course_id: this.routergetdata.id };
    let savetype = { status: 'pending' };
    //let publisher = {trasfer_user_id:this.selectedPublisherId}
    let totalObj = {
      ...this.videobasedForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
      ...courseid,
      ...{ learning_type: this.routergetdata.learning_type },

    };
    this.getFormValidationErrors_Video();
    if (this.videobasedForm.valid && this.commonCreateCourceForm.valid) {
      this.courceService.updateCourse(totalObj).subscribe(
        (res: any) => {
          
          if (res) {
            debugger
            // this.router.navigate(['/dashboard/cources']);
            let transferobj = { course_id: this.routergetdata.id, transfer_id: this.selectedPublisherId };
            this.courceService.courseTransfer(transferobj).subscribe((res: any) => {
              
              this.router.navigate(['/dashboard/cources']);
            }, (err: any) => {
              console.log(err)
            })
          }
        },
        (err: any) => {
          
        }
      );
      console.log(totalObj);
    } else {
      this.commonCreateCourceForm.markAllAsTouched();
      this.videobasedForm.markAllAsTouched();

    }
  }
  transfertoPublishData_Material() {
    let courseid = { course_id: this.routergetdata.id };
    let savetype = { status: 'pending' };
    //let publisher = {trasfer_user_id:this.selectedPublisherId}
    let totalObj = {
      ...this.materialbasedForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
      ...courseid,
      ...{ learning_type: this.routergetdata.learning_type },

    };
    this.getFormValidationErrors_Material();
    if (this.materialbasedForm.valid && this.commonCreateCourceForm.valid) {
      this.courceService.updateCourse(totalObj).subscribe(
        (res: any) => {
          
          if (res) {
            debugger
            // this.router.navigate(['/dashboard/cources']);
            let transferobj = { course_id: this.routergetdata.id, transfer_id: this.selectedPublisherId };
            this.courceService.courseTransfer(transferobj).subscribe((res: any) => {
              
              this.router.navigate(['/dashboard/cources']);
            }, (err: any) => {
              console.log(err)
            })
          }
        },
        (err: any) => {
          
        }
      );
      console.log(totalObj);
    } else {
      this.commonCreateCourceForm.markAllAsTouched();
      this.materialbasedForm.markAllAsTouched();

    }
  }
  transfertoPublishData_Curriculum() {
    let courseid = { course_id: this.routergetdata.id };
    let savetype = { status: 'pending' };
    //let publisher = {trasfer_user_id:this.selectedPublisherId}
    let totalObj = {
      ...this.currriculumForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
      ...courseid,
      ...{ learning_type: this.routergetdata.learning_type },

    };
    this.getFormValidationErrors_Currriculum();
    if (this.currriculumForm.valid && this.commonCreateCourceForm.valid) {
      this.courceService.updateCourse(totalObj).subscribe(
        (res: any) => {
          
          if (res) {
            debugger
            // this.router.navigate(['/dashboard/cources']);
            let transferobj = { course_id: this.routergetdata.id, transfer_id: this.selectedPublisherId };
            this.courceService.courseTransfer(transferobj).subscribe((res: any) => {
              
              this.router.navigate(['/dashboard/cources']);
            }, (err: any) => {
              console.log(err)
            })
          }
        },
        (err: any) => {
          
        }
      );
      console.log(totalObj);
    } else {
      this.commonCreateCourceForm.markAllAsTouched();
      this.currriculumForm.markAllAsTouched();

    }
  }
  transfertoPublishData_Webbased() {
    let courseid = { course_id: this.routergetdata.id };
    let savetype = { status: 'pending' };
    //let publisher = {trasfer_user_id:this.selectedPublisherId}
    let totalObj = {
      ...this.webbasedForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
      ...courseid,
      ...{ learning_type: this.routergetdata.learning_type },

    };
    this.getFormValidationErrors_Webbased();
    if (this.webbasedForm.valid && this.commonCreateCourceForm.valid) {
      this.courceService.updateCourse(totalObj).subscribe(
        (res: any) => {
          
          if (res) {
            debugger
            // this.router.navigate(['/dashboard/cources']);
            let transferobj = { course_id: this.routergetdata.id, transfer_id: this.selectedPublisherId };
            this.courceService.courseTransfer(transferobj).subscribe((res: any) => {
              
              this.router.navigate(['/dashboard/cources']);
            }, (err: any) => {
              console.log(err)
            })
          }
        },
        (err: any) => {
          
        }
      );
      console.log(totalObj);
    } else {
      this.commonCreateCourceForm.markAllAsTouched();
      this.webbasedForm.markAllAsTouched();

    }
  }
  transfertoPublishData_Playlist() {
    let courseid = { course_id: this.routergetdata.id };
    let savetype = { status: 'pending' };
    //let publisher = {trasfer_user_id:this.selectedPublisherId}
    let totalObj = {
      ...this.playlistForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
      ...courseid,
      ...{ learning_type: this.routergetdata.learning_type },

    };
    this.getFormValidationErrors_Playlist();
    if (this.playlistForm.valid && this.commonCreateCourceForm.valid) {
      this.courceService.updateCourse(totalObj).subscribe(
        (res: any) => {
          
          if (res) {
            debugger
            // this.router.navigate(['/dashboard/cources']);
            let transferobj = { course_id: this.routergetdata.id, transfer_id: this.selectedPublisherId };
            this.courceService.courseTransfer(transferobj).subscribe((res: any) => {
              
              this.router.navigate(['/dashboard/cources']);
            }, (err: any) => {
              console.log(err)
            })
          }
        },
        (err: any) => {
          
        }
      );
      console.log(totalObj);
    } else {
      this.commonCreateCourceForm.markAllAsTouched();
      this.playlistForm.markAllAsTouched();

    }
  }
  publishCourse(status: any) {
    if (this.routergetdata.learning_type == "1") {
      this.publishCourse_ILT(status)
    }
    else if (this.routergetdata.learning_type == "2") {
      this.publishCourse_Video(status)
    }
    else if (this.routergetdata.learning_type == "3") {
      this.publishCourse_Material(status)
    }
    else if (this.routergetdata.learning_type == "4") {
      this.publishCourse_Curriculum(status)
    }
    else if (this.routergetdata.learning_type == "5") {
      this.publishCourse_Webbased(status)
    }
    else if (this.routergetdata.learning_type == "6") {
      this.publishCourse_Playlist(status)
    }
  }
  publishCourse_ILT(status: any) {
    let courseid = { course_id: this.routergetdata.id };
    let savetype = { status: 'pending' };
    //let publisher = {trasfer_user_id:this.selectedPublisherId}
    let totalObj = {
      ...this.iltandViltForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
      ...courseid,
      ...{ learning_type: this.routergetdata.learning_type },

    };
    this.getFormValidationErrors_ILT();
    if (this.iltandViltForm.valid && this.commonCreateCourceForm.valid) {
      this.courceService.updateCourse(totalObj).subscribe(
        (res: any) => {
          
          if (res) {
            debugger
            // this.router.navigate(['/dashboard/cources']);
            let transferobj = { course_id: this.routergetdata.id, transfer_id: this.selectedPublisherId, status: 'publish' };
            this.courceService.courceStatus(transferobj).subscribe(
              (res: any) => {
                
                if (res) {
                  this.router.navigate(['/dashboard/cources']);
                }
              },
              (err: any) => {
                
              }
            );
          }
        },
        (err: any) => {
          
        }
      );
      console.log(totalObj);
    } else {
      this.commonCreateCourceForm.markAllAsTouched();
      this.iltandViltForm.markAllAsTouched();

    }
    //alert("kunal");
    //let courseid = { course_id: this.routergetdata.id, status: 'publish' };
    //let savetype = this.routergetdata.copy ? {status:'publish'} : {};
    //let transferobj = { course_id: this.routergetdata.id, transfer_id: this.selectedPublisherId, status: 'publish' };
    //let totalObj = {
    //  ...this.iltandViltForm.value,
    //  ...savetype,
    //  ...this.commonCreateCourceForm.value,
    //  ...courseid,
    //  // ...transferobj,
    //  ...{learning_type:this.routergetdata.learning_type}
    //};

    //console.log(totalObj)
    //this.getFormValidationErrors_ILT();
    //if (this.iltandViltForm.valid && this.commonCreateCourceForm.valid) {
    //  this.courceService.courceStatus(transferobj).subscribe(
    //    (res: any) => {
    //      
    //      if (res) {
    //        this.router.navigate(['/dashboard/cources']);
    //      }
    //    },
    //    (err: any) => {
    //      
    //    }
    //  );
    //  console.log(totalObj);
    //} else {
    //  this.commonCreateCourceForm.markAllAsTouched();
    //  this.iltandViltForm.markAllAsTouched();
      
    //}
  }
  publishCourse_Video(status: any) {
    let courseid = { course_id: this.routergetdata.id };
    let savetype = { status: 'pending' };
    //let publisher = {trasfer_user_id:this.selectedPublisherId}
    let totalObj = {
      ...this.videobasedForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
      ...courseid,
      ...{ learning_type: this.routergetdata.learning_type },

    };
    this.getFormValidationErrors_Video();
    if (this.videobasedForm.valid && this.commonCreateCourceForm.valid) {
      this.courceService.updateCourse(totalObj).subscribe(
        (res: any) => {
          
          if (res) {
            debugger
            // this.router.navigate(['/dashboard/cources']);
            let transferobj = { course_id: this.routergetdata.id, transfer_id: this.selectedPublisherId, status: 'publish' };
            this.courceService.courceStatus(transferobj).subscribe(
              (res: any) => {
                
                if (res) {
                  this.router.navigate(['/dashboard/cources']);
                }
              },
              (err: any) => {
                
              }
            );
          }
        },
        (err: any) => {
          
        }
      );
      console.log(totalObj);
    } else {
      this.commonCreateCourceForm.markAllAsTouched();
      this.videobasedForm.markAllAsTouched();

    }
  }
  publishCourse_Material(status: any) {
    let courseid = { course_id: this.routergetdata.id };
    let savetype = { status: 'pending' };
    //let publisher = {trasfer_user_id:this.selectedPublisherId}
    let totalObj = {
      ...this.materialbasedForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
      ...courseid,
      ...{ learning_type: this.routergetdata.learning_type },

    };
    this.getFormValidationErrors_Material();
    if (this.materialbasedForm.valid && this.commonCreateCourceForm.valid) {
      this.courceService.updateCourse(totalObj).subscribe(
        (res: any) => {
          
          if (res) {
            debugger
            // this.router.navigate(['/dashboard/cources']);
            let transferobj = { course_id: this.routergetdata.id, transfer_id: this.selectedPublisherId, status: 'publish' };
            this.courceService.courceStatus(transferobj).subscribe(
              (res: any) => {
                
                if (res) {
                  this.router.navigate(['/dashboard/cources']);
                }
              },
              (err: any) => {
                
              }
            );
          }
        },
        (err: any) => {
          
        }
      );
      console.log(totalObj);
    } else {
      this.commonCreateCourceForm.markAllAsTouched();
      this.materialbasedForm.markAllAsTouched();

    }
  }
  publishCourse_Curriculum(status: any) {
    let courseid = { course_id: this.routergetdata.id };
    let savetype = { status: 'pending' };
    //let publisher = {trasfer_user_id:this.selectedPublisherId}
    let totalObj = {
      ...this.currriculumForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
      ...courseid,
      ...{ learning_type: this.routergetdata.learning_type },

    };
    this.getFormValidationErrors_Currriculum();
    if (this.currriculumForm.valid && this.commonCreateCourceForm.valid) {
      this.courceService.updateCourse(totalObj).subscribe(
        (res: any) => {
          
          if (res) {
            debugger
            // this.router.navigate(['/dashboard/cources']);
            let transferobj = { course_id: this.routergetdata.id, transfer_id: this.selectedPublisherId, status: 'publish' };
            this.courceService.courceStatus(transferobj).subscribe(
              (res: any) => {
                
                if (res) {
                  this.router.navigate(['/dashboard/cources']);
                }
              },
              (err: any) => {
                
              }
            );
          }
        },
        (err: any) => {
          
        }
      );
      console.log(totalObj);
    } else {
      this.commonCreateCourceForm.markAllAsTouched();
      this.currriculumForm.markAllAsTouched();

    }
  }
  publishCourse_Webbased(status: any) {
    let courseid = { course_id: this.routergetdata.id };
    let savetype = { status: 'pending' };
    //let publisher = {trasfer_user_id:this.selectedPublisherId}
    let totalObj = {
      ...this.webbasedForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
      ...courseid,
      ...{ learning_type: this.routergetdata.learning_type },

    };
    this.getFormValidationErrors_Webbased();
    if (this.webbasedForm.valid && this.commonCreateCourceForm.valid) {
      this.courceService.updateCourse(totalObj).subscribe(
        (res: any) => {
          
          if (res) {
            debugger
            // this.router.navigate(['/dashboard/cources']);
            let transferobj = { course_id: this.routergetdata.id, transfer_id: this.selectedPublisherId, status: 'publish' };
            this.courceService.courceStatus(transferobj).subscribe(
              (res: any) => {
                
                if (res) {
                  this.router.navigate(['/dashboard/cources']);
                }
              },
              (err: any) => {
                
              }
            );
          }
        },
        (err: any) => {
          
        }
      );
      console.log(totalObj);
    } else {
      this.commonCreateCourceForm.markAllAsTouched();
      this.webbasedForm.markAllAsTouched();

    }
  }
  publishCourse_Playlist(status: any) {
    let courseid = { course_id: this.routergetdata.id };
    let savetype = { status: 'pending' };
    //let publisher = {trasfer_user_id:this.selectedPublisherId}
    let totalObj = {
      ...this.playlistForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
      ...courseid,
      ...{ learning_type: this.routergetdata.learning_type },

    };
    this.getFormValidationErrors_Playlist();
    if (this.playlistForm.valid && this.commonCreateCourceForm.valid) {
      this.courceService.updateCourse(totalObj).subscribe(
        (res: any) => {
          
          if (res) {
            debugger
            // this.router.navigate(['/dashboard/cources']);
            let transferobj = { course_id: this.routergetdata.id, transfer_id: this.selectedPublisherId, status: 'publish' };
            this.courceService.courceStatus(transferobj).subscribe(
              (res: any) => {
                
                if (res) {
                  this.router.navigate(['/dashboard/cources']);
                }
              },
              (err: any) => {
                
              }
            );
          }
        },
        (err: any) => {
          
        }
      );
      console.log(totalObj);
    } else {
      this.commonCreateCourceForm.markAllAsTouched();
      this.playlistForm.markAllAsTouched();

    }
  }
  createNewCource() {
    let learnerguidearr = this.createCourceForm.value.learnerguidearray;
    let localarr: any = [];
    learnerguidearr.map((arrayres: any) => {
      if (arrayres.name) {
        localarr.push(arrayres.name);
      } else {
        localarr.push(arrayres);
      }
    });
    this.learnerGuidearray = localarr;
    this.createCourceForm.value.learnerguidearray = this.learnerGuidearray;
    console.log(this.learnerGuidearray);
    let savetype = { action: 'submit' };
    let totalObj = { ...this.createCourceForm.value, ...savetype };
    if (this.createCourceForm.valid) {
      this.courceService.createCource(totalObj).subscribe(
        (res: any) => {
          
          if (res) {
            this.router.navigate(['/dashboard/cources']);
          }
        },
        (err: any) => {
          
        }
      );
    } else {
      this.createCourceForm.markAllAsTouched();
      console.log(this.learnerGuidearray);
      console.log(totalObj);
    }
  }
  saveasDraft() {
    let learnerguidearr = this.createCourceForm.value.learnerguidearray;
    let localarr: any = [];
    learnerguidearr.map((arrayres: any) => {
      if (arrayres.name) {
        localarr.push(arrayres.name);
      } else {
        localarr.push(arrayres);
      }
    });
    this.learnerGuidearray = localarr;
    this.createCourceForm.value.learnerguidearray = this.learnerGuidearray;
    let savetype = { action: 'draft' };
    let totalObj = { ...this.createCourceForm.value, ...savetype };
    console.log(this.learnerGuidearray);
    if (this.createCourceForm.valid) {
      console.log(totalObj);
      console.log(this.createCourceForm.value);
      this.courceService.createCource(this.createCourceForm.value).subscribe(
        (res: any) => {
          
          if (res) {
            this.router.navigate(['/dashboard/cources']);
          }
        },
        (err: any) => {
          
        }
      );
    } else {
      this.createCourceForm.markAllAsTouched();
      console.log(this.learnerGuidearray);
      console.log(totalObj);
    }
  }

  certificationType(event: any) {
    if (event.target.value == 'yes') {
      this.showCertificateExpiry = true;
      console.log(this.createCourceForm.value);
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
    }

  }
  externalVendor(event: any) {
    if (event.target.value == 'yes') {
      this.externalVendorname = true;
      this.showVendor = true;
      this.iltandViltForm
        .get('external_vendor_name')
        ?.setValidators(Validators.required);
    } else {
      this.externalVendorname = false;
      this.showVendor = false;
      this.iltandViltForm.get('external_vendor_name')?.clearValidators();
    }
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
    } else {
      this.materialsourceurl = false;
      this.materialsourceupload = true;
      this.materialbasedForm
        .get('video_link')
        ?.setValidators(Validators.required);
      this.materialbasedForm.get('url')?.clearValidators();
    }
  }

  get_learningType(event: any) {
    console.log(event.target.value);
    this.learningType = event.target.value;
  }

  getPublisherselected(event:any){
    console.log(event.target.value);
    this.selectedPublisherId = event.target.value;
  }
  reject() {
    let statusobj = { course_id: this.routergetdata.id, status: 'reject', status_comment: this.rejectcomment }
    this.courceService.changeStatus(statusobj).subscribe((res: any) => {
      
      this.router.navigate(['/dashboard/cct']);
    }, (err: any) => {
      console.log(err)
    })
  }
  gettitlelanguage() {
    console.log(this.commonCreateCourceForm.value);
  }

  get titlecontrol() {
    return (<FormArray>this.commonCreateCourceForm.get('titleArr')).controls;
  }
  addtitlemultilanguage(): any {
    //debugger
    let titlearraylist: any = [];
    let descriptionarraylist: any = [];
    let objectivearraylist: any = [];
    let for_whomarraylist: any = [];
    let learn_morearraylist: any = [];
    this.courceService.getLanguages().subscribe(
      (res: any) => {
        console.log('language', res);
        console.log('rawvalue', this.commonCreateCourceForm);
        let languages = res.data;
        let i = 0;
        let languageData: any = [];
        //this.titlearraylist = Array.from(this.routergetdata.title).forEach(function (element) {
        //  console.log(element)
        //})
        titlearraylist = this.courceService.getTexttoArray(this.routergetdata.title);
        descriptionarraylist = this.courceService.getTexttoArray(this.routergetdata.description);
        objectivearraylist = this.courceService.getTexttoArray(this.routergetdata.objective);
        for_whomarraylist = this.courceService.getTexttoArray(this.routergetdata.for_whoom);
        learn_morearraylist = this.courceService.getTexttoArray(this.routergetdata.learn_more);

        console.log(titlearraylist)
        for (let index in languages) {
          const languageLength = this.commonCreateCourceForm.controls
            .titleArr as FormArray; 
          const desclength = this.commonCreateCourceForm.controls
            .descriptionArr as FormArray;           
		const objlength = this.commonCreateCourceForm.controls
            .objectiveArr as FormArray;    
          const forwhomlength = this.iltandViltForm.controls
            .forWhomArr as FormArray;           
		const learnmorelength = this.iltandViltForm.controls
            .learnMoreArr as FormArray;   
		var defaultValue = "";
		  var selectText = titlearraylist.find((e:any, inc:any) => {		  
		  return e[languages[index].slug]});
		  	  if(selectText != undefined){
			defaultValue = selectText[languages[index].slug]
		  }
          languageLength.push(
            this.fb.group({ name: [languages[index].slug], value: defaultValue })
          );
		  defaultValue = "";
		  selectText = descriptionarraylist.find((e:any, inc:any) => {		  
		  return e[languages[index].slug]});
		  if(selectText != undefined){
			defaultValue = selectText[languages[index].slug]
		  }
          desclength.push(
            this.fb.group({ name: [languages[index].slug], value: defaultValue })
          );
		  defaultValue = "";
		  selectText = objectivearraylist.find((e:any, inc:any) => {		  
		  return e[languages[index].slug]});
		  		  if(selectText != undefined){
			defaultValue = selectText[languages[index].slug]
		  }
          objlength.push(
            this.fb.group({ name: [languages[index].slug], value: defaultValue })
          );
		  defaultValue = "";
		  		  selectText = for_whomarraylist.find((e:any, inc:any) => {		  
		  return e[languages[index].slug]});
		  		  if(selectText != undefined){
			defaultValue = selectText[languages[index].slug]
		  }
          forwhomlength.push(
            this.fb.group({ name: [languages[index].slug], value: defaultValue })
          );
		  defaultValue = "";
		  		  selectText = learn_morearraylist.find((e:any, inc:any) => {		  
		  return e[languages[index].slug]});
		  		  if(selectText != undefined){
			defaultValue = selectText[languages[index].slug]
		  }
          learnmorelength.push(
            this.fb.group({ name: [languages[index].slug], value: defaultValue })
          );
          //  }
        }
        // for(let i=0;i<languageData.length;i++){

        // }
        //  this.titlearray.push(
        //   this.fb.group({languageData })
        //   )
        console.log(this.commonCreateCourceForm);
        console.log('languageData', languageData);

        // this.titlearray.push(languageData)
      },
      (err: any) => {
        
      }
    );

    //return this.commonCreateCourceForm.addControl('test',new FormControl('fdfd'))
    // return this.fb.group({
    //   title: new FormControl(''),
    //   description: new FormControl(''),
    // });
  }
  pushtoTitlearray() {
    return this.addtitlemultilanguage();
    // this.courceService.getLanguages().subscribe((res:any)=>{
    //   
    //   let languages = res.data;
    //   for(let index in languages){
    //     this.titlearray.push(this.fb.group({

    //     }))
    //    // return this.commonCreateCourceForm.addControl(`${this.availableLanguages[index].slug}`,this.fb.control('',[Validators.required]))
    //   }
    // },(err:any)=>{
    //   console.log(err)
    // })
  }

}
