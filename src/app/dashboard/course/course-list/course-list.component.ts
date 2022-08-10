import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import Swal from 'sweetalert2';
import { CourseHistoryComponent } from '../course-history/course-history.component';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  courseStatus = dataConstant.CourseStatus;
  dateTimeFormate = dataConstant.dateTimeFormate;
  dateFormate = dataConstant.dateFormate;
  selectedLearningType = "";
  learningTypes = [];
  RoleID = dataConstant.RoleID;
  courseList: any = [];
  courseListToShow: any = [];
  selectedStatus = this.courseStatus.total;
  isReviewer = false;
  isPublisher = false;
  isRequester = false;
  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }
  //isReviewer = false;
  //  isPublisher = false;
  //  isRequester = false;
  course_count = {
    closed: 0,
    draft: 0,
    pending: 0,
    rejected: 0,
    submitted: 0,
    total: 0,
    transferred: 0
  }
  getUserrole: any = [];
  getprofileDetails: any;
  searchText: any;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  constructor(
    private commonService: CommonService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private courceService: CourcesService,
    private authService: AuthenticationService,
  ) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.getUserrole = this.authService.getRolefromlocal();
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.isReviewer = this.getUserrole.includes(this.RoleID.Roc);
    this.isPublisher = this.getUserrole.includes(this.RoleID.CoursePublisher);
    this.isRequester = this.getUserrole.includes(this.RoleID.CourseRequester);
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        if (params?.status) {
          this.selectedStatus = params?.status;
        }
      }
      );
    this.getLearningType();
    this.refreshCourses();
  }

  showPaginationCount(pageStart:any, pageEnd:any, total:any) {
    return this.commonService.showPaginationCount(pageStart,pageEnd,total, this.lableConstant.showing_number_entries);
  }

  //getLearning type
  getLearningType() {
    this.commonService.showLoading();
    this.courceService.getLearningType().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.learningTypes = res.data;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  viewRequest(item: any) {
    if (item && item.id) {
      this.router.navigateByUrl(`/dashboard/cct/view/${item.id}`);
    }
  }

  openModal(item: any) {
    const modalRef = this.modalService.open(CourseHistoryComponent, {
      centered: true,
      size: 'xl',
      modalDialogClass: 'large-width',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: 'View History',
      data: item.id,
      objectDetail: item,
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
      this.courseListToShow = _.orderBy(this.courseListToShow, column, direction);
    }
    else {
      this.showRecords(this.selectedStatus);
    }
  }

  pageChanged(event: any) {
    this.pagination.pageNumber = event;
  }

  showRecords(type: string) {
    if (type === this.courseStatus.total) {
      this.courseListToShow = this.courseList.map((x: any) => Object.assign({}, x));
    } else {
      this.courseListToShow = this.courseList.filter((x: any) => { if (x.status_show === type) { return x } }).map((x: any) => Object.assign({}, x));
    }
    this.selectedStatus = type;
    this.selectedLearningType = this.selectedStatus === this.courseStatus.total ? "" : this.selectedLearningType;
  }

  getLearningTypeFilterRecords() {
    if (this.selectedStatus === this.courseStatus.total && this.selectedLearningType) {
      this.courseListToShow = this.courseList.filter((x: any) => { if (x.learning_type?.toLowerCase() == this.selectedLearningType.toLowerCase()) { return x } }).map((x: any) => Object.assign({}, x));
    } else if (this.selectedLearningType || this.selectedStatus !== this.courseStatus.total) {
      this.courseListToShow = this.courseList.filter((x: any) => { if ((x.status_show === this.selectedStatus && this.selectedLearningType && x.learning_type?.toLowerCase() == this.selectedLearningType.toLowerCase()) || (!this.selectedLearningType && x.status_show === this.selectedStatus)) { return x } }).map((x: any) => Object.assign({}, x));
    } else {
      this.courseListToShow = this.courseList.map((x: any) => Object.assign({}, x));
    }
  }

  getNewFilterRecords(event: any) {
    if (this.courseListToShow.length === 0) {
      this.courseListToShow = this.courseList;
    }
    if (event) {
      this.courseListToShow = [...this.courseListToShow].filter((a, b) => {
        return a.status_show?.toLowerCase() == event.toLocaleLowerCase()
      });
    }
    // else {
    //   this.courcesList = this.allCourses;
    // }
    //this.getrecords(event.target.value);
  }

  refreshCourses() {
    this.commonService.showLoading();
    this.courceService.getCources().subscribe(
      (res: any) => {
        if (res.status === 1 && res.message === 'Success') {
          this.courseList = res.data.course;
          this.courseList.forEach((element: any) => {
            element.titleByLang = this.courceService.getTText(element.title);
          });
          this.course_count = res.data.course_count;
          this.showRecords(this.selectedStatus);
        }
        this.commonService.hideLoading();
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  editRequest(item: any) {
    if (item && item.id) {
      this.router.navigateByUrl(`/dashboard/cct/update/${item.id}`);
    }
  }

  deleteRequest(course_id: number) {
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
        this.courceService.deleteCourse({ course_id: course_id }).subscribe((res: any) => {
          this.refreshCourses();
          Swal.fire(
            'Deleted!',
            'Your request has been deleted.',
            'success'
          )
        }, (err: any) => {
          this.commonService.hideLoading();
          this.commonService.errorHandling(err);
        })

      }
    })
  }

  copyRequest(course_id: number) {
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
        this.courceService.copyCourse({ course_id: course_id }).subscribe((res: any) => {
          this.commonService.hideLoading();
          this.refreshCourses();
          Swal.fire(
            'Copied!',
            'Your request has been copyed.',
            'success'
          )
        }, (err: any) => {
          this.commonService.hideLoading();
          this.commonService.errorHandling(err);
        })

      }
    })
  }

}
