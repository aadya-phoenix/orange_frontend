import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { CourseSessionService } from 'src/app/shared/services/course_session/course-session.service';
import * as XLSX from 'xlsx';

const numbersOnlyregexp = dataConstant.NumbersOnlyPattern;  
const currencyregexp = dataConstant.CurrencyPattern; 

@Component({
  selector: 'app-create-session',
  templateUrl: './create-session.component.html',
  styleUrls: ['./create-session.component.scss']
})
export class CreateSessionComponent implements OnInit {

  session_id = 0;
  session_details: any = {};
  session_count = {
    total: 0,
    draft: 0,
    closed: 0,
    rejected: 0,
    pending: 0,
    submitted: 0,
    transferred: 0
  };
  public deliveryMethod: any;
  public preferedInstructor: any;
  public externalVendorname: boolean = false;
  countryObj: any;
  timeZoneObj: any;
  coursesList: any;
  pendingRequests: any;
  draftRequests: any = [];
  getUserrole: any;
  closedRequests: any = [];
  rejectedRequests: any = [];
  vendor: any = [];
  rocObj: any = [];
  public yesNo: any = [
    { id: 'yes', name: 'Yes' },
    { id: 'no', name: 'No' },
  ];
  public createSessionForm!: FormGroup;
  breaksArray :any= [];
  breaksCopyArray:any=[];
  metaControl:any=[];

  data:any=[];
  newdata:any=[];
  backupCordinatorsList: any = [];
  //data:[][]=[[]];
  sessionPub:boolean=false;
  closeResult:string = "";
  rejectcomment:string='';
  publishComment:string='';

  constructor(
    private fb: FormBuilder,
    private courseService: CourcesService,
    private currencyPipe: CurrencyPipe,
    private authService:AuthenticationService,
    private courseSessionService: CourseSessionService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    this.createSessionForm = this.fb.group({
      title: new FormControl('', [Validators.required]),
      region_id: new FormControl('', [Validators.required]),
      metadata: this.fb.array([]),
    });

    this.getUserrole = this.authService.getRolefromlocal();
  }

