import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';

@Component({
  selector: 'app-set-backup',
  templateUrl: './set-backup.component.html',
  styleUrls: ['./set-backup.component.scss']
})
export class SetBackupComponent implements OnInit {

  public rocObj: any;
  public publisherObj:any;
  userName:any;
  getUserrole: any;
  assignFlag:boolean=false;
  userEmail:any;
  id:any;
  userid: any;
  publisherUsername:any;
  publisherEmail:any;

  constructor(private courseService: CourcesService,
    private authService: AuthenticationService, private router: Router) {
    this.getUserrole = this.authService.getRolefromlocal();
   }

  ngOnInit(): void {
    console.log("getUserrole",this.getUserrole);
    this.getRocs();
    this.getPublisher();
  }

  getRocs(){
    this.courseService.getNewregionalCordinator().subscribe((res:any)=>{
      console.log("getregionalCordinator()",res.data);
          this.rocObj = res.data;
    },(err:any)=>{
      console.log(err);
    });
  }

  getUser(event: any){
   console.log("id is",event.target.value);
   this.id = event.target.value;
   this.courseService.getRoleUsers().subscribe((res: any) => {
    console.log("res data is ",res.data);
    for(let item of res.data[2]){
      if (item.region_id == this.id) {
        this.userid = item.id;
        this.userEmail  = item.email;
        this.userName = item.first_name+" "+item.last_name;
      }
    };
    for(let item of res.data[3]){
      if (item.region_id == this.id) {
        this.userid = item.id;
        this.userEmail  = item.email;
        this.userName = item.first_name+" "+item.last_name;
      }
    };
    for(let item of res.data[4]){
      if (item.region_id == this.id) {
        this.userid = item.id;
        this.userEmail  = item.email;
        this.userName = item.first_name+" "+item.last_name;
      }
    };
   });
  }

  getPublisherUser(event:any){
    console.log("id is",event.target.value);
    let id = event.target.value;
    for(let item of this.publisherObj){
      if(id == item.id){
        console.log("item",item);
        this.publisherUsername = item.first_name +" "+ item.last_name;
        this.publisherEmail= item.email;
      }
    }
  }
  assignBackup(){
    console.log("id is ", this.id);
    this.assignFlag = true;
    let transferid = {
      transfer_id: this.userid
    }
    let totalObj = {
      ...transferid
    }
     this.courseService.assignBackup(totalObj).subscribe((res:any)=>{
      console.log("assign backup", res.data);
    },(err:any)=>{
      console.log(err);
    }); 
  }

  getPublisher(){
    this.courseService.getNewPublisher().subscribe((res:any)=>{
      console.log("publishers",res.data);
          this.publisherObj = res.data;
    },(err:any)=>{
      console.log(err);
    });
  }
  
  removeBackup(){
    this.assignFlag = false;
    this.courseService.removeBackup().subscribe((res:any)=>{
      location.reload();
    },(err:any)=>{
      console.log(err);
    });
    /* this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      
  }); */
  }

}
