import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { GetReportService } from 'src/app/shared/services/get-report/get-report.service';
import Swal from 'sweetalert2';
import { GetReportHistoryComponent } from '../get-report-history/get-report-history.component';

@Component({
  selector: 'app-get-report-list',
  templateUrl: './get-report-list.component.html',
  styleUrls: ['./get-report-list.component.scss']
})
export class GetReportListComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  report_id:number=0;
  reportStatus= dataConstant.GetReportStatus;
  attachUrl = dataConstant.ImageUrl;
  reportList:any = [];
  reportListToShow:any = [];
  selectedStatus = this.reportStatus.total;
  RoleID = dataConstant.RoleID;
  report_count = {
    total: 0,
    draft: 0,
    closed: 0,
    rejected: 0,
    pending: 0,
    submitted: 0,
    transferred: 0,
    publish: 0
  }

  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }

  isRoc = false;
  isDataAnalyst = false;
  isRequester = false;

  searchText:string='';
  getUserrole: any;
  getprofileDetails: any;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;
  constructor(
    private getReportService:GetReportService,
    private commonService: CommonService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;

    this.getUserrole = this.authService.getRolefromlocal();
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.isRoc = this.getUserrole.includes(this.RoleID.Roc);
    this.isDataAnalyst = this.getUserrole.includes(this.RoleID.DataAnalyst);
    this.isRequester = this.getprofileDetails.data?.staff == 1 ? true : false;
  }

  ngOnInit(): void {
    this.route.queryParams
    .subscribe(params => {
      if(params?.status){
        this.selectedStatus = params?.status;
      }
    }
  );
    this.refreshReports();
  }

  showPaginationCount(pageStart:any, pageEnd:any, total:any) {
    return this.commonService.showPaginationCount(pageStart,pageEnd,total, this.lableConstant.showing_number_entries);
  }
  
  viewRequest(item: any) {
    if (item && item.id) {
      this.router.navigateByUrl(`/dashboard/olreport/view/${item.id}`);
    }
  }

  openModal(item: any) {
    const modalRef = this.modalService.open(GetReportHistoryComponent, {
      centered: true,
      size: 'xl',
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
       this.reportListToShow = _.orderBy(this.reportListToShow, column, direction);
     }
     else {
       this.showRecords(this.selectedStatus);
     }
  }

  showRecords(type:string){
    if (type === this.reportStatus.total) {
      this.reportListToShow = this.reportList.map((x: any) => Object.assign({}, x));
    } else {
      this.reportListToShow = this.reportList.filter((x: any) => { if (x.status_show === type) { return x } }).map((x: any) => Object.assign({}, x));
    }
    this.selectedStatus = type;
  }

  refreshReports() {
    this.commonService.showLoading();
    this.getReportService.getReportList().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.reportList = res.data.get_report;
          this.reportList.forEach((x:any)=>{
            if(x.report_attachment){
              x.imgUrl = `${dataConstant.ImageUrl}/${x.report_attachment}`;
            }
          })
          this.report_count = res.data.get_report_count;
          this.showRecords(this.selectedStatus);
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  pageChanged(event: any) {
    this.pagination.pageNumber = event;
  }

  deleteRequest(report_id: number){
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
        this.getReportService.reportDelete({report_id :report_id}).subscribe((res:any)=>{
          this.refreshReports();
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

  copyRequest(report_id: number) {
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
          this.getReportService.reportCopy({report_id :report_id}).subscribe((res:any)=>{
            this.commonService.hideLoading();
            this.refreshReports();
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
      })
  }

  editRequest(item: any) {
    if (item && item.id) {
      this.router.navigateByUrl(`/dashboard/olreport/update/${item.id}`);
    }
  }

  repot(x:any){
    console.log("x",x);
  }
}
