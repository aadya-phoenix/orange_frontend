import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewHistoryComponent } from '../view-history/view-history.component';
import { Router } from '@angular/router';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';
import * as _ from 'lodash';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
  public courcesList: any = [];
  courcesListData: any = [];
  public page = 1;
  public pageNumber = 1;
  public newPageNumber = 1;
  public pageSize = 10;
  public course_count = {
    closed: 0,
    draft: 0,
    pending: 0,
    rejected: 0,
    submitted: 0,
    total: 0,
    transferred: 0
  };

  startPageEntry: any;
  endPageEntry: any;
  newstartPageEntry: any;
  newendPageEntry: any;
  getUserprofile: any;
  getUserrole: any;
  collectionSize: any;
  searchText: any;
  searchStatus = '';
  draftRequests: any = [];
  public learningTypes: any;
  pendingRequests: any = [];
  transferredRequests: any = [];
  showbuttons: any;
  usersubmitRequests: any = [];
  rejectedRequests: any = [];
  closedRequests: any = [];
  submittedRequests: any = []
  allCourses: any;
  routegetdata: any;
  getprofileDetails: any;
  historylaststatus: any;

  coursedata: any = [];
  public statusArray: any = [
    { id: this.pendingRequests, name: 'Pending' },
    { id: this.usersubmitRequests, name: 'Submitted' },
    { id: this.draftRequests, name: 'Draft' },
    { id: this.closedRequests, name: 'Published' },
    { id: this.rejectedRequests, name: 'Rejected' },
  ];
  allcoursedataroc: any = [];
  allcoursedatapub: any = [];
  allcoursedatareq: any = [];
  i: number = 0;
  j: number = 0;
  public compare = (v1: string | number, v2: string | number) =>
    v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  constructor(
    private courceService: CourcesService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.getUserrole = this.authService.getRolefromlocal();
    //this.getUserrole = JSON.parse(this.authService.getRolefromlocal());
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.routegetdata = this.router.getCurrentNavigation()?.extras.state;
    if (!this.routegetdata) {
      this.router.navigateByUrl('/dashboard/cct');
    }
    else {
      this.allCourses = this.pendingRequests;
      this.getrecords(this.pendingRequests);
    }

  }

  openModal(course: any) {
    this.courceService.courseHistory(course.id).subscribe((res: any) => {
      if (res && res.status == 1) {
        const modalRef = this.modalService.open(ViewHistoryComponent, {
          centered: true,
          size: 'lg',
          windowClass: 'alert-popup',
        });
        modalRef.componentInstance.props = {
          title: 'View History',
          data: res.data,
          data1: course,
          type: 'viewhistory'
        };
      }
    })

  }

  service: any = {
    page: 1,
    pageSize: 5,
    maxSize: 2,
  };

  onSort({ column, direction }: any) {
    this.headers.forEach((header: { sortable: any; direction: string; }) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction && column) {
      this.courcesList = _.orderBy(this.courcesList, column, direction);
    }
    else {
      this.courcesList = this.courcesList;
    }
  }

  getLearningTypeFilterRecords(event: any) {
    if(this.courcesListData.length === 0){
      this.courcesListData = this.courcesList;
    }
    if (event) {
      this.courcesList = [...this.courcesListData].filter((a, b) => {
        return a.learning_type?.toLowerCase() == event.toLocaleLowerCase()
      });
    } else {
      this.courcesList = this.allCourses;
    }
  }

  getNewFilterRecords(event: any) {
    if(this.courcesListData.length === 0){
      this.courcesListData = this.courcesList;
    }
    if (this.searchStatus) {
      this.courcesList = [...this.courcesListData].filter((a, b) => {
        return a.status_show?.toLowerCase() == this.searchStatus.toLocaleLowerCase()
      });
    } else {
      this.courcesList = this.allCourses;
    }
  }
  getrecords(data: any) {
    this.courcesList = data;
    this.courcesListData = this.courcesList.map((x: any) => Object.assign({}, x));
  }

  refreshCourses() {
    this.pendingRequests = [];
    this.rejectedRequests = [];
    this.draftRequests = [];
    this.closedRequests = [];

    this.courceService.getCources().subscribe(
      (res: any) => {
        if (res.status == 1 && res.message == 'Success') {
          this.i = 0;
          this.j = 0;
          this.coursedata = res.data.course;
          this.course_count = res.data.course_count;
          for (this.i = 0; this.i < this.coursedata.length; this.i++) {
            this.coursedata[this.i]['titleByLang'] = this.courceService.getTText(this.coursedata[this.i]['title']);
            if (this.coursedata[this.i].request_id != "" && this.coursedata[this.i].request_id != null) {
              this.courcesList[this.j] = this.coursedata[this.i]
              if (this.getUserrole.id == 3) {
                if (((this.coursedata[this.i].publisher_status === 'reject' && this.coursedata[this.i].transfer_user_id != null) || (this.coursedata[this.i].status === 'pending') && this.coursedata[this.i].transfer_user_id == null && this.coursedata[this.i].user_id != this.getprofileDetails.data.id)) {
                  this.coursedata[this.i].purchase_order = this.coursedata[this.i].purchase_order + "#" + "true";
                  this.pendingRequests.push(this.coursedata[this.i])
                  this.allcoursedataroc.push(this.coursedata[this.i])
                  this.showbuttons = true;
                }
                if ((this.coursedata[this.i].status === 'pending' && this.coursedata[this.i].publisher_status != 'reject') && this.coursedata[this.i].transfer_user_id != null && this.coursedata[this.i].user_id != this.getprofileDetails.data.id) {
                  this.coursedata[this.i].purchase_order = this.coursedata[this.i].purchase_order + "#" + "false";
                  this.transferredRequests.push(this.coursedata[this.i])
                  this.allcoursedataroc.push(this.coursedata[this.i])
                }
              }
              else {
                if (this.coursedata[this.i].status === 'pending' && this.coursedata[this.i].user_id != this.getprofileDetails.data.id) {
                  this.coursedata[this.i].purchase_order = this.coursedata[this.i].purchase_order + "#" + "true";
                  this.pendingRequests.push(this.coursedata[this.i])
                  //this.allcoursedatareq.push(this.coursedata[this.i])
                  this.allcoursedatapub.push(this.coursedata[this.i])
                  this.showbuttons = true;
                }
              }
              if (this.coursedata[this.i].status === 'pending') {
                this.coursedata[this.i].purchase_order = this.coursedata[this.i].purchase_order + "#" + "true";
                this.usersubmitRequests.push(this.coursedata[this.i])
                //this.allcoursedataroc.push(this.coursedata[this.i])
                //this.allcoursedatareq.push(this.coursedata[this.i])
                //this.allcoursedatapub.push(this.coursedata[this.i])
                //this.showbuttons = false;
              }
              if (this.coursedata[this.i].status === 'pending' && this.coursedata[this.i].user_id == this.getprofileDetails.data.id) {
                this.coursedata[this.i].purchase_order = this.coursedata[this.i].purchase_order + "#" + "false";
                this.submittedRequests.push(this.coursedata[this.i])
                this.allcoursedataroc.push(this.coursedata[this.i])
                this.allcoursedatareq.push(this.coursedata[this.i])
                this.allcoursedatapub.push(this.coursedata[this.i])
                this.showbuttons = false;
              }
              if (this.coursedata[this.i].status === 'reject') {
                this.coursedata[this.i].purchase_order = this.coursedata[this.i].purchase_order + "#" + "true";
                this.rejectedRequests.push(this.coursedata[this.i])
                this.allcoursedataroc.push(this.coursedata[this.i])
                this.allcoursedatareq.push(this.coursedata[this.i])
                this.allcoursedatapub.push(this.coursedata[this.i])
                this.showbuttons = true;
              }
              if (this.coursedata[this.i].status === 'draft' && this.coursedata[this.i].user_id == this.getprofileDetails.data.id) {
                this.coursedata[this.i].purchase_order = this.coursedata[this.i].purchase_order + "#" + "false";
                this.draftRequests.push(this.coursedata[this.i])
                this.allcoursedataroc.push(this.coursedata[this.i])
                this.allcoursedatareq.push(this.coursedata[this.i])
                this.allcoursedatapub.push(this.coursedata[this.i])
                this.showbuttons = false;
              }
              if (this.coursedata[this.i].status === 'publish') {
                this.coursedata[this.i].purchase_order = this.coursedata[this.i].purchase_order + "#" + "false";
                this.closedRequests.push(this.coursedata[this.i])
                this.allcoursedataroc.push(this.coursedata[this.i])
                this.allcoursedatareq.push(this.coursedata[this.i])
                this.allcoursedatapub.push(this.coursedata[this.i])
                this.showbuttons = false;
              }

              this.j = this.j + 1;
            }
          }
          if (this.getUserrole.id == 3) {
            this.allCourses = this.allcoursedataroc;
          }
          else if (this.getUserrole.id == 2) {
            this.allCourses = this.allcoursedatareq;
          }
          else if (this.getUserrole.id == 4) {
            this.allCourses = this.allcoursedatapub;
          }
          //let course = this.courcesList;
          //this.courcesList = course.filter((d: any) => d.user_id == this.getprofileDetails.data.id || );
          //this.allCourses = this.allcoursedata;
          if (this.routegetdata && this.routegetdata.status) {
            this.courcesList = this.pendingRequests;
          }


          this.collectionSize = this.courcesList.length;
          // this.courcesList.map((course: any) => {

          //   //if(course.status === 'pending' && course.user_id != this.getprofileDetails.data.id){
          //   //  this.pendingRequests.push(course)
          //   //}
          //   //if(course.status === 'pending'){
          //   //  this.usersubmitRequests.push(course)
          //   //}
          //   //if(course.status === 'pending' && course.user_id == this.getprofileDetails.data.id){
          //   //  this.submittedRequests.push(course)
          //   //}
          //   //if(course.status === 'reject'){
          //   //  this.rejectedRequests.push(course)
          //   //}
          //   //if(course.status === 'draft'){
          //   //  this.draftRequests.push(course)
          //   //}
          //   //if(course.status === 'publish'){
          //   //  this.closedRequests.push(course)
          //   //}
          // })
        }
      },
      (err: any) => {
      }
    );
  }

  getRequest(cource: any) {
    this.courceService.courseDetail(cource.id).subscribe((res: any) => {
      let coursedetail = res.data;
      let username = { user_name: cource.user_name, showbuttons: cource.purchase_order }
      this.router.navigateByUrl('/dashboard/cct/request-detail', {
        state: { ...coursedetail, ...username },
      });
    }, (err: any) => {
    });


  }

  editRequest(course: any) {
    this.router.navigateByUrl('/dashboard/cct/create', {
      state: course,
    });
  }

  deleteRequest(course: any) {

    const modalRef = this.modalService.open(ViewHistoryComponent, {
      centered: true,
      size: 'sm',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: 'Delete Request',
      data3: course,
      type: 'delete'
    };
    modalRef.componentInstance.passEntry.subscribe((res: any) => {
      this.refreshCourses();
    });
    this.routegetdata = '';
    // this.courceService.deleteCourse({course_id :course.id}).subscribe((res:any)=>{
    //   this.refreshCourses();
    // },(err:any)=>{
    // })
  }

  copyRequest(course: any) {

    const modalRef = this.modalService.open(ViewHistoryComponent, {
      centered: true,
      size: 'sm',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: 'Copy Request',
      data3: course,
      type: 'copy'
    };
    modalRef.componentInstance.passEntry.subscribe((res: any) => {
      this.refreshCourses();
    });
    this.routegetdata = '';
  }

  //getLearning type
  getLearningType() {
    this.courceService.getLearningType().subscribe(
      (res: any) => {
        this.learningTypes = res.data;
      },
      (err: any) => {
      }
    );
  }

  pageChanged(event: any) {
    this.pageNumber = event;
    this.startPageEntry = (this.pageSize * (this.pageNumber - 1)) + 1;
    this.endPageEntry = this.pageSize * this.pageNumber;
  }
  newPageChanged(event: any) {
    this.newPageNumber = event;
    this.newstartPageEntry = (this.pageSize * (this.newPageNumber - 1)) + 1;
    this.newendPageEntry = this.pageSize * this.newPageNumber;
  }
  ngOnInit(): void {
    this.refreshCourses();
    this.getLearningType();
    if (this.routegetdata) {
      this.allCourses = this.pendingRequests;
    }
    this.startPageEntry = (this.pageSize * (this.pageNumber - 1)) + 1;
    this.endPageEntry = this.pageSize * this.pageNumber;

    this.newstartPageEntry = (this.pageSize * (this.newPageNumber - 1)) + 1;
    this.newendPageEntry = this.pageSize * this.newPageNumber;
  }
  GetCourseHistory(id: any): any {
    this.courceService.courseHistory(id).subscribe((res: any) => {
      if (res && res.status == 1) {
        let history = res.data;
        return history[history.length - 1].status;
      }
    })
  }
}
