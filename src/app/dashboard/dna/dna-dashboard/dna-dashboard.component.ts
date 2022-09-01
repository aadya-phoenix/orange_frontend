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
  lableConstant: any = { french: {}, english: {} };
  dateFormate = dataConstant.dateFormate;
  RoleID = dataConstant.RoleID;
  isRom = false;
  isManager = false;
  isBussinessConsultant = false;
  isLearningPartner = false;
  isDomainExpert = false;
  getUserrole: any = {};
  trackerObj:any = [];
  today = new Date();
  activeTrackerObj :any=[];
  expiredTrackerObj :any=[];
  trackerId:number=0;
  learningList:any=[];
  learningListToShow:any=[];
  requestedTrackerList:any = [];
  userName:any;
  isAdmin = false;
  constructor(
    private authService: AuthenticationService,
    private dnaService:DnaService,
    private commonService:CommonService,
    private router:Router
  ) { 
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    if (localStorage.getItem('userName')) {
      this.userName = JSON.parse(localStorage.getItem('userName') as any);
    }
    this.getUserrole = this.authService.getRolefromlocal();
    this.isAdmin = this.userName.admin == 1 ? true: false;
    this.isRom = this.getUserrole.includes(this.RoleID.Rom);
    this.isBussinessConsultant = this.getUserrole.includes(this.RoleID.BussinessConsultant);
    this.isLearningPartner = this.getUserrole.includes(this.RoleID.LearningPartner);
    this.isDomainExpert = this.getUserrole.includes(this.RoleID.DomainExpert);
    this.today.setHours(0,0,0,0);
    this.isManager = this.authService.getProfileDetailsfromlocal().data?.manager == 1 ? true : false;
  }

  ngOnInit(): void {
    if(this.isManager){
      this.getTrackerList();
    }
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
    if(this.isLearningPartner || this.isRom || this.isDomainExpert || this.isBussinessConsultant){
    this.router.navigateByUrl(`/dashboard/dna/view-complete-report/${itemId}`); 
    }
  }

  review(itemId:any){
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
      if(element.close_date > this.today){
        element.isStart = true;
        this.activeTrackerObj.push(element);
      }
      else{
        element.isStart = false;
        this.expiredTrackerObj.push(element);
      }
    });
    this.getLearningList();
  },
  err=>{

  });
  }
}
