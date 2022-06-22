import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { DnaService } from 'src/app/shared/services/dna/dna.service';

@Component({
  selector: 'app-dna-complete-report',
  templateUrl: './dna-complete-report.component.html',
  styleUrls: ['./dna-complete-report.component.scss']
})
export class DnaCompleteReportComponent implements OnInit {

  dnaStatus = dataConstant.DnaStatus;
  selectedStatus = this.dnaStatus.total;
  dateFormate = dataConstant.dateFormate;
  dnaList: any = [];
  dnaListToShow: any = [];

  learningList: any = [];
  learningListToShow: any = [];

  trackerId:any;
  trackerObj:any = [];

  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }
  business_consultant_count = {
    total: 0,
    draft: 0,
    closed: 0,
    close: 0,
    rejected: 0,
    forwarded:0,
    pending: 0,
    submitted: 0,
    transferred: 0,
    expired: 0,
    publish: 0,
    total_participant: 0
  };
  rom_count = {
    total: 0,
    draft: 0,
    closed: 0,
    close: 0,
    rejected: 0,
    forwarded:0,
    pending: 0,
    submitted: 0,
    transferred: 0,
    expired: 0,
    publish: 0,
    total_participant: 0
  };
  strategic_count ={
    strategic_1:0,
    strategic_2:0,
    strategic_3:0
  };
  dna_count = {
    total: 0,
    draft: 0,
    closed: 0,
    close: 0,
    rejected: 0,
    forwarded:0,
    pending: 0,
    submitted: 0,
    transferred: 0,
    expired: 0,
    publish: 0,
    digital_learning:0
  }
  searchText: any;
  constructor(
    private commonService: CommonService,
    private dnaService:DnaService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.trackerId = Id ? parseInt(Id) : 0;
      this.getLearningList(this.trackerId);
    });
    this.getTrackerList();
  }

  getTracker(event:any){
   let selectedTrackerId = event;
   if(event){
    this.getLearningList(selectedTrackerId);
   }
   else{
    this.getLearningList(this.trackerId);
   }
  }

  getTrackerList(){
    this.dnaService.getTrackerList().subscribe((res:any)=>{
      this.trackerObj = res.data.tracker;
     /*  this.trackerObj = this.trackerObj.filter((y:any)=> {
        if(y.id != this.trackerId){ 
        return y;
        }
      }); */
    },
    err=>{
    });
  }

  getLearningList(trackerId:any){
    this.commonService.showLoading();
    this.dnaService.dnaFullReport(trackerId).subscribe(
      (res: any) => {
        if(res.status == 1){
        this.commonService.hideLoading();
        this.learningListToShow = res.data.digital_learning;
        this.rom_count = res.data.digital_learning_count.rom_count;
        this.business_consultant_count = res.data.digital_learning_count.business_consultant_count;
        this.strategic_count = res.data.digital_learning_count.strategic_count;
        this.learningListToShow.forEach((x:any)=>{
          if(x.strategic){
           if(x.strategic == 'strategic_1'){
            x.strategic_name = 'Strategic for BU';
           }
           if(x.strategic == 'strategic_2'){
            x.strategic_name = 'Not strategic but action required';
           }
           if(x.strategic == 'strategic_3'){
            x.strategic_name = 'Not a priority or no action required';
           }
          }
         });
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

  showRecords(type: string) {
    if (type === this.dnaStatus.total) {
      this.dnaListToShow = this.dnaList.map((x: any) => Object.assign({}, x));
    } else {
      this.dnaListToShow = this.dnaList.filter((x: any) => { if (x.status_show === type) { return x } }).map((x: any) => Object.assign({}, x));
    }
    this.selectedStatus = type;
  }
}
