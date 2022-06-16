import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { DnaService } from 'src/app/shared/services/dna/dna.service';

@Component({
  selector: 'app-dna-dashboard',
  templateUrl: './dna-dashboard.component.html',
  styleUrls: ['./dna-dashboard.component.scss']
})
export class DnaDashboardComponent implements OnInit {

  dateFormate = dataConstant.dateFormate;
  RoleID = dataConstant.RoleID;
  isRom = false;
  isBussinessConsultant = false;
  isLearningPartner = false;
  isDomainExpert = false;
  getUserrole: any = {};
  trackerObj:any = [];
  today = new Date();
  trackerId:number=0;
  learningList:any=[];
  learningListToShow:any=[];
  requestedTrackerList:any = [];

  constructor(
    private authService: AuthenticationService,
    private dnaService:DnaService,
    private commonService:CommonService,
    private router:Router
  ) { 
    this.getUserrole = this.authService.getRolefromlocal();
    this.isRom = this.getUserrole.id == this.RoleID.Rom;
    this.isBussinessConsultant = this.getUserrole.id == this.RoleID.BussinessConsultant;
    this.isLearningPartner = this.getUserrole.id == this.RoleID.LearningPartner;
    this.isDomainExpert = this.getUserrole.id == this.RoleID.DomainExpert;
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

  completeReport(itemId:any){
    this.router.navigateByUrl(`/dashboard/dna/view-complete-report/${itemId}`); 
  }

  review(itemId:any){
    console.log("isRom",this.isRom)
    if(this.isLearningPartner || this.isRom){
    this.router.navigateByUrl(`/dashboard/dna/view-rpt/${itemId}`); 
    }
    if(this.isDomainExpert || this.isBussinessConsultant){
      this.router.navigateByUrl(`/dashboard/dna/view-bp/${itemId}`); 
    }
  }

  getLearningList(){
    this.commonService.showLoading();
    this.dnaService.getDna().subscribe(
      (res: any) => {
        if(res.status == 1){
         this.commonService.hideLoading();
         this.learningList = res.data.digital_learning;
         for (const item in  this.learningList){
           this.requestedTrackerList.push(this.trackerObj.find((y:any)=> y.id == item));
         }
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
    this.trackerObj.forEach((element:any) => {
      element.close_date = new Date( element.close_date);
      console.log("close",element.close_date,this.today);
      if(element.close_date > this.today){
        element.isStart = true;
      }
      else{
        element.isStart = false;
      }
    });
    console.log("tracker",this.trackerObj);
    this.getLearningList();
  },
  err=>{

  });
  }
}
