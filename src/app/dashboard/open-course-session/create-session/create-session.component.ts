import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { CourseSessionService } from 'src/app/shared/services/course_session/course-session.service';
import * as XLSX from 'xlsx';

const numbersOnlyregexp = dataConstant.NumbersOnlyPattern;  
const currencyregexp = dataConstant.CurrencyPattern; 
const eurocurrencyregex= dataConstant.EuroCurrencyPattern;
@Component({
  selector: 'app-create-session',
  templateUrl: './create-session.component.html',
  styleUrls: ['./create-session.component.scss']
})
export class CreateSessionComponent implements OnInit {
  today = new Date();
  minStartDate = {};
  meridian = true;
  isSubmitted = false;
  session_id :number= 0;
  session_details: any = {};
  session_status:string='';
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

  countryObj: any;
  timeZoneObj: any;
  coursesList: any;
  pendingRequests: any;
  draftRequests: any = [];
  getUserrole: any;
  closedRequests: any = [];
  rejectedRequests: any = [];
  sessionCopyVal:any;
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
  metaArrayControl:any=[];
  data:any=[];
  newdata:any=[];
  backupCordinatorsList: any = [];
  sessionPub:boolean=false;
  closeResult:string = "";
  rejectcomment:string='';
  publishComment:string='';

