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
  searchText:string='';
  first_name : any;
  last_name : any;
  email  : any;

  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }

  constructor(
    private userManageServicse:UserManageService,
    private commonService:CommonService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsername(user:any){
   let id = user.id;
   this.first_name = user.first_name;
   this.last_name = user.last_name;
   this.email = user.email;
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

  pageChanged(event: any) {
    this.pagination.pageNumber = event;
  }

  

}
