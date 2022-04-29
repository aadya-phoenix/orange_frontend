import { Component, OnInit } from '@angular/core';
import { CourseSessionService } from 'src/app/shared/services/course_session/course-session.service';

@Component({
  selector: 'app-session-publisher',
  templateUrl: './session-publisher.component.html',
  styleUrls: ['./session-publisher.component.scss']
})
export class SessionPublisherComponent implements OnInit {

  status:string='';

  constructor(private courseSessionService:CourseSessionService) { }

  ngOnInit(): void {
  }

  save(){
   this.courseSessionService.setSessionPublisherStatus({status:this.status}).subscribe((res:any)=>{
     console.log("status",this.status);
     console.log(res);
    },err=>{    
   }); 
  }

  onOffFunc(txt:string){
    this.status = txt ;
  }
}
