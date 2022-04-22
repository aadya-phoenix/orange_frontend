import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { CourseSessionService } from 'src/app/shared/services/course_session/course-session.service';

const numbersOnlyregexp = dataConstant.NumbersOnlyPattern;
/* const currencyregexp = dataConstant.CurrencyPattern; */

@Component({
  selector: 'app-create-session',
  templateUrl: './create-session.component.html',
  styleUrls: ['./create-session.component.scss']
})
export class CreateSessionComponent implements OnInit {

  public deliveryMethod: any;
  public preferedInstructor: any;
  countryObj:any;
  timeZoneObj:any;
  coursesList:any;
  pendingRequests:any;
  draftRequests:any =[];
  getUserrole: any;
  closedRequests:any=[];
  rejectedRequests:any=[];

  rocObj:any=[];
  public yesNo: any = [
    { id: 'yes', name: 'Yes' },
    { id: 'no', name: 'No' },
  ];

  public createSessionForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private courseService: CourcesService,
    private currencyPipe:CurrencyPipe,
    private courseSessionService:CourseSessionService,
    private router: Router,
    ) { 
      this.createSessionForm = this.fb.group({
        title: new FormControl('',[Validators.required]),
        region_id: new FormControl('',[Validators.required]),
        metadata:new FormArray([this.addMetaDataGroup() ]),
      });
    }

  ngOnInit(): void {
    //currency display in training cost
    /* this.createSessionForm.valueChanges.subscribe(form=>{
      if(form.metadata.training_cost){
        this.createSessionForm.patchValue({
          metadata.training_cost : this.currencyPipe.transform(form.metadata.training_cost.replace(/\D/g,'').replace(/^0+/,''),'EUR','symbol')
        },{emitEvent:false});
      }
    }); */
    this.getDeliveryMethod();
    this.getRegionalCordinator();
    this.getCountries();
    this.getPreferedInstructor();
    this.getTimezone();
   // this.addMetadata();
   // this.addSession('','','','','','','','','','','','','','','','','');
  }

  private addMetaDataGroup(): FormGroup {
    return this.fb.group({
      metadata_id:'',
      delivery_method: new FormControl('',[Validators.required]),
      country: new FormControl('',[Validators.required]),
      location:new FormControl('',[Validators.required]),
      instructor_name:new FormControl('',[Validators.required]),
      email_participant: new FormControl('',[Validators.required]),
      start_date: new FormControl('',[Validators.required]),
      start_time: new FormControl('',[Validators.required]),
      end_date: new FormControl('',[Validators.required]),
      end_time: new FormControl('',[Validators.required]),
      time_zone: new FormControl(''),
      break:new FormControl(),
     /*  break:this.fb.array([this.breakGroup()]), */
      comment: new FormControl(),
      min_registration: new FormControl('',[Validators.required,
        Validators.pattern(numbersOnlyregexp)]),
      max_registration: new FormControl('',[Validators.required,
        Validators.pattern(numbersOnlyregexp)]),
      registration_deadline: new FormControl('',[Validators.required]),
      availability: new FormControl('',[Validators.required]),
      external_vendor: new FormControl('',[Validators.required]),
      manager_approval: new FormControl(''),
      training_cost: new FormControl(''), 
    });
  }

  private breakGroup(): FormGroup {
    return this.fb.group({
      description:new FormControl(),
      duration:new FormControl() 
    });
  }

  addMetadata():void{
    this.metadataArray.push(this.addMetaDataGroup());
  }

  removeMetadata(index: number): void {
    this.metadataArray.removeAt(index);
  }

  addBreak(index:any):void{
    (<FormArray>(<FormGroup>this.metadataArray.controls[index]).controls.break).push(this.breakGroup());
  }

  get metadataArray(): FormArray {
    return <FormArray>this.createSessionForm.get('metadata');
  }
  getRegionalCordinator(){
    this.courseService.getregionalCordinator().subscribe((res:any)=>{
      console.log("getregionalCordinator()",res.data);
          this.rocObj = res.data;
      },(err:any)=>{
      console.log(err);
    });
  }

  getDeliveryMethod() {
    this.courseService.getDeliveryMethod().subscribe(
      (res: any) => {
        console.log("delivery",res);
        this.deliveryMethod = res.data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  getCountries(){
    this.courseService.getCountries().subscribe(
      (res: any) => {
        console.log("country",res);
        this.countryObj = res.data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  //prefered instructor
  getPreferedInstructor() {
    this.courseService.getpreferedInstructor().subscribe(
      (res: any) => {
        console.log(res);
        this.preferedInstructor = res.data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getTimezone(){
    this.courseService.getTimezone().subscribe(
      (res: any) => {
        console.log("time-zone",res);
        this.timeZoneObj = res.data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  get sessionArray():FormArray {
    return this.createSessionForm.get("metadata") as FormArray;
  }

 
  copySession(i:any){
    //return this.sessionArray.push(this.addMoreSession(this.sessionArray.value);
    //console.log(this.sessionArray.get("deliveryMethod")?.value);
  }

  
  removeSession(i:any){
    this.sessionArray.removeAt(i);
  }

  createSession(status:any){
    if(this.createSessionForm.valid){
     const sessionObj = this.createSessionForm.value;
     sessionObj.status = status;
     console.log("session value",sessionObj);
     this.courseSessionService.createSession(sessionObj).subscribe(
      (res: any) => {
        this.router.navigate(['/dashboard/opensession']);
        console.log("res is",res);
      },
      (err: any) => {
      }
    );
    }
    else{
      return;
    }
  }

  numbersOnly(val:any){
    console.log(val.key);
    let ctrl = this.sessionArray.get('duration') as FormControl;
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
        this.createSessionForm.patchValue(durationObj4);
        return;
      }
      let valduration = y.substring(0, 2) + ":" + y.substring(2, 4)

      var durationObj = { duration: valduration };
      this.createSessionForm.patchValue(durationObj);
    }
    else {
      var durationObj1 = { duration: y };
      this.createSessionForm.patchValue(durationObj1);
    }
    if (y > 2400) {
      var durationObj2 = { duration: '' };
      this.createSessionForm.patchValue(durationObj2);
    }
  }

  externalVendor(event:any){

  }
}