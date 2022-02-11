import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-new-course',
  templateUrl: './create-new-course.component.html',
  styleUrls: ['./create-new-course.component.scss']
})
export class CreateNewCourseComponent implements OnInit {

  public createCourceForm!:FormGroup;

  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
    this.createCourceForm = this.fb.group({
      title:new FormControl(''),
      duration:new FormControl(''),
      learning_type:new FormControl(''),
      description:new FormControl(''),
      objective:new FormControl(''),
      resource:new FormControl(''),
      manager_approval:new FormControl(''),
      level:new FormControl(''),
      digital:new FormControl(''),
      certification:new FormControl(''),
      certification_expiry_type:new FormControl(''),
      validity_period:new FormControl(''),
      purchase_order:new FormControl(''),
      subject:new FormControl(''),
      external_vendor:new FormControl(''),
      email_training_contact:new FormControl(''),
      delivery_method:new FormControl(''),
      keyword:new FormControl(''),
      cost_of_training:new FormControl(''),
      learn_more:new FormControl(''),
      url:new FormControl(''),
      additionlComments:new FormControl(''),
      
    })
  }

  get f(){
    return this.createCourceForm.controls;
  }
  selectLearning(){
    // this.createCourceForm.setValue({
    //   name:new FormControl('Test')
    // })
  }

  

  createNewCource(){
    console.log(this.createCourceForm.value)
  }

}
