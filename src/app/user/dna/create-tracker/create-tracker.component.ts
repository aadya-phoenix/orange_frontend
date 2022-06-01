import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { DnaService } from 'src/app/shared/services/dna/dna.service';
import { GeneralDropdownsService } from 'src/app/shared/services/general-dropdowns/general-dropdowns.service';

@Component({
  selector: 'app-create-tracker',
  templateUrl: './create-tracker.component.html',
  styleUrls: ['./create-tracker.component.scss']
})
export class CreateTrackerComponent implements OnInit {

  learningNeedForm: FormGroup;
  languageObj:any=[];
  typeObj:any=[];
  trainingDataObj:any = [];
  isSubmitted=false;

  constructor(
    private formBuilder: FormBuilder,
    private courceService:CourcesService,
    private dnaService:DnaService,
    private generalService:GeneralDropdownsService,
    private commonService:CommonService) {
      this.learningNeedForm = this.formBuilder.group({
        title: new FormControl('', [Validators.required]),
        description: new FormControl('', []),
        open_date: new FormControl('', []),
        close_date: new FormControl('', [Validators.required]),
        type: new FormControl('', []),
        training_data: new FormControl('', []),
      });
     }

  ngOnInit(): void {
    this.getLanguages();
    this.getDnaType();
    this.getTrainingData();
  }

  save(status:any){
    this.isSubmitted = true;
    if (this.learningNeedForm.invalid) {
      return;
    }
    const body = this.learningNeedForm.value;
    body.status = status;
    this.commonService.showLoading();
    this.dnaService.createTracker(body).subscribe((res:any)=>{
      if(res.status == 1){
        this.commonService.hideLoading();
        this.commonService.toastSuccessMsg('New Tracker', 'Successfully Created.');
      }
      else{
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', res.message);
      }
    },err=>{
      this.commonService.hideLoading();
      this.commonService.toastErrorMsg('Error', err.message);
    });
  }

  getLanguages(){
    this.courceService.getLanguages().subscribe(res=>{
     this.languageObj = res.data;
    },err=>{
      console.log(err);
    });
  }

  getDnaType(){
    this.generalService.getDnaType().subscribe((res:any)=>{
      this.typeObj = res.data;
    },err=>{
      console.log(err);
    });
  }

  getTrainingData(){
    this.generalService. getTrainingData().subscribe((res:any)=>{
      this.trainingDataObj = res.data;
    },err=>{
      console.log(err);
    });
  }
}
