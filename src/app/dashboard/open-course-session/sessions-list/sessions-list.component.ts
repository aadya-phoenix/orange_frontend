import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { CourseSessionService } from 'src/app/shared/services/course_session/course-session.service';
import * as _ from 'lodash';
import { SessionHistoryComponent } from '../session-history/session-history.component';

@Component({
  selector: 'app-sessions-list',
  templateUrl: './sessions-list.component.html',
  styleUrls: ['./sessions-list.component.scss']
})
export class SessionsListComponent implements OnInit {
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
    private courceService: CourcesService,
    private courseSessionService:CourseSessionService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.getUserrole = this.authService.getRolefromlocal();
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    console.log(this.getprofileDetails);
    
  }

  ngOnInit(): void {
    this.refreshSessions();
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
    this.courseSessionService.getSessions().subscribe((res:any)=>{
      if (res.status === 1 && res.message === 'Success') {
          console.log("data",res.data);
          this.sessionList = res.data.session;
          this.session_count = res.data.session_count;
          this.getrecords(this.courseSessionStatus.total)
       }
     },(err: any) => {
      console.log(err);
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
      this.router.navigateByUrl(`/dashboard/opensession/view/${session.id}`);
    }
  }

  editRequest(session:any){
    if (session) {
      this.router.navigateByUrl(`/dashboard/opensession/update/${session.id}`);
    }
  }

  deleteRequest(session:any){
    alert('u sure u want to delete');
    if(session){
    const id = session.id;
    this.courseSessionService.deleteSession({session_id:id}).subscribe((res:any)=>{
      alert("deleted successfully");
      this.refreshSessions();
     },(err:any)=>{
    })
  }  
 }    

 
  copyRequest(session:any){
    if (session) {
      this.router.navigateByUrl(`/dashboard/opensession/update/${session.id}`);
    }
  }

}