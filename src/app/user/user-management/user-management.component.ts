import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { UserManageService } from 'src/app/shared/services/user-management/user-manage.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  userList:any=[];
  rolesList:any=[];
  searchText:string='';
  first_name : any;
  last_name : any;
  email  : any;

  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  constructor(
    private userManageServicse:UserManageService,
    private courceService:CourcesService,
    private commonService:CommonService,
    private router: Router) { }

  ngOnInit(): void {
    this.getUsers();
    this.getRole();
  }

  getUsername(user:any){
   let id = user.id;
   this.first_name = user.first_name;
   this.last_name = user.last_name;
   this.email = user.email;
  }

  addUser(){
   this.router.navigateByUrl(`/user/create`);
  }

  getUsers(){
    this.commonService.showLoading();
    this.userManageServicse.getUsers().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.userList = res.data;
        console.log('userList',this.userList);
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  viewRequest(user: any) {
    if (user && user.id) {
      this.router.navigateByUrl(`/user/edit/${user.id}`);
    }
  }

  onSort({ column, direction }: any) {
    this.headers.forEach((header: { sortable: any; direction: string; }) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction && column) {
      this.userList = _.orderBy(this.userList, column, direction);
    }
    else {
      this.userList = this.userList;
    }
  }

  pageChanged(event: any) {
    this.pagination.pageNumber = event;
  }

  getRole(){
   this.courceService.getRole().subscribe(
     res=>{
       console.log('roles are',res.data);
       this.rolesList= res.data;
     },err=>{
      console.log(err);
    });
  }
}
