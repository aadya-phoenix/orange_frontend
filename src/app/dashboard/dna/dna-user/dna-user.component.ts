import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { UserManageService } from 'src/app/shared/services/user-management/user-manage.service';

@Component({
  selector: 'app-dna-user',
  templateUrl: './dna-user.component.html',
  styleUrls: ['./dna-user.component.scss']
})
export class DnaUserComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  userList: any = [];
  userListToShow: any = [];
  rolesList: any = [];
  searchText: string = '';
  first_name: any;
  last_name: any;
  email: any;
  isManager = false;

  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  constructor(
    private userManageService: UserManageService,
    private courceService: CourcesService,
    private commonService: CommonService,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.isManager = this.authService.getProfileDetailsfromlocal().data?.manager == 1 ? true : false;
  }

  ngOnInit(): void {
    if (this.isManager) {
      this.getUsers();
      this.getRole();
    }
  }


  showPaginationCount(pageStart: any, pageEnd: any, total: any) {
    return this.commonService.showPaginationCount(pageStart, pageEnd, total, this.lableConstant.showing_number_entries);
  }

  getRoleFilterRecords(role: any) {
    if (role) {
      this.userListToShow = [...this.userList].filter((a, b) => {
        return a.role_id == role
      });
    }
    else {
      this.userListToShow = this.userList;
    }
  }

  getUsers() {
    this.commonService.showLoading();
    this.userManageService.getUsers().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        let users = res.data;
        this.userList = users.filter((a: any) => {
          return (a.role_id == 5 || a.role_id == 12 || a.role_id == 13 || a.role_id == 14);
        });
        this.userListToShow = users.filter((a: any) => {
          return (a.role_id == 5 || a.role_id == 12 || a.role_id == 13 || a.role_id == 14);
        });
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  getRole() {
    this.courceService.getRole().subscribe(
      res => {
        let roles = res.data;
        this.rolesList = roles.filter((a: any) => {
          return (a.id == 5 || a.id == 12 || a.id == 13 || a.id == 14);
        });
      }, err => {
        console.log(err);
      });
  }

  navigate() {
    this.router.navigateByUrl('/dna/tracker');
  }

  /*  viewRequest(user: any) {
     if (user && user.id) {
       this.router.navigateByUrl(`/dna/user/edit/${user.id}`);
     }
   } */

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

}
