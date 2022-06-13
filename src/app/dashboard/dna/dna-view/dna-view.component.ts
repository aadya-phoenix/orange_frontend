import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { DnaService } from 'src/app/shared/services/dna/dna.service';
import { GeneralDropdownsService } from 'src/app/shared/services/general-dropdowns/general-dropdowns.service';

@Component({
  selector: 'app-dna-view',
  templateUrl: './dna-view.component.html',
  styleUrls: ['./dna-view.component.scss']
})
export class DnaViewComponent implements OnInit {

  dnaStatus = dataConstant.DnaStatus;
  selectedStatus = this.dnaStatus.total;
  learningList: any = [];
  learningListToShow: any = [];
  trackerId:any;

  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }

  priorityObj: any = [];
  countriesObj:any =[];
  bussinessUnitObj:any = [];
  regionsObj:any = [];

  tracker_details:any;
  type:number=0;
  isFrance = false;

  searchText: any;
  constructor(
    private commonService: CommonService,
    private dnaService:DnaService,
    private generalDrpdownsService: GeneralDropdownsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.trackerId = Id ? parseInt(Id) : 0;
      this.getTrackerDetail();
    });
    this.getLearningList();
    this.getPriority();
    this. getCountries();
    this. getRegions();
    this.getBusinessUnits();
  }

  redirect(){
    this.router.navigateByUrl(`/dashboard/dna/create/${this.trackerId}`);
  }

  getBUFilterRecords(item:any){
    if (item) {
      this.learningListToShow = [...this.learningList].filter((a, b) => {
        return a.business_unit_id == item
      });
    }  
    else{
      this.learningListToShow = this.learningList;
    }
  }
 
  getPriorityFilterRecords(item:any){
    if (item) {
      this.learningListToShow = [...this.learningList].filter((a, b) => {
        return a.priority_id == item
      });
    }  
    else{
      this.learningListToShow = this.learningList;
    }
  }

  getRegionFilterRecords(item:any){
    if (item) {
      this.learningListToShow = [...this.learningList].filter((a, b) => {
        return a.region_id == item
      });
    }  
    else{
      this.learningListToShow = this.learningList;
    }
  }

  getCountryFilterRecords(item:any){
    if (item) {
      this.learningListToShow = [...this.learningList].filter((a, b) => {
        return a.country == item
      });
    }  
    else{
      this.learningListToShow = this.learningList;
    }
  }

  getLearningList(){
    this.commonService.showLoading();
    this.dnaService.getDna().subscribe(
      (res: any) => {
        if(res.status == 1){
        this.commonService.hideLoading();
        this.learningList = res.data.digital_learning[this.trackerId];
        this.learningListToShow = res.data.digital_learning[this.trackerId];
        }
        else{
          this.commonService.hideLoading();
          this.commonService.toastErrorMsg('Error', res.message);
        }
      },(err:any)=>{
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      });
  }

  getTrackerDetail(){
    this.commonService.showLoading();
    this.dnaService.getTrackerDetail(this.trackerId).subscribe(
      (res: any) => {
        if(res.status == 1){
        this.commonService.hideLoading();
        this.tracker_details = res.data;
        this.type = this.tracker_details.type;
        this.type == 1 ? this.isFrance = true : this.isFrance = false;
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

  getCountries(){
    this.commonService.showLoading();
    this.generalDrpdownsService.getCountries().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.countriesObj= res.data;
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

  getBusinessUnits(){
    this.generalDrpdownsService.getBusinessUnits().subscribe( (res: any) => {
      this.commonService.hideLoading();
      this.bussinessUnitObj = res.data;
    },
    (err: any) => {
      this.commonService.hideLoading();
      this.commonService.toastErrorMsg('Error', err.message);
    }
  );
  }

  pageChanged(event: any) {
    this.pagination.pageNumber = event;
  }
 
}
