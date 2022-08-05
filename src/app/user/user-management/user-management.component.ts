import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { UserManageService } from 'src/app/shared/services/user-management/user-manage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };

  userList:any=[];
  userListToShow:any=[];
  rolesList:any=[];
  searchText:string='';
  first_name : any;
  last_name : any;
  email  : any;

  activeUserList =[{id:1,name:'Active'},{id:0,name:'InActive'}];

  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  constructor(
    private userManageService:UserManageService,
    private courceService:CourcesService,
    private commonService:CommonService,
    private router: Router) {
      this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
     }

  ngOnInit(): void {
    this.getUsers();
    this.getRole();
  }

  getRoleFilterRecords(role:any){
     if (role) {
      this.userListToShow = [...this.userList].filter((a, b) => {
        return a.role_id.includes(role)
      });
    }  
    else{
      this.userListToShow = this.userList;
    }
  }

  getActiveFilterRecords(status:any){
    if (status) {
      this.userListToShow = [...this.userList].filter((a, b) => {
        return a.status == status
      });
    }  
    else{
      this.userListToShow = this.userList;
    }
  }

  getPdlFilterRecords(member:any){
    if (member) {
      this.userListToShow = [...this.userList].filter((a, b) => {
        return a.pdl_member == member
      });
    }  
    else{
      this.userListToShow = this.userList;
    }
  }

  getAdminFilterRecords(admin:any){
    if (admin) {
      this.userListToShow = [...this.userList].filter((a, b) => {
        return a.admin == admin
      });
    }  
    else{
      this.userListToShow = this.userList;
    }
  }

  getUsers(){
    this.commonService.showLoading();
    this.userManageService.getUsers().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.userList = res.data;
        this. userListToShow = res.data;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  viewRequest(user: any) {
    if (user && user.id) {
      this.router.navigateByUrl(`/user/edit/${user.id}`);
    }
  }

  deleteRequest(userId: any){
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this request!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.commonService.showLoading();
        this.userManageService.changeUserStatus({status:"0"},userId).subscribe((res:any)=>{
          this.commonService.hideLoading();
          this.getUsers();
          Swal.fire(
            'Deleted!',
            'Your request has been deleted.',
            'success'
          )
        },(err:any)=>{
          this.commonService.hideLoading();
          this.commonService.errorHandling(err);
        })
        
      }
    })
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
      let roles = res.data;
      this.rolesList = roles.filter((a:any) => {
        return a.status == 1
      });
     },err=>{
      this.commonService.errorHandling(err);
    });
  }
}
