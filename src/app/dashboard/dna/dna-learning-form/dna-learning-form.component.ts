import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { DnaService } from 'src/app/shared/services/dna/dna.service';
import { GeneralDropdownsService } from 'src/app/shared/services/general-dropdowns/general-dropdowns.service';
import { GetReportService } from 'src/app/shared/services/get-report/get-report.service';

@Component({
  selector: 'app-dna-learning-form',
  templateUrl: './dna-learning-form.component.html',
  styleUrls: ['./dna-learning-form.component.scss']
})
export class DnaLearningFormComponent implements OnInit {

  public modalType: any;
  createDnaForm: FormGroup;

  bpStatusObj: any = [];
  countriesObj:any =[];
  locationsObj: any = [];
  priorityObj: any = [];
  regionsObj: any = [];
  bussinessUnitObj:any = [];

  regionId:number=0;
  title ='Add New Learning';
  isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private generalDrpdownsService: GeneralDropdownsService,
    private dnaService:DnaService,
    private getReportService:GetReportService,
    private commonService: CommonService,
    private router:Router) { 
    this.createDnaForm = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      number_of_participant: new FormControl('', [Validators.required]),
      priority_id: new FormControl('', [Validators.required]),
      management_code: new FormControl('', [Validators.required]),
      region_id: new FormControl(''),
      country: new FormControl('', [Validators.required]),
      business_unit_id: new FormControl('', [Validators.required]),
    });
  }


  ngOnInit(): void {
    this.getBpStatus();
    this.getLocations();
    this.getPriority();
    this.getRegions();
    this.getBusinessUnits();
  }

  getEvent(region:any){
   this.regionId = region.id;
   this.getCountries();
  }
 
  save(status:any){
    this.isSubmitted = true;
    if (this.createDnaForm.invalid) {
      return;
    }
    const body = this.createDnaForm.value;
    body.status = status;
    this.commonService.showLoading();
    this.dnaService.create(body).subscribe(
      (res: any) => {
        if(res == 1){
        this.commonService.hideLoading();
        this.commonService.toastSuccessMsg('New Learning', 'Successfully Saved.');
        this.router.navigateByUrl(`/dashboard/dna/create`);
        }
        else{
          this.commonService.hideLoading();
          this.commonService.toastErrorMsg('Error', res.message);
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  getBusinessUnits(){
    this.getReportService.getBusinessUnits().subscribe( (res: any) => {
      this.commonService.hideLoading();
      this.bussinessUnitObj = res.data;
    },
    (err: any) => {
      this.commonService.hideLoading();
      this.commonService.toastErrorMsg('Error', err.message);
    }
  );
  }

  getBpStatus(){
    this.commonService.showLoading();
    this.generalDrpdownsService.getBpStatus().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.bpStatusObj = res.data;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  getCountries(){
    this.commonService.showLoading();
    this.generalDrpdownsService.getCountries().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        let regions = res.data;
        this.countriesObj = regions.filter((x:any)=>x.region_id === this.regionId);
        console.log("coutries",this.countriesObj)
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  getLocations(){
    this.commonService.showLoading();
    this.generalDrpdownsService.getLocations().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.locationsObj = res.data;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  getRegions(){
    this.commonService.showLoading();
    this.generalDrpdownsService.getRegions().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
       this.regionsObj = res.data;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  getPriority(){
    this.commonService.showLoading();
    this.generalDrpdownsService.getPriority().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.priorityObj = res.data;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }
}