  constructor(
    private fb: FormBuilder,
    private courseService: CourcesService,
    private commonService: CommonService,
    private authService:AuthenticationService,
    private courseSessionService: CourseSessionService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    this.minStartDate = `${this.today.getFullYear()}-${("0" + (this.today.getMonth() + 1)).slice(-2)}-${("0" + this.today.getDate()).slice(-2)}`;

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
      training_cost: new FormControl('0',Validators.pattern(eurocurrencyregex)),
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
        this.session_count = res.data.session_count;
      }
    }, (err: any) => {
      console.log(err);
    });
  }

  getSessionDetails() {
    this.commonService.showLoading();
    if(!this.session_id){
      this.commonService.hideLoading();
      this.addMetadata();
    }
    else{
      this.courseSessionService.getSessionDetails(this.session_id).subscribe((res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.session_details = res.data;
          console.log("session_status",res.data);
          this.session_status = this.session_details.status;
  
          this.createSessionForm.controls.title.setValue(this.session_details.title);
          this.createSessionForm.controls.region_id.setValue(this.session_details.region_id);
          const metadata = this.session_details.metadata;
          for (let meta of metadata){
            this.breaksArray = [];

            meta.delivery_method_id = JSON.parse(meta.delivery_method);
            meta.country_id  = JSON.parse(meta.country);
            meta.email = JSON.parse(meta.email_participant);
          
             if(meta.break != null){
             meta.break_data = JSON.parse(meta.break)
             for(let item of meta.break_data){
              this.breaksArray.push(this.fb.group({description:item.description,duration:item.duration}));
             }
             meta.breakArray = this.breaksArray;
            }
            else{
             meta.breakArray=[];
            }
            this.metadataArray.push(this.updateMetadata(meta));
           }
         }
        }, err => {
          this.commonService.hideLoading();
          this.commonService.toastErrorMsg('Error', err.message);
        });
      }
  }

  getRegionalCordinator() {
   this.courseService.getNewregionalCordinator().subscribe((res: any) => {
      this.rocObj = res.data;
    },(err: any) => {
      console.log(err);
    });
  }

  getDeliveryMethod() {
   this.courseService.getDeliveryMethod().subscribe(
     (res: any) => {
       this.deliveryMethod = res.data;
     },(err: any) => {
       console.log(err);
     });
  }

  getCountries() {
   this.courseService.getCountries().subscribe(
     (res: any) => {
       this.countryObj = res.data;
     },(err: any) => {
       console.log(err);
     });
  }
  //preferred instructor
  getPreferedInstructor() {
   this.courseService.getpreferedInstructor().subscribe(
     (res: any) => {
       this.preferedInstructor = _.map(res.data, function(x) { return {'email_id':x.email_id}});
     },(err: any) => {
       console.log(err);
     });
  }

  getTimezone() {
   this.courseService.getTimezone().subscribe(
     (res: any) => {
       this.timeZoneObj = res.data;
     },(err: any) => {
       console.log(err);
     });
  }

  getExternalVendor(){
    this.courseService.getVendor().subscribe(
      (res: any) => {
        this.vendor = res.data;
      },(err: any) => {
        console.log(err);
      });
  }

  copySession(session: any) {
    console.log("session",session.value);
    this.sessionCopyVal = session.value;
    this.breaksCopyArray=[];
    if(session.value.break != undefined){
     for(let item of this.sessionCopyVal.break){
      this.breaksCopyArray.push(this.fb.group({description:item.description,duration:item.duration}));
    }
    this.sessionCopyVal.breaksCopyArray = this.breaksCopyArray; 
   }
   else{
    this.sessionCopyVal.breaksCopyArray = session.break;  
   }
    this.metadataArray.push(this.addMoreMetadata(this.sessionCopyVal));
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
      external_vendor_name: new FormControl(sessionval.external_vendor_name),
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
      external_vendor_name: new FormControl(sessionval.external_vendor_name),
      manager_approval: new FormControl(sessionval.manager_approval),
      training_cost: new FormControl(sessionval.training_cost),
    })
  }

  removeSession(i: any) {
    this.metadataArray.removeAt(i);
  }

  createSession(status: any) {
    this.isSubmitted = true;
    if (this.createSessionForm.valid) {
      const sessionObj = this.createSessionForm.value;
      sessionObj.status = status;
      for(let meta of sessionObj.metadata){
        if(meta.breaksCopyArray){
          delete meta.breaksCopyArray;
        }
      }
      if(status =='publish'){
        sessionObj. status_comment =  this.publishComment;
      }
      console.log("session value", sessionObj);
      if (this.session_id == 0) {
        console.log("session id",this.session_id);
        this.commonService.showLoading();
        this.courseSessionService.createSession(sessionObj).subscribe(
          (res: any) => {
            this.commonService.hideLoading();
            this.commonService.toastSuccessMsg('Session', 'Successfully Created.');
            this.router.navigate(['/dashboard/sct']);
            console.log("res is", res);
          },
          (err: any) => {
          }
        );
      }
      else {
        sessionObj.session_id = this.session_id;
        console.log("not session id",this.session_id);
        this.commonService.showLoading();
        this.courseSessionService.updateSession(sessionObj).subscribe(
          (res: any) => {
            this.commonService.hideLoading();
            this.commonService.toastSuccessMsg('Session', 'Successfully Updated.');
            this.router.navigate(['/dashboard/sct']);
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
          this.preferedInstructor.push({
            email_id:newitem,
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
      this.getExternalVendor();
      this.metaControl =
        (<FormArray>this.createSessionForm.controls['metadata']).at(index);
      this.metaControl['controls'].external_vendor_name?.setValidators(Validators.required);;
    }
    else {
      this.metaControl = [];
      this.metaControl =
        (<FormArray>this.createSessionForm.controls['metadata']).at(index);
        this.metaControl['controls'].external_vendor_name.clearValidators();
      this.metaControl['controls']?.external_vendor_name.patchValue(
        '');
    }
  }

  newEmailParticipants(arr:any){
    debugger;
    return _.map(arr,(e)=>{this.preferedInstructor.push(e);
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
           this.router.navigate(['/dashboard/sct']);
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
      this.router.navigate(['/dashboard/sct']);
    }, (err: any) => {
      console.log(err)
    })
  }

  getBackupRegionalCordinator() {
    this.courseService.getBackupRegionalCordinator().subscribe(
      (res: any) => {
        this.backupCordinatorsList = res.data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  numbersOnly(val: any,sessIndex:number,breakIndex:number) {
   this.metaArrayControl= (<FormArray>(<FormGroup>this.metadataArray.controls[sessIndex]).controls.break).at(breakIndex);
  
   let ctrl = this.metaArrayControl.controls['duration'] as FormControl;
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
        this.metaArrayControl.patchValue(durationObj4);
        return;
      }
      let valduration = y.substring(0, 2) + ":" + y.substring(2, 4)

      var durationObj = { duration: valduration };
      this.metaArrayControl.patchValue(durationObj);
    }
    else {
      var durationObj1 = { duration: y };
      this.metaArrayControl.patchValue(durationObj1);
    }
    if (y > 2400) {
      var durationObj2 = { duration: '' };
      this.metaArrayControl.patchValue(durationObj2);
    } 
  }

}