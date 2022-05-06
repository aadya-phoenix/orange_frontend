import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { CourseSessionService } from 'src/app/shared/services/course_session/course-session.service';
import { SessionHistoryComponent } from '../session-history/session-history.component';

@Component({
  selector: 'app-session-complete-report',
  templateUrl: './session-complete-report.component.html',
  styleUrls: ['./session-complete-report.component.scss']
})
export class SessionCompleteReportComponent implements OnInit {

  public filterForm!: FormGroup;
  dateTimeFormate = dataConstant.dateTimeFormate;
  courseSessionStatus = dataConstant.CourseSessionStatus;
  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }
  session_count = {
    total: 0,
    draft: 0,
    closed: 0,
    rejected: 0,
    pending: 0,
    submitted: 0,
    publish: 0
  }
  sessionList: any = [];
  sessionListToShow: any = [];
  rocObj: any = [];
  getUserrole: any;
  getprofileDetails: any;
  searchText: any;
 
  selectedStatus = this.courseSessionStatus.total;
  addDate = false;
  isReviewer = false;
  isPublisher = false;
  isRequester = false;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  
  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private commonService: CommonService,
    private courseSessionService:CourseSessionService,
    private courceService:CourcesService,
    private modalService: NgbModal,
    private router: Router
  ) { 
    this.getUserrole = this.authService.getRolefromlocal();
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();

    this.filterForm = this.fb.group({
      start_date: new FormControl('', []),
      end_date: new FormControl('', []),
      reporting_period: new FormControl('', []),
      roc: new FormControl('', [])
    });
    this.filterForm.controls.start_date.valueChanges.subscribe((x: any) => {
      this.addDate = x ? true : false;
    });
  }

  ngOnInit(): void {
    this.refreshSessions({});
    this.getRocs();
  }

  refreshSessions(data:any){
    this.commonService.showLoading();
    this.courseSessionService.getsessionReport(data).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.sessionList = res.data.session;
          this.session_count = res.data.session_count;
          this.showRecords(this.courseSessionStatus.total);
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        console.log(err);
      }
    );
  }

  getRocs() {
   this.courceService.getRoleUsers().subscribe((res: any) => {
    for (let item of res.data[2]) {
     if (item.role_id == 3) {
         this.rocObj.push(item);
       }
    }
    for (let item of res.data[3]) {
      if (item.role_id == 3) {
        this.rocObj.push(item);
      }
    }
    for (let item of res.data[4]) {
      if (item.role_id == 3) {
        this.rocObj.push(item);
      }
    }
   },(err: any) => {
        console.log(err);
   });

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

  reset(){
    this.filterForm.setValue({
      start_date: '',
      end_date: '',
      reporting_period: '',
      roc:''
    });
    this.refreshSessions({});
  }

  filterData(){
   const data = this.filterForm.value;
   this.refreshSessions(data);
  }

  showRecords(type:string){
    if (type === this.courseSessionStatus.total) {
      this.sessionListToShow = this.sessionList.map((x: any) => Object.assign({}, x));
    } else {
      this.sessionListToShow = this.sessionList.filter((x: any) => { if (x.status_show === type) { return x } }).map((x: any) => Object.assign({}, x));
    }
    this.selectedStatus = type;
  }

  viewRequest(session:any){
    if (session && session.id) {
      this.router.navigateByUrl(`/dashboard/sct/view/${session.id}`);
    }
  }

  pageChanged(event: any) {
    this.pagination.pageNumber = event;
  }

  onSort({ column, direction }: any) {
    this.headers.forEach((header: { sortable: any; direction: string; }) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction && column) {
      this.sessionListToShow = _.orderBy(this.sessionListToShow, column, direction);
    }
    else {
      this.showRecords(this.selectedStatus);
    }
  }

}
