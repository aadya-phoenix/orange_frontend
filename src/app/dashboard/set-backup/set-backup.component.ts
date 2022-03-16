import { Component, OnInit } from '@angular/core';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';

@Component({
  selector: 'app-set-backup',
  templateUrl: './set-backup.component.html',
  styleUrls: ['./set-backup.component.scss']
})
export class SetBackupComponent implements OnInit {

  public rocObj: any;
  userName:any;
  userEmail:any;
  id:any;

  constructor(private courseService: CourcesService) { }

  ngOnInit(): void {
    this.courseService.getregionalCordinator().subscribe(res=>{
      console.log("getregionalCordinator()",res.data);
          this.rocObj = res.data;
    },err=>{
      console.log(err);
    });

  }

  getUser(event: any){
   //console.log("id is",event.target.value);
   this.id = event.target.value;
   this.courseService.getRoleUsers().subscribe((res: any) => {
    console.log("res data is ",res.data);
    for(let item of res.data[2]){
      if (item.region_id==this.id){
        this.userEmail  = item.email;
        this.userName = item.first_name+" "+item.last_name;
      }
    };
    for(let item of res.data[3]){
      if (item.region_id==this.id){
        this.userEmail  = item.email;
        this.userName = item.first_name+" "+item.last_name;
      }
    };
    for(let item of res.data[4]){
      if (item.region_id==this.id){
        this.userEmail  = item.email;
        this.userName = item.first_name+" "+item.last_name;
      }
    };
   });
  }
  assign(){
    console.log("id is ",this.id);
    this.courseService.assignBackup(this.id).subscribe(res=>{
      console.log("assign backup",res.data);
    },err=>{
      console.log(err);
    });
  }

}
