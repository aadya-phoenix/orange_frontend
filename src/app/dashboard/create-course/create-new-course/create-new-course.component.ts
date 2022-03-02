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
  public learningType: any = 'ILT and vILT training';

  public cctLevel: any;
  coursesList:any;
  courseLength:any;

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

  public cctExpiryType: any = [
    {
      id: 1,
      name: 'None',
      status: 1,
    },
    {
      id: 2,
      name: 'Internal certification-with expire date',
      status: 1,
    },
    {
      id: 3,
      name: 'Internal certification-with no expire date',
      status: 1,
    },
    {
      id: 4,
      name: 'External certification-with expire date',
      status: 1,
    },
    {
      id: 5,
      name: 'External certification-with no expire date',
      status: 1,
    },
  ];

  public validityPeriod: any ;

  public vendorType: any;
  public cctSubjects: any;
  // = [
  //   {
  //     id: 1,
  //     name: 'Content and Multimedia - Content',
  //     status: 1,
  //   },
  //   {
  //     id: 2,
  //     name: 'Content and Multimedia - Multimedia',
  //     status: 1,
  //   },
  //   {
  //     id: 3,
  //     name: 'Customers and Marketing - Consulting',
  //     status: 1,
  //   },
  //   {
  //     id: 4,
  //     name: 'Customers and Marketing - Customer service & sales BtoB',
  //     status: 1,
  //   },
  //   {
  //     id: 5,
  //     name: 'Customers and Marketing - Sales and Customer Relations B2C',
  //     status: 1,
  //   },
  //   {
  //     id: 6,
  //     name: 'Customers and Marketing - Customer Service and Wholesale Sale',
  //     status: 1,
  //   },
  //   {
  //     id: 7,
  //     name: 'Customers and Marketing - Marketing',
  //     status: 1,
  //   },
  //   {
  //     id: 8,
  //     name: 'Customers and Marketing - Presales B2B',
  //     status: 1,
  //   },
  //   {
  //     id: 9,
  //     name: 'Digital Learning Group - New way of working at Orange',
  //     status: 0,
  //   },
  //   {
  //     id: 10,
  //     name: 'Digital Learning Group - Orange corporate culture',
  //     status: 0,
  //   },
  //   {
  //     id: 11,
  //     name: 'Innovation - Internet of things',
  //     status: 1,
  //   },
  //   {
  //     id: 12,
  //     name: 'Innovation - Patents and Promoting Innovation',
  //     status: 1,
  //   },
  //   {
  //     id: 13,
  //     name: 'Innovation - Design and User Experience',
  //     status: 1,
  //   },
  //   {
  //     id: 14,
  //     name: 'Management - Other trainings on management',
  //     status: 0,
  //   },
  //   {
  //     id: 15,
  //     name: 'Management - Country/Entity - Specific training',
  //     status: 1,
  //   },
  //   {
  //     id: 16,
  //     name: 'Management - Individual Development',
  //     status: 1,
  //   },
  //   {
  //     id: 17,
  //     name: 'Management - Team Development',
  //     status: 1,
  //   },
  //   {
  //     id: 18,
  //     name: 'Network IT and Cybersecurity - 5G',
  //     status: 1,
  //   },
  //   {
  //     id: 19,
  //     name: 'Network IT and Cybersecurity - Cloud and Network Virtualization',
  //     status: 1,
  //   },
  //   {
  //     id: 20,
  //     name: 'Network IT and Cybersecurity - Customer and Network Interventions',
  //     status: 1,
  //   },
  //   {
  //     id: 21,
  //     name: 'Network IT and Cybersecurity - Cybersecurity',
  //     status: 1,
  //   },
  //   {
  //     id: 22,
  //     name: 'Network IT and Cybersecurity - Data and AI',
  //     status: 1,
  //   },
  //   {
  //     id: 23,
  //     name: 'Network IT and Cybersecurity - Design',
  //     status: 1,
  //   },
  //   {
  //     id: 24,
  //     name: 'Network  IT and Cybersecurity - Health and Safety for Technical jobs',
  //     status: 1,
  //   },
  //   {
  //     id: 25,
  //     name: 'Network IT and Cybersecurity - Equipments and Services Integration',
  //     status: 1,
  //   },
  //   {
  //     id: 26,
  //     name: 'Network IT and Cybersecurity - Network Engineering',
  //     status: 1,
  //   },
  //   {
  //     id: 27,
  //     name: 'Network IT and Cybersecurity - IT Services',
  //     status: 1,
  //   },
  //   {
  //     id: 28,
  //     name: 'Network IT and Cybersecurity - Network Deployment',
  //     status: 1,
  //   },
  //   {
  //     id: 29,
  //     name: 'Network IT and Cybersecurity - Operations Network Supervision and Maintenance',
  //     status: 1,
  //   },
  //   {
  //     id: 30,
  //     name: 'Network IT and Cybersecurity - Software Development',
  //     status: 1,
  //   },
  //   {
  //     id: 31,
  //     name: 'Network IT and Cybersecurity - Software Packages',
  //     status: 1,
  //   },
  //   {
  //     id: 32,
  //     name: 'Network IT and Cybersecurity - Support and IT technical assistance',
  //     status: 1,
  //   },
  //   {
  //     id: 33,
  //     name: 'Support - Finance  Controlling and Accounting',
  //     status: 1,
  //   },
  //   {
  //     id: 34,
  //     name: 'Support - Assistants',
  //     status: 0,
  //   },
  //   {
  //     id: 35,
  //     name: 'Support - Communication',
  //     status: 1,
  //   },
  //   {
  //     id: 36,
  //     name: 'Support - Controlling',
  //     status: 0,
  //   },
  //   {
  //     id: 37,
  //     name: 'Support - Finance',
  //     status: 0,
  //   },
  //   {
  //     id: 38,
  //     name: 'Support - Human Resources',
  //     status: 1,
  //   },
  //   {
  //     id: 39,
  //     name: 'Support - Legal and Regulatory',
  //     status: 1,
  //   },
  //   {
  //     id: 40,
  //     name: 'Support - Real Estate  Logistics and Facility Management',
  //     status: 1,
  //   },
  //   {
  //     id: 41,
  //     name: 'Support â€“ Purchase',
  //     status: 1,
  //   },
  //   {
  //     id: 42,
  //     name: 'Support - Real Estate',
  //     status: 0,
  //   },
  //   {
  //     id: 43,
  //     name: 'Support - Regulation lobbying',
  //     status: 0,
  //   },
  //   {
  //     id: 44,
  //     name: 'Support - Risk management',
  //     status: 1,
  //   },
  //   {
  //     id: 45,
  //     name: 'Support - Supply chain',
  //     status: 1,
  //   },
  //   {
  //     id: 46,
  //     name: 'Transversal skills - Group Culture',
  //     status: 1,
  //   },
  //   {
  //     id: 47,
  //     name: 'Transversal skills - Career Development',
  //     status: 1,
  //   },
  //   {
  //     id: 48,
  //     name: 'Transversal skills - Diversity handicap awareness',
  //     status: 0,
  //   },
  //   {
  //     id: 49,
  //     name: 'Transversal skills - Intergenerational & knowledge transfer',
  //     status: 0,
  //   },
  //   {
  //     id: 50,
  //     name: 'Transversal skills - Languages',
  //     status: 1,
  //   },
  //   {
  //     id: 51,
  //     name: 'Transversal skills - New hire welcome Group culture intercultural',
  //     status: 0,
  //   },
  //   {
  //     id: 52,
  //     name: 'Transversal skills - Digital Culture and Collaborative tools',
  //     status: 1,
  //   },
  //   {
  //     id: 53,
  //     name: '"Transversal skills - Agility and Project Management',
  //     status: 1,
  //   },
  //   {
  //     id: 54,
  //     name: 'Transversal skills - Personal and Professional Development',
  //     status: 1,
  //   },
  //   {
  //     id: 55,
  //     name: 'Transversal skills - Corporate Social Responsibility and Diversity',
  //     status: 1,
  //   },
  //   {
  //     id: 56,
  //     name: 'Transversal skills - Quality Processes and Audits',
  //     status: 1,
  //   },
  //   {
  //     id: 57,
  //     name: 'Transversal skills - Quality of Work Life',
  //     status: 1,
  //   },
  //   {
  //     id: 58,
  //     name: 'Transversal skills - Transmission of Knowledge',
  //     status: 1,
  //   },
  //   {
  //     id: 59,
  //     name: 'Transversal skills - Ethics and Compliance',
  //     status: 1,
  //   },
  //   {
  //     id: 60,
  //     name: 'Credit Risk Analysis',
  //     status: 0,
  //   },
  //   {
  //     id: 61,
  //     name: 'Management - Orange Campus - Collective issues',
  //     status: 0,
  //   },
  //   {
  //     id: 62,
  //     name: 'Management - Orange Campus - Individual development',
  //     status: 0,
  //   },
  //   {
  //     id: 63,
  //     name: 'Transversal skills - Professional efficiency and personal development',
  //     status: 0,
  //   },
  // ];

  public deliveryMethod = [
    {
      id: 1,
      name: 'Face-to-face',
      status: 1,
    },
    {
      id: 2,
      name: 'CoopNet virtual classroom',
      status: 1,
    },
    {
      id: 3,
      name: 'Virtual classroom (other than CoopNet)',
      status: 1,
    },
  ];

  public availableLanguages = [
    { id: 1, name: 'Arabic' },
    { id: 2, name: 'Dutch (The Netherlands)' },
    { id: 3, name: 'English (US)' },
    { id: 4, name: 'French (France)' },
    { id: 5, name: 'Polish (Poland)' },
    { id: 6, name: 'Romanian (Romania)' },
    { id: 7, name: 'Russian (Russia)' },
    { id: 8, name: 'Slovak (Slovakia)' },
    { id: 9, name: 'Spanish(Spain)' },
  ];
  getUserrole: any; //to get user role
  public cordinatorsList: any = [];

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

  getValidityPeriod(){
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

  getTotalCourse(){
    this.courceService.getCources().subscribe((res:any)=>{
      this.coursesList = res.data;
      this.courseLength =this.coursesList.length
      console.log(res);
    },(err:any)=>{
      console.log(err);
    })
  }
  

  ngOnInit(): void {
    this.getCordinators();
    this.getvendorType();
    this.getLevel();
    this.getSubjects();
    this.getValidityPeriod();
    this.getTotalCourse();

    //common form
    this.commonCreateCourceForm = this.fb.group({
      title: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
      learning_type: new FormControl('ILT and vILT training', [
        Validators.required,
      ]),
      description: new FormControl('', [Validators.required]),
      resource: new FormControl(''),
      objective: new FormControl('', [Validators.required]),
      level: new FormControl('', [Validators.required]),
      subject: new FormControl([Validators.required]),
     // additional_comment: new FormControl(''),
      prerequisite: new FormControl(''),
      keyword: new FormControl('', [Validators.required]),
      email_content_owner: new FormControl('', [Validators.required]),
      training_provided_by: new FormControl('', [Validators.required]),
      available_language: new FormControl('', [Validators.required]),

      //no field
      email_training_contact:new FormControl('',[Validators.required])
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
      video_link:new FormControl(''),
      //e need to add
      first_session_date: new FormControl('', [Validators.required]),
      expiry_date: new FormControl('', [Validators.required]),
      title_additional: new FormControl(''),
      external_vendor: new FormControl('', [Validators.required]),

      entity_business_area: new FormControl('', [Validators.required]),
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
  }

  get f() {
    return this.iltandViltForm.controls;
  }

  get t() {
    return this.f.guidelines as FormArray;
  }

  get currriculum() {
    return this.currriculumForm.controls;
  }

  get curriculumArray() {
    return this.currriculum.learnerguidearray as FormArray;
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
  createNewCourceIlt() {
    console.log(this.learnerGuidearray);
    let savetype = { status: 'pending' };
    let totalObj = {
      ...this.iltandViltForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
    };
    if (this.iltandViltForm.valid && this.commonCreateCourceForm.valid) {
      this.courceService.createCource(totalObj).subscribe(
        (res: any) => {
          console.log(res);
          if (res) {
           // this.router.navigate(['/dashboard/cources']);
           this.router.navigateByUrl('/dashboard/cources/view-details', {
            state: res.data,
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
            //this.router.navigate(['/dashboard/cources']);
            this.router.navigateByUrl('/dashboard/cources/view-details', {
              state: res.data,
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
}
