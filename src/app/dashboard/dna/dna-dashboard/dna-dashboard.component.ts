import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { DnaService } from 'src/app/shared/services/dna/dna.service';

@Component({
  selector: 'app-dna-dashboard',
  templateUrl: './dna-dashboard.component.html',
  styleUrls: ['./dna-dashboard.component.scss']
})
export class DnaDashboardComponent implements OnInit {

  dateFormate = dataConstant.dateFormate;
  trackerObj:any = [];
  today = new Date();
  trackerId:number=0;
  learningList:any=[];
  learningListToShow:any=[];

  constructor(
    private dnaService:DnaService,
    private commonService:CommonService,
    private router:Router
  ) { 
    this.today.setHours(0,0,0,0);
  }

  ngOnInit(): void {
    this.getTrackerList();
    this.getLearningList();
  }

  addLearning(item:any){
     if (item.id) {
      this.router.navigateByUrl(`/dashboard/dna/create/${item.id}`);
    } 
  }

  managerData(item:any){
    if (item.id) {
      this.router.navigateByUrl(`/dashboard/dna/managersdata/${item.id}`); 
      }
  }

  viewReport(item:any){
    if (item.id) {
      this.router.navigateByUrl(`/dashboard/dna/view/${item.id}`); 
      }
  }

  completeReport(){
    this.router.navigateByUrl(`/dashboard/dna/view-complete-report`); 
  }

  review(){
    this.router.navigateByUrl(`/dashboard/dna/view-rpt`); 
  }

  getLearningList(){
    this.commonService.showLoading();
    this.dnaService.getDna().subscribe(
      (res: any) => {
        if(res.status == 1){
        this.commonService.hideLoading();
        this.learningList = res.data.digital_learning;
        this.learningListToShow = this.learningList.filter((x:any)=>x.tracker_id === this.trackerId);
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

  getTrackerList(){
  this.dnaService.getTrackerList().subscribe((res:any)=>{
    this.trackerObj = res.data.tracker;
  },
  err=>{

  });
  }
}
