import { Component, OnInit } from '@angular/core';
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
  styleUrls: ['./update-cource.component.scss']
})
export class UpdateCourceComponent implements OnInit {

  public createCourceForm!: FormGroup;
  public commonCreateCourceForm!: FormGroup;
  public iltandViltForm!: FormGroup;
  public materialbasedForm!: FormGroup;
  showCollapse: boolean = true;
  routergetdata:any;
  getUserrole:any;

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
  public cordinatorsList: any = [];

  constructor(
    private fb: FormBuilder,
    private courceService: CourcesService,
    private router: Router,
    private authService:AuthenticationService
  ) {
    this.routergetdata = this.router.getCurrentNavigation()?.extras.state;
    if(!this.routergetdata){
      this.router.navigateByUrl('/dashboard/cources');
    }
  }
  public showCertificateExpiry: boolean = false;
  public externalVendorname: boolean = false;
  public learnerGuidearray: any = [];
  public learningType: any = 'ILT and vILT training';

  getRole(){
    this.getUserrole = this.authService.getRolefromlocal();
    //this.getUserrole = JSON.parse(this.authService.getRolefromlocal());
  }


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

    console.log(this.routergetdata)
    this.getRole();

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
      additional_comment: new FormControl(''),
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

      // learner_guideline: new FormControl(''),
      guidelines: this.fb.array([]),
      //ilt and vilt

      regional_cordinator:
        this.getUserrole.id === 2
          ? new FormControl('', [Validators.required])
          : new FormControl(),
    });

    this.materialbasedForm = this.fb.group({
      //material based
      material_source: new FormControl(''),
      material_expiry_date: new FormControl(''),
      material_url: new FormControl(''),
      //material
    });

    this.commonCreateCourceForm.patchValue(this.routergetdata);
    this.commonCreateCourceForm.controls['learning_type'].disable();
    this.iltandViltForm.patchValue(this.routergetdata);
    if(this.routergetdata.external_vendor=='yes'){
      this.externalVendorname = true;
    }else{
      this.externalVendorname = false;
    }
    if(this.routergetdata.certification == 'yes'){
      this.showCertificateExpiry = true;
    }
    this.commonCreateCourceForm.patchValue({subject: parseInt(this.routergetdata.subject)})
    //console.log(this.routergetdata.subject);
    
    this.addLearnerGuideline();
  }

  get f() {
    return this.iltandViltForm.controls;
  }

  get t() {
    return this.f.guidelines as FormArray;
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

  removeLearnerGuideline(i: any) {
    this.t.removeAt(i);
    // this.learnerGuidearray.splice(i,1)
  }

  selectLearning() {
    // this.createCourceForm.setValue({
    //   name:new FormControl('Test')
    // })
  }


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
  publish() {
    console.log('publish')

    // let learnerguidearr = this.iltandViltForm.value.learnerguidearray;
    // let localarr: any = [];
    // learnerguidearr.map((arrayres: any) => {
    //   if (arrayres.name) {
    //     localarr.push(arrayres.name);
    //   } else {
    //     localarr.push(arrayres);
    //   }
    // });
    // this.learnerGuidearray = localarr;
    // this.iltandViltForm.value.learnerguidearray = this.learnerGuidearray;
    let courseid = { course_id:this.routergetdata.id}
    let savetype = { status : 'publish' };
    let totalObj = {
      ...this.iltandViltForm.value,
      ...savetype,
      ...this.commonCreateCourceForm.value,
      ...courseid
    };
    if (this.iltandViltForm.valid && this.commonCreateCourceForm.valid) {
      this.courceService.updateCourse(totalObj).subscribe(
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
      console.log(totalObj);
    } else {
      this.commonCreateCourceForm.markAllAsTouched();
      this.iltandViltForm.markAllAsTouched();
      this.getFormValidationErrors()
      console.log(totalObj);
    }

  }

  //draft ilt and vilt
  saveasDraftIlt() {
    // let learnerguidearr = this.iltandViltForm.value.learnerguidearray;
    // let localarr: any = [];
    // learnerguidearr.map((arrayres: any) => {
    //   if (arrayres.name) {
    //     localarr.push(arrayres.name);
    //   } else {
    //     localarr.push(arrayres);
    //   }
    // });
    // this.learnerGuidearray = localarr;
    // this.iltandViltForm.value.learnerguidearray = this.learnerGuidearray;
    let savetype = { status: 'draft' };
    let totalObj = { ...this.iltandViltForm.value, ...savetype };
    console.log(this.learnerGuidearray);
    if (this.iltandViltForm.valid && this.commonCreateCourceForm.valid) {
      console.log(totalObj);
      //console.log(this.createCourceForm.value);
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
      this.commonCreateCourceForm.markAllAsTouched();
      this.iltandViltForm.markAllAsTouched();
      console.log(totalObj);
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

  certificationType(event: any) {
    if (event.target.value == 'yes') {
      this.showCertificateExpiry = true;
      console.log(this.createCourceForm.value);
    } else {
      this.showCertificateExpiry = false;
    }
  }

  externalVendor(event: any) {
    if ((event.target.value = 'yes')) {
      this.externalVendorname = true;
    } else {
      this.externalVendorname = false;
    }
  }

  isshowOverallmenu() {
    this.showCollapse = !this.showCollapse;
  }

  getlearningType(event: any) {
    console.log(event.target.value);
    this.learningType = event.target.value;
  }

}
