import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';

@Component({
  selector: 'app-create-open-course',
  templateUrl: './create-open-course.component.html',
  styleUrls: ['./create-open-course.component.scss']
})
export class CreateOpenCourseComponent implements OnInit {

  public courcesList: any=[];
  public deliveryMethod: any;

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
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.createSessionForm = this.fb.group({
      event_title: new FormControl(''),
      region: new FormControl(''),
      delivery_method: new FormControl(''),
      country: new FormControl(''),
      email: new FormControl(''),
      start_date: new FormControl(''),
      start_time: new FormControl(''),
      end_date: new FormControl(''),
      end_time: new FormControl(''),
      time_zone: new FormControl(''),
      comments: new FormControl(''),
      min_registration: new FormControl(''),
      max_registration: new FormControl(''),
      reg_deadline: new FormControl(''),
      availability: new FormControl(''),
      external_vendor: new FormControl(''),
      manager_approval: new FormControl(''),
      training_cost: new FormControl(''),
      description: new FormControl(''),
      break_duration:new FormControl('')
    });

    this.getDeliveryMethod();
    this.getRegionalCordinator()
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

  numbersOnly(val:any){
    console.log(val.key);
    let ctrl = this.createSessionForm.get('duration') as FormControl;
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
