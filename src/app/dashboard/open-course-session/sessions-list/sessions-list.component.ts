import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';

import { CourseSessionService } from 'src/app/shared/services/course_session/course-session.service';
import * as _ from 'lodash';
import { SessionHistoryComponent } from '../session-history/session-history.component';
import Swal from 'sweetalert2';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Component({
  selector: 'app-sessions-list',
  templateUrl: './sessions-list.component.html',
  styleUrls: ['./sessions-list.component.scss']
})
export class SessionsListComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  courseSessionStatus = dataConstant.CourseSessionStatus;
  sessionList: any = [];
  sessionListToView: any = [];
  session_count={
    closed: 0,
    draft: 0,
    pending: 0,
    rejected: 0,
    submitted: 0,
    total: 0,
    transferred: 0
  }
  selectedStatus = this.courseSessionStatus.total;
  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }
  getUserprofile: any;
  getUserrole: any;
  searchText: any;
  getprofileDetails: any;
  
  public compare = (v1: string | number, v2: string | number) =>
    v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  constructor(
    private commonService: CommonService,
    private courseSessionService:CourseSessionService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.getUserrole = this.authService.getRolefromlocal();
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        if(params?.status){
          this.selectedStatus = params?.status;
        }
      }
    );
    this.refreshSessions();
  }

  showPaginationCount(pageStart:any, pageEnd:any, total:any) {
    return this.commonService.showPaginationCount(pageStart,pageEnd,total, this.lableConstant.showing_number_entries);
  }

  openModal(session: any) {
    const modalRef = this.modalService.open(SessionHistoryComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: 'View History',
      data: session.id,
      objectDetail: session,
      type: 'viewhistory'
    };
  }

  onSort({ column, direction }: any) {
    this.headers.forEach((header: { sortable: any; direction: string; }) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction && column) {
      this.sessionListToView = _.orderBy(this.sessionListToView, column, direction);
    }
    else {
      this.getrecords(this.selectedStatus);
    }
  }

  refreshSessions(){
    this.commonService.showLoading();
    this.courseSessionService.getSessions().subscribe((res:any)=>{
      this.commonService.hideLoading();
      if (res.status === 1 && res.message === 'Success') {
          this.sessionList = res.data.session;
          this.session_count = res.data.session_count;
          this.getrecords(this.selectedStatus)
       }
     },(err: any) => {
      this.commonService.hideLoading();
      this.commonService.errorHandling(err);
    });
  }

  getrecords(type: string) {
    if (type === this.courseSessionStatus.total) {
      this.sessionListToView = this.sessionList.map((x: any) => Object.assign({}, x));
    } else {
      this.sessionListToView = this.sessionList.filter((x: any) => { if (x.status_show === type) { return x } }).map((x: any) => Object.assign({}, x));
    }
    this.selectedStatus = type;
  }


  pageChanged(event: any) {
    this.pagination.pageNumber = event;
  }

  getRequest(session: any) {
    if (session && session.id) {
      this.router.navigateByUrl(`/dashboard/sct/view/${session.id}`);
    }
  }

  editRequest(session:any){
    if (session) {
      this.router.navigateByUrl(`/dashboard/sct/update/${session.id}`);
    }
  }

  deleteRequest(session:any){
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
         const id = session.id;
         this.courseSessionService.deleteSession({session_id:id}).subscribe((res:any)=>{
           this.refreshSessions();
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

 copyRequest(sessionId:any) {
  Swal.fire({
    title: 'Are you sure you want to copy?',
    text: 'You will copy this request',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, copy it!',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.value) {
      this.commonService.showLoading();
      this.courseSessionService.copySession({session_id :sessionId}).subscribe((res:any)=>{
        this.commonService.hideLoading();
        this.refreshSessions();
        Swal.fire(
          'Copied!',
          'Your request has been copied.',
          'success'
        )
      },(err:any)=>{
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      });
    }
  });
 }

}