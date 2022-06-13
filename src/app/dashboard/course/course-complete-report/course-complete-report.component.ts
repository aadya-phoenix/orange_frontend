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
import Swal from 'sweetalert2';
import { CourseHistoryComponent } from '../course-history/course-history.component';

@Component({
  selector: 'app-course-complete-report',
  templateUrl: './course-complete-report.component.html',
  styleUrls: ['./course-complete-report.component.scss']
})
export class CourseCompleteReportComponent implements OnInit {

  public filterForm!: FormGroup;
  courseStatus = dataConstant.CourseStatus;
  dateTimeFormate = dataConstant.dateTimeFormate;
  dateFormate = dataConstant.dateFormate;
  RoleID = dataConstant.RoleID;
  courseList: any = [];
  addDate = false;
  courseListToShow: any = [];
  selectedStatus = this.courseStatus.total;
  isReviewer = false;
  isPublisher = false;
  isRequester = false;
  rocObj: any = [];
  publisherObj: any = [];
  learningTypes: any = [];
  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }
  course_count = {
    closed: 0,
    draft: 0,
    pending: 0,
    rejected: 0,
    submitted: 0,
    total: 0,
    transferred: 0
  }
  getUserrole: any;
  getprofileDetails: any;
  searchText: any;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  constructor(
    private fb: FormBuilder,
    private courseService: CourcesService,
    private commonService: CommonService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private courceService: CourcesService,
    private router: Router
  ) {
    this.getUserrole = this.authService.getRolefromlocal();
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.isReviewer = this.getUserrole.id === this.RoleID.CourseReviewer;
    this.isPublisher = this.getUserrole.id === this.RoleID.CoursePublisher;
    this.isRequester = this.getUserrole.id === this.RoleID.RequesterID;
    this.filterForm = this.fb.group({
      start_date: new FormControl('', []),
      end_date: new FormControl('', []),
      reporting_period: new FormControl('', []),
      learning_type: new FormControl('', []),
      status: new FormControl('', []),
      department: new FormControl('', []),
      roc: new FormControl('', []),
      publisher: new FormControl('', []),
    });
    this.filterForm.controls.start_date.valueChanges.subscribe((x: any) => {
      this.addDate = x ? true : false;
    })

  }

  ngOnInit(): void {
    if(this.isPublisher || this.isReviewer){
      this.getRoles();
    }
    this.getLearningType();
    this.refreshCourse({});
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
        this.commonService.errorHandling(err);
        this.commonService.hideLoading();
      }
    );
  }

  getRoles() {
    this.commonService.showLoading();
    this.courceService.getRoleUsers().subscribe((res: any) => {
      this.rocObj = res.data[this.RoleID.BackOfficeReviewer];
      this.publisherObj = res.data[this.RoleID.BackOfficePublisher];
      this.commonService.hideLoading();
    },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      });
  }

  viewRequest(item: any) {
    if (item && item.id) {
      this.router.navigateByUrl(`/dashboard/cct/view/${item.id}`);
    }
  }

  openModal(item: any) {
    const modalRef = this.modalService.open(CourseHistoryComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: 'View History',
      data: item.id,
      objectDetail: item,
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
  }

  reset() {
    this.filterForm.setValue({
      start_date: '',
      end_date: '',
      reporting_period: '',
      learning_type: '',
      status: '',
      department: '',
      roc: '',
      publisher: '',
    });
    this.refreshCourse({});
  }

  filterData() {
    const data = this.filterForm.value;
    this.refreshCourse(data);
  }

  refreshCourse(data: any) {
    this.commonService.showLoading();
    this.courseService.getCourseFilter(data).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.courseList = res.data.course;
          this.courseList.forEach((element: any) => {
            element.titleByLang = this.courceService.getTText(element.title);
          });
          this.course_count = res.data.course_count;
          this.showRecords(this.courseStatus.total);
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  exportExcel(){
    if (this.filterForm.value.reporting_period) {
      this.filterForm.value.start_date = '';
      this.filterForm.value.end_date = '';
    }
    const data = this.filterForm.value;
    data.type = dataConstant.ExporType.course;
    this.commonService.showLoading();
    this.commonService.exportAPI(data).subscribe(
      (res: any) => {
        if(res.status === 1){
          window.open(`${dataConstant.ImageUrl}/${res.data.url}`);
        }
        else{
          Swal.fire(
            'Information!',
            res.message,
            'warning'
          )
        }
        this.commonService.hideLoading();
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }


}
