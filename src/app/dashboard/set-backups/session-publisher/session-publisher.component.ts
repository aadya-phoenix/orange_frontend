import { Component, OnInit } from '@angular/core';
import { CourseSessionService } from 'src/app/shared/services/course_session/course-session.service';

@Component({
  selector: 'app-session-publisher',
  templateUrl: './session-publisher.component.html',
  styleUrls: ['./session-publisher.component.scss']
})
export class SessionPublisherComponent implements OnInit {

  status:string='';
  onOffFlag:boolean =false;

  constructor(private courseSessionService:CourseSessionService) { }

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
      console.log(err);
    });
   }

  save(){
    console.log("session publisher",this.onOffFlag);
    if(this.onOffFlag){
      this.status = 'on';
    }
    else{
      this.status = 'off';
    }
    this.courseSessionService.setSessionPublisherStatus({status:this.status}).subscribe((res:any)=>{
     console.log("status",this.status);
     console.log(res);
     localStorage.setItem('sessionPublisher',JSON.stringify(this.onOffFlag));
    },err=>{    
   }); 
  }
}
