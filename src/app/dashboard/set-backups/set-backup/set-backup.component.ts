import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';

@Component({
  selector: 'app-set-backup',
  templateUrl: './set-backup.component.html',
  styleUrls: ['./set-backup.component.scss']
})
export class SetBackupComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  public rocObj: any;
  public publisherObj:any;
  userName:any;
  backup_id:number=0;
  getUserrole: any;
  assignedRegion:any;
  assignedPublish:any;
  assignFlag:boolean=false;
  getRocDropdown:boolean=true;
  getPublisherDropdown:boolean=true;
  userEmail:any;
  id:any;
  publisherId:number=0;
  //pubId:number=0;
  newObj:any;
  newPubObj:any;
  userid: any;
  publisherUsername:any;
  publisherEmail:any;
  roleUsers:any;
  region_id:number=0

  constructor(private courseService: CourcesService,
    private authService: AuthenticationService, private router: Router, private commonService: CommonService ) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.getUserrole = this.authService.getRolefromlocal();
    this.getProfileDetails();
    this.getRoleUsers();
   }

  ngOnInit(): void {
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
    this.getPublisher();
    }
  }

  getRocs(){
    this.courseService.getNewregionalCordinator().subscribe((res:any)=>{
          this.rocObj = res.data;
    },(err:any)=>{
      this.commonService.errorHandling(err);  
    });
  }

  getUser(event: any){
   let id = event.target.value;
    for(let item of this.roleUsers.data[3]){
      if (item.region_id == id) {
        this.userid = item.id;
        this.id= item.id;
        this.region_id = item.region_id;
        this.userEmail  = item.email;
        this.userName = item.first_name+" "+item.last_name;
      }
    }
    for(let item of this.roleUsers.data[4]){
      if (item.region_id == this.id) {
        this.userid = item.id;
        this.userEmail  = item.email;
        this.userName = item.first_name+" "+item.last_name;
      }
    }
    for(let roc of this.rocObj){
      if(roc.id == this.id){
        this.assignedRegion = roc.name;
      }
    }
    
  }

  getPublisherUser(event:any){
    this.id = event.target.value;
    for(let item of this.publisherObj){
      if(this.id == item.id){
        this.publisherUsername = item.first_name +" "+ item.last_name;
        this.publisherEmail= item.email;
        this.assignedPublish= item.first_name +" "+ item.last_name;
      }
    }
  }
  assignBackup(){
    this.assignFlag = true;
    this.getRocDropdown = false;
    this.getPublisherDropdown =  false;

    let transferid = {
      transfer_id: this.id
    }
    let totalObj = {
      ...transferid
    }
    
     this.courseService.assignBackup(totalObj).subscribe((res:any)=>{
    },(err:any)=>{
      this.commonService.errorHandling(err); 
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
          this.publisherObj = res.data;
    },(err:any)=>{
      this.commonService.errorHandling(err); 
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
      this.commonService.errorHandling(err); 
    });
    
    /* this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      
  }); */
  }

  getProfileDetails(){
    this.authService.getProfileDetails().subscribe(res=>{
      this.backup_id = res.data.transfer_id;
      if(this.backup_id){
        this.assignFlag = true;
        this.courseService.getRoleUsers().subscribe((res: any) => {
          this.roleUsers = res;
          for(let item of this.roleUsers.data[3]){
            if (item.id == this.backup_id) {
              this.region_id = item.region_id;
              this.userEmail  = item.email;
              this.userName = item.first_name+" "+item.last_name;
            }
          };
          for(let item of this.roleUsers.data[4]){
            if (item.id == this.backup_id) {
              this.publisherUsername = item.first_name +" "+ item.last_name;
              this.publisherEmail= item.email;
              this.assignedPublish= item.first_name +" "+ item.last_name;
              this.publisherId=this.backup_id;
            }
          };
        },err=>{
          this.commonService.errorHandling(err); 
        });
       
      
      }
      else{
        this.assignFlag = false;
        
      }
    },err=>{
      this.commonService.errorHandling(err); 
    });
  }

  getRoleUsers(){
    this.courseService.getRoleUsers().subscribe((res: any) => {
      this.roleUsers = res;
    },err=>{
      this.commonService.errorHandling(err); 
    });
  }
}
