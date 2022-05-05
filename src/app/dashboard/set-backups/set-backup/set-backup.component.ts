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
  assignedRegion:any;
  assignedPublish:any;
  assignFlag:boolean=false;
  getRocDropdown:boolean=true;
  getPublisherDropdown:boolean=true;
  userEmail:any;
  id:any;
  newObj:any;
  newPubObj:any;
  userid: any;
  publisherUsername:any;
  publisherEmail:any;

  constructor(private courseService: CourcesService,
    private authService: AuthenticationService, private router: Router) {
    this.getUserrole = this.authService.getRolefromlocal();
   }

  ngOnInit(): void {
    console.log("new obj",localStorage);
    if(localStorage.getItem('assignedRoc')){
      this.newObj = JSON.parse(localStorage.getItem('assignedRoc') as any);
      if(this.newObj){
      this.userid = this.newObj.userid;
      this.userName = this.newObj.username;
      this.userEmail = this.newObj.email;
      this.assignFlag = this.newObj.objFlag;
      this.assignedRegion = this.newObj.region;
      this.getRocDropdown = this.newObj.dropdownFlag;
      }
    }
    else{
    console.log("getUserrole",this.getUserrole);
    this.getRocs();
    }
    if(localStorage.getItem('assignedPublisher')){
      this.newPubObj = JSON.parse(localStorage.getItem('assignedPublisher') as any);
      if(this.newPubObj){
      this.publisherUsername = this.newPubObj.pubusername;
      this.publisherEmail = this.newPubObj.pubemail;
      this.assignFlag = this.newPubObj.objFlag;
      this.assignedPublish = this.newPubObj.assignPublish;
      this.getPublisherDropdown = this.newPubObj.dropdownFlag;
      }
    }
    else{
    console.log("getUserrole",this.getUserrole);
    this.getPublisher();
    }
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
    for(let roc of this.rocObj){
      if(roc.id == this.id){
        this.assignedRegion = roc.name;
        console.log("roc region",this.assignedRegion);
      }
    }
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
        this.assignedPublish= item.first_name +" "+ item.last_name;
      }
    }
  }
  assignBackup(){
    console.log("id is ", this.id);
    this.assignFlag = true;
    this.getRocDropdown = false;
    this.getPublisherDropdown =  false;

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
    let assignRocObject={
      userid:this.userid,
      username:this.userName,
      email:this.userEmail,
      objFlag:this.assignFlag,
      region:this.assignedRegion,
      dropdownFlag:this.getRocDropdown
    };
    localStorage.setItem('assignedRoc',JSON.stringify(assignRocObject));

    let assignPublisherObject={
      pubusername:this.publisherUsername,
      pubemail:this.publisherEmail,
      objFlag:this.assignFlag,
      publisher:this.publisherUsername,
      assignPublish:this.assignedPublish,
      dropdownFlag:this.getPublisherDropdown
    };
    localStorage.setItem('assignedPublisher',JSON.stringify(assignPublisherObject));
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
    this.getRocDropdown= true;
    this.getPublisherDropdown=true;
    localStorage.removeItem('assignedRoc');
    localStorage.removeItem('assignedPublisher');
    this.courseService.removeBackup().subscribe((res:any)=>{
      location.reload();
    },(err:any)=>{
      console.log(err);
    });
    
    /* this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      
  }); */
  }

}