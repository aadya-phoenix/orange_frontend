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

@Component({
  selector: 'app-create-new-course',
  templateUrl: './create-new-course.component.html',
  styleUrls: ['./create-new-course.component.scss'],
})
export class CreateNewCourseComponent implements OnInit {
  public createCourceForm!: FormGroup;
  public commonCreateCourceForm!: FormGroup;
  public iltandViltForm!: FormGroup;
  public materialbasedForm!: FormGroup;
  public currriculumForm!: FormGroup;
  public showCertificateExpiry: boolean = false;
  public externalVendorname: boolean = false;
  showVendor: boolean = false;
  public learnerGuidearray: any = [];
  public learningType: any = '1';

  public cctLevel: any;
  coursesList: any;
  courseLength: any;
  notification: boolean = false;

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

    //common form
    this.commonCreateCourceForm = this.fb.group({
      title1: new FormArray([]),
      //title: new FormArray([]),
      title: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
      learning_type: new FormControl('1', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      resource: new FormControl(''),
      objective: new FormControl('', [Validators.required]),
      level: new FormControl('', [Validators.required]),
      subject: new FormControl([Validators.required]),
      // additional_comment: new FormControl(''),
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

    //ilt and vilt
    this.iltandViltForm = this.fb.group({
      manager_approval: new FormControl('', [Validators.required]),
      digital: new FormControl('', [Validators.required]),
      certification: new FormControl('', [Validators.required]),
      certification_expiry_type: new FormControl(''),
      validity_period: new FormControl(''),
      external_vendor_name: new FormControl(''),
      purchase_order: new FormControl(''),
      // email_training_contact: new FormControl('', [Validators.required]),
      delivery_method: new FormControl('', [Validators.required]),
      for_whoom: new FormControl('', [Validators.required]),
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
      external_vendor: new FormControl('', [Validators.required]),

      entity_business_area: new FormControl([Validators.required]),
      email_preffered_instructor: new FormControl('', [Validators.required]),

      who_see_course: new FormControl(''),
      additional_comment: new FormControl(''),

      // learner_guideline: new FormControl(''),
      guidelines: this.fb.array([]),
      //ilt and vilt

      regional_cordinator:
        this.getUserrole.id === 2
          ? new FormControl('', [Validators.required])
          : new FormControl(),
    });

    //material based
    this.materialbasedForm = this.fb.group({
      //material based
      subject: new FormControl(),
      learn_more: new FormControl(''),
      resource: new FormControl(''),
      who_see_course: new FormControl(''),
      expiry_date: new FormControl(''),
      title_additional: new FormControl(''),
      free_field_content: new FormControl(''),
      for_whoom: new FormControl(''),
      validity_period: new FormControl(''),
      material_source: new FormControl(''),
      material_expiry_date: new FormControl(''),
      material_url: new FormControl(''),
      //material
    });

    //curriculum
    this.currriculumForm = this.fb.group({
      email_of_curriculum_owner: new FormControl(''),
      title_additional: new FormControl(''),
      free_field_content: new FormControl(''),
      learn_more: new FormControl(''),
      expiry_date: new FormControl(''),
      who_see_course: new FormControl(''),
      for_whoom: new FormControl(''),
      validity_period: new FormControl(''),

      learnerguidearray: this.fb.array([]),
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
  //   return this.commonFormtitle.title1 as FormArray;
  // }

  get t() {
    return this.f.guidelines as FormArray;
  }

  get currriculum() {
    return this.currriculumForm.controls;
  }

  get curriculumArray() {
    return this.currriculum.learnerguidearray as FormArray;
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
          const languageLength = this.commonCreateCourceForm.controls
            .title1 as FormArray;
          languageLength.push(
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

  get title1control() {
    return (<FormArray>this.commonCreateCourceForm.get('title1')).controls;
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

  //get validation erros
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
    let titleForm: any;
    let obj: any;
    titleForm = this.commonCreateCourceForm.value.title;
    // for(let index in titleForm){
    //   //debugger

    //   if(titleForm[index].value !=''){
    //    obj ={ }
    //   // this.commonCreateCourceForm.t
    //     titlearray.push(titleForm[index].name , titleForm[index].value);
    //     console.log(titlearray)
    //     console.log(titleForm[index].value);
    //   }
    // }
    // this.commonCreateCourceForm.value.title=[{name:'test'}];
    // this.commonCreateCourceForm.patchValue({description:'fdgdg'}) ;
    // this.commonCreateCourceForm.patchValue({title:'fdgdg'})
    console.log(this.commonCreateCourceForm.value);

    if (this.iltandViltForm.valid && this.commonCreateCourceForm.valid) {
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
      this.iltandViltForm.markAllAsTouched();
      console.log(this.learnerGuidearray);
      console.log(totalObj);
    }
    this.getFormValidationErrors();
  }

  //draft ilt and vilt
  saveasDraftIlt() {
    let savetype = { status: 'draft' };
    let totalObj = {
      ...this.iltandViltForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
    };
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
    if (event.target.value == 'yes') {
      // alert('hi')
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

  getlearningType(event: any) {
    console.log(event.target.value);
    this.learningType = event.target.value;
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
}
