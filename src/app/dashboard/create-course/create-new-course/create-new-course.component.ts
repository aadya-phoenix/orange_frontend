import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
const emailregexp = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
@Component({
  selector: 'app-create-new-course',
  templateUrl: './create-new-course.component.html',
  styleUrls: ['./create-new-course.component.scss'],
})
export class CreateNewCourseComponent implements OnInit {
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
  public learningTypeSelected: any = '0';
  public selectedLanguages: any = [];
  public cctLevel: any;
  coursesList: any;
  courseLength: any;
  notification: boolean = false;
  public requiredFields:any = {"1":			{"common":
							{"title":[Validators.required],
							"duration":[Validators.required],
							"learning_type":[Validators.required],
							"description":[Validators.required],
							"objective":[Validators.required],
							"level":[Validators.required],
							"subject":[Validators.required],
							"keyword":[Validators.required],
							"email":[Validators.required,Validators.pattern(emailregexp)],
							"certification_expiry_type":[Validators.required],
							"validity_period":[Validators.required],
							"external_vendor_name":[Validators.required],
							"training_provided_by":[Validators.required],
							"available_language":[Validators.required],
							"email_training_contact":[Validators.required,Validators.pattern(emailregexp)]			
						}, 
						'each': {"manager_approval":[Validators.required],
							"digital":[Validators.required],
							"certification":[Validators.required],
							"delivery_method":[Validators.required],
							"for_whoom":[Validators.required],
							"first_session_date":[Validators.required],
							"expiry_date":[Validators.required],
							"external_vendor":[Validators.required],
							"entity_business_area":[Validators.required],
							"email_preffered_instructor":[Validators.required],
							'regional_cordinator': [Validators.required]
  }},
						'2':
						{'common':
							{"title":[Validators.required],
							"duration":[Validators.required],
							"learning_type":[Validators.required],
							"description":[Validators.required],
							"objective":[Validators.required],
							"level":[Validators.required],
							"subject":[Validators.required],
							"keyword":[Validators.required],
							"email":[Validators.required,Validators.pattern(emailregexp)],
							"training_provided_by":[Validators.required],
							"available_language":[Validators.required],
							"email_training_contact":[Validators.required,Validators.pattern(emailregexp)]			
						}, 
      'each': {
        "email_preffered_instructor": [Validators.required, Validators.pattern(emailregexp)]
      }
    },
						'3':
						{'common':
							{"title":[Validators.required],
							"duration":[Validators.required],
							"learning_type":[Validators.required],
							"description":[Validators.required],
							"objective":[Validators.required],
							"level":[Validators.required],
							"subject":[Validators.required],
							"keyword":[Validators.required],
							"email":[Validators.required,Validators.pattern(emailregexp)],
							"training_provided_by":[Validators.required],
							"available_language":[Validators.required],
							"email_training_contact":[Validators.required,Validators.pattern(emailregexp)]			
						}, 
              'each': {"video_link":[Validators.required],
							"url":[Validators.required]
						}},
						'4':
						{'common':
							{"title":[Validators.required],
							"duration":[Validators.required],
							"learning_type":[Validators.required],
							"description":[Validators.required],
							"objective":[Validators.required],
							"level":[Validators.required],
							"subject":[Validators.required],
							"keyword":[Validators.required],
							"email":[Validators.required,Validators.pattern(emailregexp)],
							"training_provided_by":[Validators.required],
							"available_language":[Validators.required],
							"email_training_contact":[Validators.required,Validators.pattern(emailregexp)]			
						}, 
						'each': {"manager_approval":[Validators.required],
							"digital":[Validators.required],
							"certification":[Validators.required],
							"for_whoom":[Validators.required],
							"external_vendor_name":[Validators.required]
						}},'5':
						{'common':
							{"title":[Validators.required],
							"duration":[Validators.required],
							"learning_type":[Validators.required],
							"description":[Validators.required],
							"objective":[Validators.required],
							"level":[Validators.required],
							"subject":[Validators.required],
							"keyword":[Validators.required],
							"email":[Validators.required,Validators.pattern(emailregexp)],
							"training_provided_by":[Validators.required],
							"available_language":[Validators.required],
									
						}, 
						'each': {
							"digital":[Validators.required],
							"certification":[Validators.required],
              "external_vendor": [Validators.required],
              "email_preffered_instructor": [Validators.required, Validators.pattern(emailregexp)]
						}},'6':
						{'common':
							{"title":[Validators.required],
							"description":[Validators.required],		
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

  public availableLanguages: any;
  public learningTypes: any;

  getUserrole: any; //to get user role
  public cordinatorsList: any = [];
  draftRequests: any = [];
  pendingRequests: any = [];
  rejectedRequests: any = [];
  closedRequests: any = [];
  stringArray: any = [];
  publisherList: any = [];
  selectedPublisherId: any;

  constructor(
    private fb: FormBuilder,
    private courceService: CourcesService,
    private router: Router,
    private authService: AuthenticationService
  ) {
    this.getUserrole = this.authService.getRolefromlocal();
    //this.getUserrole = JSON.parse(this.authService.getRolefromlocal());
  }

  //get regional cordinators
  getCordinators() {
    this.courceService.getregionalCordinator().subscribe(
      (res: any) => {
        console.log(res);
        this.cordinatorsList = res.data;
      },
      (err: any) => {
        console.log(err);
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
        console.log(err);
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
    this.authService.getUserRoles().subscribe(
      (res: any) => {
        console.log(res);
        this.publisherList = res.data['4'];
        console.log(this.publisherList);
      },
      (err: any) => {
        console.log(err);
      }
    );
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
        console.log(res);
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
      //additional_comment: new FormControl(''),
      prerequisite: new FormControl(''),
      keyword: new FormControl('', [Validators.required]),
      email_content_owner: new FormControl('', [
        Validators.required,
        Validators.pattern(emailregexp),
      ]),
      training_provided_by: new FormControl([Validators.required]),
      available_language: new FormControl('',[Validators.required]),

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
      certification_expiry_type: new FormControl('',[Validators.required]),
      validity_period: new FormControl('',[Validators.required]),
      external_vendor_name: new FormControl('',[Validators.required]),
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

    //material based
    this.materialbasedForm = this.fb.group({
      //material based          
      video_link: new FormControl(''),
      url: new FormControl(''),
      additional_comment: new FormControl(''),
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
      certification: new FormControl('', [Validators.required]),
      certification_expiry_type: new FormControl('', [Validators.required]),
      validity_period: new FormControl('', [Validators.required]),
      learn_more: new FormControl(''),
      video_link: new FormControl(''),
      title_additional: new FormControl(''),
      external_vendor_name: new FormControl(''),
      free_field_content: new FormControl(''),
      expiry_date: new FormControl(''),
      url: new FormControl('', [Validators.required]),
      who_see_course: new FormControl(''),
      for_whoom: new FormControl('', [Validators.required]),
      learner_guideline: this.fb.array([]),
      additional_comment: new FormControl(''),
      regional_cordinator:
        this.getUserrole.id === 2
          ? new FormControl('', [Validators.required])
          : new FormControl()
    });

    this.webbasedForm = this.fb.group({
      email_preffered_instructor: new FormControl('', [Validators.required,
        Validators.pattern(emailregexp)]),
      digital: new FormControl('', [Validators.required]),
      certification: new FormControl('', [Validators.required]),
      certification_expiry_type: new FormControl('', [Validators.required]),
      validity_period: new FormControl('', [Validators.required]),
      external_vendor: new FormControl('', [Validators.required]),
      external_vendor_name: new FormControl('', [Validators.required]),
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
      url: new FormControl('', [Validators.required]),
      video_link: new FormControl('', [Validators.required]),
      level: new FormControl('', [Validators.required]),
      who_see_course: new FormControl('', [Validators.required]),
      free_field_content: new FormControl('', [Validators.required]),
      email_preffered_instructor: new FormControl('', [Validators.required]),
      additional_comment: new FormControl(''),
      regional_cordinator:
        this.getUserrole.id === 2
          ? new FormControl('', [Validators.required])
          : new FormControl()
    });

    this.addLearnerGuideline();
    this.addLearnerGuidelinetocurriculum();
    this.pushtoTitlearray();
    console.log(this.commonCreateCourceForm.value);
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

  addtitlemultilanguage(): any {
    //debugger
    this.courceService.getLanguages().subscribe(
      (res: any) => {
        console.log('language', res);
        console.log('rawvalue', this.commonCreateCourceForm);
        let languages = res.data;
        let i = 0;
        let languageData: any = [];
        for (let index in languages) {
		console.log(languages[index]);
          const languageLength = this.commonCreateCourceForm.controls.titleArr as FormArray;
          const descriptionFormArr = this.commonCreateCourceForm.controls.descriptionArr as FormArray;
          const objectiveFormArr = this.commonCreateCourceForm.controls.objectiveArr as FormArray;
          const forWhomFormArr = this.iltandViltForm.controls.forWhomArr as FormArray;
          const learnMoreFormArr = this.iltandViltForm.controls.learnMoreArr as FormArray;
		  
          languageLength.push(
            this.fb.group({ name: [languages[index].slug], value: '' })
          );
			descriptionFormArr.push(
            this.fb.group({ name: [languages[index].slug], value: '' })
          );
		  objectiveFormArr.push(
            this.fb.group({ name: [languages[index].slug], value: '' })
          );		  
		  forWhomFormArr.push(
            this.fb.group({ name: [languages[index].slug], value: '' })
          );
		  learnMoreFormArr.push(
            this.fb.group({ name: [languages[index].slug], value: '' })
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
        console.log(err);
      }
    );

    //return this.commonCreateCourceForm.addControl('test',new FormControl('fdfd'))
    // return this.fb.group({
    //   title: new FormControl(''),
    //   description: new FormControl(''),
    // });
  }

  get titlecontrol() {
    return (<FormArray>this.commonCreateCourceForm.get('titleArr')).controls;
  }

  pushtoTitlearray() {
    return this.addtitlemultilanguage();
    // this.courceService.getLanguages().subscribe((res:any)=>{
    //   console.log(res);
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

  gettitlelanguage() {
    console.log(this.commonCreateCourceForm.value);
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
  }

  removeLearnerGuidelinetocurriculum(i: any) {
    this.curriculumArray.removeAt(i);
  }
  selectLearning() {
    // this.createCourceForm.setValue({
    //   name:new FormControl('Test')
    // })
  }

  //get ILT validation erros
  getFormValidationErrors() {
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
    console.log(this.stringArray);
    console.log(this.learnerGuidearray);
    let savetype = { status: status };
    let totalObj = {
      ...this.iltandViltForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
    };
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
    this.commonCreateCourceForm.value.title = titlearray;
	this.iltandViltForm.value.for_whoom = for_whomarray;
	this.iltandViltForm.value.for_whoom = for_whomarray;
    // this.commonCreateCourceForm.patchValue({description:'fdgdg'}) ;
    // this.commonCreateCourceForm.patchValue({title:'fdgdg'})
    console.log(this.commonCreateCourceForm.value);
//let abc = this.iltandViltForm.controls;
//let c = Object.keys(abc);
//for(let x in c){
//	console.log(c[x]);
//if(this.iltandViltForm.get(c[x]).value == 'Other'){
//  this.iltandViltForm.get(c[x]).validator = <any>Validators.compose([Validators.required]);
//  console.log("kunal");

//} else {                
//  this.iltandViltForm.get(c[x]).clearValidators();
//  console.log("gandhi");
//}
//this.iltandViltForm.get(c[x]).updateValueAndValidity(); 

//}
    this.getFormValidationErrors();
    if (this.iltandViltForm.valid && this.commonCreateCourceForm.valid) {
      console.log(totalObj);
      if (totalObj.learning_type == null || totalObj.learning_type == "") {
        totalObj.learning_type = this.learningType.toString();
      }
      this.courceService.createCource(totalObj).subscribe(
        (res: any) => {
          console.log(res);
          if (res) {
            let statedata = res.data;
            let saveobj = { issave: true };
            let stateobj = { ...statedata, ...saveobj };
            // this.router.navigate(['/dashboard/cources']);
            /*this.router.navigateByUrl('/dashboard/cources/request-detail', {
              state: stateobj,
            });*/
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
    } else {
      this.commonCreateCourceForm.markAllAsTouched();
      this.iltandViltForm.markAllAsTouched();
      console.log(this.learnerGuidearray);
      console.log(totalObj);
    }
    
    //if (status == "draft") {
    //  this.saveasDraftIlt();
    //}
    //else {      
    //  if (totalObj.learning_type == null || totalObj.learning_type == "") {
    //    totalObj.learning_type = this.learningType.toString();
    //  }
    //  //if (totalObj.email_preffered_instructor[0] == null) {
    //  //  totalObj.email_preffered_instructor = "";
    //  //}
    //  //if (totalObj.entity_business_area[0] == null) {
    //  //  totalObj.entity_business_area = "";
    //  //}
    //  //if (totalObj.external_vendor[0] == null) {
    //  //  totalObj.external_vendor = "";
    //  //}
    //  this.courceService.createCource(totalObj).subscribe(
    //    (res: any) => {
    //      console.log(res);
    //      if (res) {
    //        let statedata = res.data;
    //        let saveobj = { issave: true };
    //        let stateobj = { ...statedata, ...saveobj };
    //        // this.router.navigate(['/dashboard/cources']);
    //        this.router.navigateByUrl('/dashboard/cources/request-detail', {
    //          state: stateobj,
    //        });
    //      }
    //    },
    //    (err: any) => {
    //      console.log(err);
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
  //create Video form
  createNewCourceVideo(status: any) {
    console.log(this.stringArray);
    console.log(this.learnerGuidearray);
    let savetype = { status: status };
    let totalObj = {
      ...this.videobasedForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
    };
    let titlearray: any = [];
    let descriptionarray: any = [];
    let objectivearray: any = [];
    let for_whomarray: any = [];
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
          [`${this.iltandViltForm.value.titleArr[i].name}`]:
            this.iltandViltForm.value.forWhomArr[i].value,
        });
      }
    }
    console.log('titleForm', titlearray);
    
    this.commonCreateCourceForm.value.title = titlearray;
    this.commonCreateCourceForm.value.description	= descriptionarray;
    this.commonCreateCourceForm.value.objective = objectivearray;
    this.commonCreateCourceForm.value.title = titlearray;
    console.log(this.commonCreateCourceForm.value);
    
    this.getFormValidationErrors_Video();
    if (this.videobasedForm.valid && this.commonCreateCourceForm.valid) {
      console.log(totalObj);
      if (totalObj.learning_type == null || totalObj.learning_type == "") {
        totalObj.learning_type = this.learningType.toString();
      }
      this.courceService.createCource(totalObj).subscribe(
        (res: any) => {
          console.log(res);
          if (res) {
            let statedata = res.data;
            let saveobj = { issave: true };
            let stateobj = { ...statedata, ...saveobj };
            // this.router.navigate(['/dashboard/cources']);
            this.router.navigateByUrl('/dashboard/cources/request-detail', {
              state: stateobj,
            });
          }
        },
        (err: any) => {
          console.log(err);
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
    let savetype = { status: status };
    let totalObj = {
      ...this.materialbasedForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
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

    this.commonCreateCourceForm.value.title = titlearray;
    console.log(this.commonCreateCourceForm.value);

    this.getFormValidationErrors_Material();
    if (this.materialbasedForm.valid && this.commonCreateCourceForm.valid) {
      console.log(totalObj);
      if (totalObj.learning_type == null || totalObj.learning_type == "") {
        totalObj.learning_type = this.learningType.toString();
      }
      this.courceService.createCource(totalObj).subscribe(
        (res: any) => {
          console.log(res);
          if (res) {
            let statedata = res.data;
            let saveobj = { issave: true };
            let stateobj = { ...statedata, ...saveobj };
            // this.router.navigate(['/dashboard/cources']);
            this.router.navigateByUrl('/dashboard/cources/request-detail', {
              state: stateobj,
            });
          }
        },
        (err: any) => {
          console.log(err);
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
    let savetype = { status: status };
    let totalObj = {
      ...this.currriculumForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
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

    this.commonCreateCourceForm.value.title = titlearray;
    console.log(this.commonCreateCourceForm.value);

    this.getFormValidationErrors_Currriculum();
    if (this.currriculumForm.valid && this.commonCreateCourceForm.valid) {
      console.log(totalObj);
      if (totalObj.learning_type == null || totalObj.learning_type == "") {
        totalObj.learning_type = this.learningType.toString();
      }
      this.courceService.createCource(totalObj).subscribe(
        (res: any) => {
          console.log(res);
          if (res) {
            let statedata = res.data;
            let saveobj = { issave: true };
            let stateobj = { ...statedata, ...saveobj };
            // this.router.navigate(['/dashboard/cources']);
            this.router.navigateByUrl('/dashboard/cources/request-detail', {
              state: stateobj,
            });
          }
        },
        (err: any) => {
          console.log(err);
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
    let savetype = { status: status };
    let totalObj = {
      ...this.webbasedForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
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

    this.commonCreateCourceForm.value.title = titlearray;
    console.log(this.commonCreateCourceForm.value);

    this.getFormValidationErrors_Webbased();
    if (this.webbasedForm.valid && this.commonCreateCourceForm.valid) {
      console.log(totalObj);
      if (totalObj.learning_type == null || totalObj.learning_type == "") {
        totalObj.learning_type = this.learningType.toString();
      }
      this.courceService.createCource(totalObj).subscribe(
        (res: any) => {
          console.log(res);
          if (res) {
            let statedata = res.data;
            let saveobj = { issave: true };
            let stateobj = { ...statedata, ...saveobj };
            // this.router.navigate(['/dashboard/cources']);
            this.router.navigateByUrl('/dashboard/cources/request-detail', {
              state: stateobj,
            });
          }
        },
        (err: any) => {
          console.log(err);
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
    let savetype = { status: status };
    let totalObj = {
      ...this.playlistForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
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

    this.commonCreateCourceForm.value.title = titlearray;
    console.log(this.commonCreateCourceForm.value);

    this.getFormValidationErrors_Playlist();
    if (this.playlistForm.valid) {
      console.log(totalObj);
      if (totalObj.learning_type == null || totalObj.learning_type == "") {
        totalObj.learning_type = this.learningType.toString();
      }
      this.courceService.createCource(totalObj).subscribe(
        (res: any) => {
          console.log(res);
          if (res) {
            let statedata = res.data;
            let saveobj = { issave: true };
            let stateobj = { ...statedata, ...saveobj };
            // this.router.navigate(['/dashboard/cources']);
            this.router.navigateByUrl('/dashboard/cources/request-detail', {
              state: stateobj,
            });
          }
        },
        (err: any) => {
          console.log(err);
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
    let totalObj = {
      ...this.iltandViltForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
    };
    if (totalObj.learning_type == null || totalObj.learning_type == "") {
      totalObj.learning_type = this.learningType.toString();
    }
    alert(totalObj.email_preffered_instructor[0]);
    if (totalObj.email_preffered_instructor[0] == null) {
      totalObj.email_preffered_instructor = "";
    }
    if (totalObj.entity_business_area[0] == null) {
      totalObj.entity_business_area = "";
    }
    if (totalObj.external_vendor[0] == null) {
      totalObj.external_vendor = "";
    }
    if (this.iltandViltForm.valid && this.commonCreateCourceForm.valid) {
      console.log(totalObj);
      this.courceService.createCource(totalObj).subscribe(
        (res: any) => {
          console.log(res);
          if (res) {
            let statedata = res.data;
            let saveobj = { issave: true };
            let stateobj = { ...statedata, ...saveobj };
            //this.router.navigate(['/dashboard/cources']);
            this.router.navigateByUrl('/dashboard/cources/request-detail', {
              state: saveobj,
            });
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
    } else {
      this.commonCreateCourceForm.markAllAsTouched();
      this.iltandViltForm.markAllAsTouched();
      this.getFormValidationErrors();
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
          console.log(res);
          if (res) {
            this.router.navigate(['/dashboard/cources']);
          }
        },
        (err: any) => {
          console.log(err);
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
          console.log(res);
          if (res) {
            this.router.navigate(['/dashboard/cources']);
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
    } else {
      this.createCourceForm.markAllAsTouched();
      console.log(this.learnerGuidearray);
      console.log(totalObj);
    }
  }

  curriculumSubmit() {
    console.log(this.currriculumForm.value);
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
    }

    // if (event.target.value == 'yes') {
    //   // alert('hi')
    //   this.showCertificateExpiry = true;
    //   this.iltandViltForm
    //     .get('certification_expiry_type')
    //     ?.setValidators(Validators.required);
    //   this.iltandViltForm
    //     .get('validity_period')
    //     ?.setValidators(Validators.required);
    // } else {
    //   this.showCertificateExpiry = false;
    //   this.iltandViltForm.get('certification_expiry_type')?.clearValidators();
    //   this.iltandViltForm.get('validity_period')?.clearValidators();
    // }
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
	let selectedLid = this.requiredFields[this.learningType];
	for(let x in this.requiredFields){
		if(x == selectedLid){
			
		} else {
			
		}
	}
  }

  getPublisherselected(event: any) {
    console.log(event.target.value);
    this.selectedPublisherId = event.target.value;
  }

  transfertoPublishData() {
    let savetype = { status: 'pending' };
    let totalObj = {
      ...this.iltandViltForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
    };
    console.log(this.commonCreateCourceForm.value);
    console.log(totalObj);
    if (this.iltandViltForm.valid && this.commonCreateCourceForm.valid) {
      this.courceService.createCource(totalObj).subscribe(
        (res: any) => {
          console.log(res);
          if (res) {
            // this.router.navigate(['/dashboard/cources']);
            let coreseres = res.data;
            let transferobj = {
              course_id: res.data.id,
              transfer_id: this.selectedPublisherId,
            };
            this.courceService.courseTransfer(transferobj).subscribe(
              (res: any) => {
                console.log(res);

                // this.router.navigate(['/dashboard/cources']);

                let statedata = coreseres;
                let saveobj = { issave: true };
                let stateobj = { ...statedata, ...saveobj };
                // this.router.navigate(['/dashboard/cources']);
                this.router.navigateByUrl('/dashboard/cources/request-detail', {
                  state: stateobj,
                });
              },
              (err: any) => {
                console.log(err);
              }
            );
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
    } else {
      this.commonCreateCourceForm.markAllAsTouched();
      this.iltandViltForm.markAllAsTouched();
      console.log(this.learnerGuidearray);
      console.log(totalObj);
    }
    this.getFormValidationErrors();
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
}
