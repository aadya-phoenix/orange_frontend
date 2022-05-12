import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { GetReportService } from 'src/app/shared/services/get-report/get-report.service';
import Swal from 'sweetalert2';
import { GetReportHistoryComponent } from '../get-report-history/get-report-history.component';

@Component({
  selector: 'app-get-report-complete-report',
  templateUrl: './get-report-complete-report.component.html',
  styleUrls: ['./get-report-complete-report.component.scss']
})
export class GetReportCompleteReportComponent implements OnInit {

  report_id:number=0;
  reportStatus= dataConstant.GetReportStatus;
  reportList:any = [];
  reportListToShow:any = [];
  selectedStatus = this.reportStatus.total;

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
    this.getUserrole = this.authService.getRolefromlocal();
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
  }

  ngOnInit(): void {
    this.refreshReports();
  }
  
  viewRequest(item: any) {
    if (item && item.id) {
      this.router.navigateByUrl(`/dashboard//view/${item.id}`);
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
          console.log("reports",res.data);
          this.reportList = res.data.get_report;
          this.report_count = res.data.get_report_count;
          this.showRecords(this.reportStatus.total);
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        console.log(err);
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
          })
          
        }
      })
  }
}
