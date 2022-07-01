import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { DesignLearningService } from 'src/app/shared/services/design-learning/design-learning.service';

@Component({
  selector: 'app-design-learning-complete-report',
  templateUrl: './design-learning-complete-report.component.html',
  styleUrls: ['./design-learning-complete-report.component.scss']
})
export class DesignLearningCompleteReportComponent implements OnInit {

  dateFormate = dataConstant.dateFormate;
  dateTimeFormate = dataConstant.dateTimeFormate;
  designStatus = dataConstant.DesignStatus;
  designListToShow:any=[];
  designList:any =[];
  selectedStatus:any;
  design_count:any={
    closed: 0,
    draft: 0,
    pending: 0,
    rejected: 0,
    submitted: 0,
    total: 0,
    transferred: 0
  }
  searchText:string='';

  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;
  constructor(
    private commonService: CommonService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private designService: DesignLearningService,
    private authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.refreshModules();
  }

  refreshModules() {
    this.commonService.showLoading();
    this.designService.getModules().subscribe(
      (res: any) => {
        if (res.status === 1 && res.message === 'Success') {
          this.designList = res.data.new_learning;
          this.design_count = res.data.new_learning_count;
          this.showRecords(this.designStatus.total);
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
    /* if (item && item.id) {
      this.router.navigateByUrl(`/dashboard/cct/update/${item.id}`);
    } */
  }

  deleteRequest(course_id: number){
    /*   Swal.fire({
        title: 'Are you sure want to remove?',
        text: 'You will not be able to recover this request!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          this.commonService.showLoading();
          this.courceService.deleteCourse({course_id :course_id}).subscribe((res:any)=>{
            this.refreshCourses();
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
      }) */
  }

  copyRequest(course_id: number) {
     /*  Swal.fire({
        title: 'Are you sure you want to copy?',
        text: 'You will copy this request',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, copy it!',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          this.commonService.showLoading();
          this.designService.copyCourse({course_id :course_id}).subscribe((res:any)=>{
            this.commonService.hideLoading();
            this.refreshModules();
            Swal.fire(
              'Copied!',
              'Your request has been copyed.',
              'success'
            )
          },(err:any)=>{
            this.commonService.hideLoading();
            this.commonService.errorHandling(err);
          })
          
        }
      }) */
   }

   openModal(item: any) {
  /*   const modalRef = this.modalService.open(CourseHistoryComponent, {
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
    }; */
  }
  viewRequest(item: any){}

  onSort({ column, direction }: any) {
    this.headers.forEach((header: { sortable: any; direction: string; }) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction && column) {
      this.designListToShow = _.orderBy(this.designListToShow, column, direction);
    }
    else {
      this.showRecords(this.selectedStatus);
    }
  }

  pageChanged(event: any) {
    this.pagination.pageNumber = event;
  }

  showRecords(type: string) {
    if (type === this.designStatus.total) {
      this.designListToShow = this.designList.map((x: any) => Object.assign({}, x));
    } else {
      this.designListToShow = this.designList.filter((x: any) => { if (x.status_show === type) { return x } }).map((x: any) => Object.assign({}, x));
    }
    this.selectedStatus = type;
  }


}
