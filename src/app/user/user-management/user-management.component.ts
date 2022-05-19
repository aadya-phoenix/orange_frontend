import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { UserManageService } from 'src/app/shared/services/user-management/user-manage.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  userObj:any=[];

  constructor(
    private userManageServicse:UserManageService,
    private commonService:CommonService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    this.commonService.showLoading();
    this.userManageServicse.getUsers().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.userObj = res.data;
        console.log('userObj',this.userObj);
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
    
  }

}