  ngOnInit(): void {
    this.getSessionLists();
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.session_id = Id ? parseInt(Id) : 0;
      this.getSessionDetails();
    })
    this.getExternalVendor();
    this.getDeliveryMethod();
    this.getRegionalCordinator();
    this.getCountries();
    this.getPreferedInstructor();
    this.getTimezone();
    this.getSessionPublisherStatus();
    this.getBackupRegionalCordinator(); 
     
   /*  const metacontrols = (this.createSessionForm.get('metadata') as FormArray).controls[0].controls['external_vendor']; */
    
  }

  private metaDataGroup(): FormGroup {
    return this.fb.group({
      metadata_id: '',
      delivery_method: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      instructor_name: new FormControl('', [Validators.required]),
      email_participant: new FormControl('', [Validators.required]),
      start_date: new FormControl('', [Validators.required]),
      start_time: new FormControl('', [Validators.required]),
      end_date: new FormControl('', [Validators.required]),
      end_time: new FormControl('', [Validators.required]),
      time_zone: new FormControl(''),
      //break: new FormControl(''),
      break: this.fb.array([this.breakGroup()]),  
      comment: new FormControl(),
      min_registration: new FormControl('', [Validators.required,
      Validators.pattern(numbersOnlyregexp)]),
      max_registration: new FormControl('', [Validators.required,
      Validators.pattern(numbersOnlyregexp)]),
      registration_deadline: new FormControl('', [Validators.required]),
      availability: new FormControl('', [Validators.required]),
      external_vendor: new FormControl('', [Validators.required]),
      external_vendor_name:new FormControl(''),
      manager_approval: new FormControl(''),
      training_cost: new FormControl(''),
    });
  }

  private breakGroup(): FormGroup {
    return this.fb.group({
      description: new FormControl(),
      duration: new FormControl()
    });
  }

  addMetadata(): void {
    this.metadataArray.push(this.metaDataGroup());
  }

  removeMetadata(index: number): void {
    this.metadataArray.removeAt(index);
  }

  addBreak(index: any): void {
    console.log("meta array",index);
    (<FormArray>(<FormGroup>this.metadataArray.controls[index]).controls.break).push(this.breakGroup());
    
  }

   removeBreak(sessIndex: any,breakIndex:any): void{
    (<FormArray>(<FormGroup>this.metadataArray.controls[sessIndex]).controls.break).removeAt(breakIndex);
  } 
  
  get metadataArray(): FormArray {
    return <FormArray>this.createSessionForm.get('metadata');
  }

  getSessionLists() {
    this.courseSessionService.getSessions().subscribe((res: any) => {
      if (res.status === 1 && res.message === 'Success') {
        console.log("data", res.data);
        this.session_count = res.data.session_count;
      }
    }, (err: any) => {
      console.log(err);
    });
  }

  getSessionDetails() {
    if(!this.session_id){
      this.addMetadata();
    }
    else{
      this.courseSessionService.getSessionDetails(this.session_id).subscribe((res: any) => {
        if (res.status === 1 && res.message === 'Success') {
          this.session_details = res.data;
          console.log("resdetails data", this.session_details);
          this.createSessionForm.controls.title.setValue(this.session_details.title);
          this.createSessionForm.controls.region_id.setValue(this.session_details.region_id);
          const metadata = this.session_details.metadata;
          for (let meta of metadata){
            this.breaksArray = [];
            meta.delivery_method_id = JSON.parse(meta.delivery_method);
            meta.country_id  = JSON.parse(meta.country);
            meta.email = JSON.parse(meta.email_participant);
            console.log("meta break",meta.break);
            if(meta.external_vendor =='yes'){
              this.externalVendorname = true;
            }
            if(meta.break != null){
            meta.break_data = JSON.parse(meta.break)
            console.log("meta break",meta.break_data);
          for(let item of meta.break_data){
            this.breaksArray.push(this.fb.group({description:item.description,duration:item.duration}));
          }
          meta.breakArray = this.breaksArray;
        }
        else{
          meta.breakArray=[];
        }
            this.metadataArray.push(this.updateMetadata(meta));
            console.log("meta",meta);
          }
        }
      }
        , err => {
          console.log(err);
        });
    }
    
  }
  getRegionalCordinator() {
    this.courseService.getNewregionalCordinator().subscribe((res: any) => {
      console.log("getregionalCordinator()", res.data);
      this.rocObj = res.data;
    }, (err: any) => {
      console.log(err);
    });
  }

  getDeliveryMethod() {
    this.courseService.getDeliveryMethod().subscribe(
      (res: any) => {
        console.log("delivery", res);
        this.deliveryMethod = res.data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  getCountries() {
    this.courseService.getCountries().subscribe(
      (res: any) => {
        console.log("country", res);
        this.countryObj = res.data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  //preferred instructor
  getPreferedInstructor() {
    this.courseService.getpreferedInstructor().subscribe(
      (res: any) => {
        console.log(res);
        this.preferedInstructor = _.map(res.data, function(x) { return {'email_id':x.email_id}});
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getTimezone() {
    this.courseService.getTimezone().subscribe(
      (res: any) => {
        console.log("time-zone", res);
        this.timeZoneObj = res.data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getExternalVendor(){
    this.courseService.getVendor().subscribe(
      (res: any) => {
        this.vendor = res.data;
        console.log("vendor",this.vendor);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  copySession(session: any) {
    console.log("session is",session.value);
    console.log("session break",session.value.break);
    console.log("session is",session.value.country);
    if(session.external_vendor =='yes'){
      this.externalVendorname = true;
    } 
   this.breaksCopyArray=[];
    if(session.value.break != undefined){
      console.log("not undefined");
    for(let item of session.value.break){
      this.breaksCopyArray.push(this.fb.group({description:item.description,duration:item.duration}));
    }
    session.value.breaksCopyArray = this.breaksCopyArray; 
   }
   else{
     console.log("undefined");
    session.breaksCopyArray = session.break;  
    console.log("session.breaksCopyArray",session.breaksCopyArray) 
   }
    this.metadataArray.push(this.addMoreMetadata(session.value));
  }

  addMoreMetadata(sessionval:any):FormGroup{
    return this.fb.group({
      metadata_id: '',
      delivery_method: new FormControl(sessionval.delivery_method, [Validators.required]),
      country: new FormControl(sessionval.country, [Validators.required]),
      location: new FormControl(sessionval.location, [Validators.required]),
      instructor_name: new FormControl(sessionval.instructor_name, [Validators.required]),
      email_participant: new FormControl(sessionval.email_participant, [Validators.required]),
      start_date: new FormControl(sessionval.start_date, [Validators.required]),
      start_time: new FormControl(sessionval.start_time, [Validators.required]),
      end_date: new FormControl(sessionval.end_date, [Validators.required]),
      end_time: new FormControl(sessionval.end_time, [Validators.required]),
      time_zone: new FormControl(sessionval.time_zone),
      break: this.fb.array(sessionval.breaksCopyArray),  
      comment: new FormControl(sessionval.comment),
      min_registration: new FormControl(sessionval.min_registration, [Validators.required,
      Validators.pattern(numbersOnlyregexp)]),
      max_registration: new FormControl(sessionval.max_registration, [Validators.required,
      Validators.pattern(numbersOnlyregexp)]),
      registration_deadline: new FormControl(sessionval.registration_deadline, [Validators.required]),
      availability: new FormControl(sessionval.availability, [Validators.required]),
      external_vendor: new FormControl(sessionval.external_vendor, [Validators.required]),
      external_vendor_name: new FormControl(sessionval.external_vendor_name, [Validators.required]),
      manager_approval: new FormControl(sessionval.manager_approval),
      training_cost: new FormControl(sessionval.training_cost),
    })
  }

  updateMetadata(sessionval:any):FormGroup{
    return this.fb.group({
      metadata_id: '',
      delivery_method: new FormControl(sessionval.delivery_method_id, [Validators.required]),
      country: new FormControl(sessionval.country_id, [Validators.required]),
      location: new FormControl(sessionval.location, [Validators.required]),
      instructor_name: new FormControl(sessionval.instructor_name, [Validators.required]),
      email_participant: new FormControl(sessionval.email, [Validators.required]),
      start_date: new FormControl(sessionval.start_date, [Validators.required]),
      start_time: new FormControl(sessionval.start_time, [Validators.required]),
      end_date: new FormControl(sessionval.end_date, [Validators.required]),
      end_time: new FormControl(sessionval.end_time, [Validators.required]),
      time_zone: new FormControl(sessionval.time_zone),
      break: this.fb.array(sessionval.breakArray),
      comment: new FormControl(sessionval.comment),
      min_registration: new FormControl(sessionval.min_registration, [Validators.required,
      Validators.pattern(numbersOnlyregexp)]),
      max_registration: new FormControl(sessionval.max_registration, [Validators.required,
      Validators.pattern(numbersOnlyregexp)]),
      registration_deadline: new FormControl(sessionval.registration_deadline, [Validators.required]),
      availability: new FormControl(sessionval.availability, [Validators.required]),
      external_vendor: new FormControl(sessionval.external_vendor, [Validators.required]),
      external_vendor_name: new FormControl(sessionval.external_vendor_name, [Validators.required]),
      manager_approval: new FormControl(sessionval.manager_approval),
      training_cost: new FormControl(sessionval.training_cost),
    })
  }

  removeSession(i: any) {
    this.metadataArray.removeAt(i);
  }

  createSession(status: any) {
    console.log("value",this.createSessionForm.value);
    if (this.createSessionForm.valid) {
      const sessionObj = this.createSessionForm.value;
      sessionObj.status = status;
      if(status =='publish'){
        sessionObj. status_comment =  this.publishComment;
      }
      console.log("session value", sessionObj);
      if (!this.session_id) {
        this.courseSessionService.createSession(sessionObj).subscribe(
          (res: any) => {
            this.router.navigate(['/dashboard/opensession']);
            console.log("res is", res);
          },
          (err: any) => {
          }
        );
      }
      else {
        sessionObj.session_id = this.session_id;
        this.courseSessionService.updateSession(sessionObj).subscribe(
          (res: any) => {
            this.router.navigate(['/dashboard/opensession']);
          },
          (err: any) => {
          }
        );
      }
    }
    else {
      console.log("invalid form");
      return;
    }
  }

  onFileChange(event:any){
    const target = event.target;
    const reader:FileReader = new FileReader();
    reader.onload =(e:any)=>{
      const bstr:string = e.target.result;

      const wb:XLSX.WorkBook = XLSX.read(bstr,{type:'binary'});

      const wsname : string = wb.SheetNames[0];

      const ws:XLSX.WorkSheet = wb.Sheets[wsname];

      console.log(ws);

      this.data = (XLSX.utils.sheet_to_json(ws,{header:1}));

      console.log(this.data);

      for(let item of this.data){
        for(let newitem of item){
          this.preferedInstructor.push({email_id:newitem,
          /*   city: '',
          country: '',
          creation_date: null,
          department_description: '',
          department_manager: '',
          department_manager_cuid: '',
          emp_datasource: '',
          employee_cuid: '',
          first_name: '',
          functional_manager_cuid: '',
          id: null,
          last_name: '',
          legal_entity_code: '',
          legal_entity_description: '',
          m1_description: '',
          m2_description: '',
          m3_description: '',
          management_code: '',
          manager_emailid: '',
          manager_id: '',
          manager_name: '',
          manager_role: '',
          modified_date: null,
          name: '' ,
          name_prefix: '',
          organizational_relationship: '',
          p1_description: '',
          p2_description: '',
          password: '',
          region: '',
          staff_status: '',
          supervisor_of_others: '' */
          });
        }
      }
      console.log("newdata",this.preferedInstructor);
     // this.newEmailParticipants(this.newdata);
      /* this.data.map((e:any)=>{
          e.email_id=e;
          console.log("e",e);
      }); */
    };
    reader.readAsBinaryString(target.files[0]);
  }

  externalVendor(event: any, index: number) {
    if (event.id == 'yes') {
      this.metaControl = [];
      this.externalVendorname = true;
      console.log("validators",)
      this.getExternalVendor();
      this.metaControl =
        (<FormArray>this.createSessionForm.controls['metadata']).at(index);
      this.metaControl['controls'].external_vendor_name?.setValidators(Validators.required);;
    }
    else {
      this.metaControl = [];
      this.externalVendorname = false;
      this.metaControl =
        (<FormArray>this.createSessionForm.controls['metadata']).at(index);
        console.log("meta controls",this.metaControl);
        this.metaControl['controls'].external_vendor_name.clearValidators();
      this.metaControl['controls']?.external_vendor_name.patchValue(
        '');
    }
  }

  newEmailParticipants(arr:any){
    debugger;
    return _.map(arr,(e)=>{this.preferedInstructor.push(e);
    console.log("emailk",this.preferedInstructor);
    });
  }

  getSessionPublisherStatus(){
    this.courseSessionService.getSessionPublisherStatus().subscribe(res=>{
      if(res.data.length>0){
        this.sessionPub=true;
       }
       else{
         this.sessionPub=false;
       }
      console.log("res session publisher status",res.data);
      console.log("session pub flag",this.sessionPub);
    },err=>{
      console.log(err);
    });
   }

  open(content: any) {
    this.modalService
      .open(content, { size: "sm", backdrop: "static" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  publishRequest() {
   let publishobj = { session_id: this.session_id, status: 'publish', status_comment: this.publishComment };
     this.courseSessionService.changeStatusSession(publishobj).subscribe(
       (res: any) => {
         console.log(res);
         if (res) {
           this.router.navigate(['/dashboard/opensession']);
         }
       },
       (err: any) => {
         console.log(err);
       }
     );
  }

  reject() {
    let statusobj = { session_id: this.session_id, status: 'reject', status_comment: this.rejectcomment }
    this.courseSessionService.changeStatusSession(statusobj).subscribe((res: any) => {
      console.log(res);
      this.router.navigate(['/dashboard/opensession']);
    }, (err: any) => {
      console.log(err)
    })
  }

  getBackupRegionalCordinator() {
    this.courseService.getBackupRegionalCordinator().subscribe(
      (res: any) => {
        this.backupCordinatorsList = res.data;
        console.log("roc backup",this.backupCordinatorsList);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}