import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-vendor-training-form',
  templateUrl: './vendor-training-form.component.html',
  styleUrls: ['./vendor-training-form.component.scss']
})
export class VendorTrainingFormComponent implements OnInit {

  vendorForm:FormGroup;

  constructor(
    private fb:FormBuilder,
    
  ) {
    this.vendorForm = this.fb.group({
      name: new FormControl('',[]),
      region: new FormControl('',[]),
      country: new FormControl('',[]),
      location: new FormControl('',[]),
      training_date: new FormControl('',[]),
      time_zone: new FormControl('',[]),
      training_type: new FormControl('',[]),
      participant_detail: new FormControl('',[]),
      email: new FormControl('',[]),
      budget: new FormControl('',[]),
      code: new FormControl('',[]),
      quote: new FormControl('',[]),
      preference: new FormControl('',[]),
      contacts: new FormControl('',[]),
      details: new FormControl('',[]),
      duration: new FormControl('',[]),
    });
   }

  ngOnInit(): void {
  }

  copy(){}

  add(){}

  remove(){}

}
