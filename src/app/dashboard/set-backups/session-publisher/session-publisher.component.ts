import { Component, OnInit } from '@angular/core';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourseSessionService } from 'src/app/shared/services/course_session/course-session.service';

@Component({
  selector: 'app-session-publisher',
  templateUrl: './session-publisher.component.html',
  styleUrls: ['./session-publisher.component.scss']
})
export class SessionPublisherComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  status:string='';
  onOffFlag:boolean =false;

  constructor(private courseSessionService:CourseSessionService, private commonService: CommonService) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
  }

  ngOnInit(): void {
   this.getSessionPublisherStatus();
  }

  getSessionPublisherStatus(){
    this.courseSessionService.getSessionPublisherStatus().subscribe(res=>{
      if(res.data.length>0){
        this.onOffFlag=true;
       }
       else{
         this.onOffFlag=false;
       }
    },err=>{
      this.commonService.errorHandling(err);
    });
   }

  save(){
    if(this.onOffFlag){
      this.status = 'on';
    }
    else{
      this.status = 'off';
    }
    this.courseSessionService.setSessionPublisherStatus({status:this.status}).subscribe((res:any)=>{
     
     localStorage.setItem('sessionPublisher',JSON.stringify(this.onOffFlag));
    },err=>{  
      this.commonService.errorHandling(err);  
   }); 
  }
}
