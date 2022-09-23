import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { MessageService } from 'src/app/shared/services/message/message.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  messageList:any=[];
  messageListToShow:any=[];
  rolesList:any=[];
  searchText:string='';
  first_name : any;
  last_name : any;
  email  : any;

  activeMessageList =[{id:1,name:'Active'},{id:0,name:'InActive'}];

  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  constructor(
    private messageService:MessageService,
    private courceService:CourcesService,
    private commonService:CommonService,
    private router: Router) {
      this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
     }

  ngOnInit(): void {
    this.getMessages();
  }

  showPaginationCount(pageStart:any, pageEnd:any, total:any) {
    return this.commonService.showPaginationCount(pageStart,pageEnd,total, this.lableConstant.showing_number_entries);
  }

  getMessages(){
    this.commonService.showLoading();
    this.messageService.getMessage().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.messageList = res.data;
        this. messageListToShow = res.data;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  viewRequest(user: any) {
    if (user && user.id) {
      this.router.navigateByUrl(`/message/edit/${user.id}`);
    }
  }

  deleteRequest(id: any){
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this message!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        // this.commonService.showLoading();
        // this.messageService.changeUserStatus({status:"0"},userId).subscribe((res:any)=>{
        //   this.commonService.hideLoading();
        //   this.getUsers();
        //   Swal.fire(
        //     'Deleted!',
        //     'Your request has been deleted.',
        //     'success'
        //   )
        // },(err:any)=>{
        //   this.commonService.hideLoading();
        //   this.commonService.errorHandling(err);
        // })
        
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
      this.messageList = _.orderBy(this.messageList, column, direction);
    }
    else {
      this.messageList = this.messageList;
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
