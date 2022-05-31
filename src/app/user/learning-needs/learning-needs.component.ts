import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserManageService } from 'src/app/shared/services/user-management/user-manage.service';

@Component({
  selector: 'app-learning-needs',
  templateUrl: './learning-needs.component.html',
  styleUrls: ['./learning-needs.component.scss']
})
export class LearningNeedsComponent implements OnInit {

  learningNeedForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private userManageService:UserManageService,) {
      this.learningNeedForm = this.formBuilder.group({
        tracker_name: new FormControl('', [Validators.required]),
        tracker_desc: new FormControl('', []),
        start_date: new FormControl('', []),
        end_date: new FormControl('', [Validators.required]),
        language: new FormControl('', [Validators.required]),
        type: new FormControl('', []),
        training_db: new FormControl('', []),
        is_active:new FormControl('', [])
      });
     }

  ngOnInit(): void {
  }

  save(){}

}
