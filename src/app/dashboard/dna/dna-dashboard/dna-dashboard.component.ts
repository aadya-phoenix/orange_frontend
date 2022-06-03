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

  constructor(
    private dnaService:DnaService,
    private commonService:CommonService,
    private router:Router
  ) { 
    this.today.setHours(0,0,0,0);
  }

  ngOnInit(): void {
    this.getTrackerList();
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

  getTrackerList(){
  this.dnaService.getTrackerList().subscribe((res:any)=>{
    this.trackerObj = res.data.tracker;
  },
  err=>{

  });
  }
}
