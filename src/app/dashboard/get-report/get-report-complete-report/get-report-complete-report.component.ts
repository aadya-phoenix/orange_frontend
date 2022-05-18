import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
  selector: 'app-get-report-complete-report',
  templateUrl: './get-report-complete-report.component.html',
  styleUrls: ['./get-report-complete-report.component.scss']
})
export class GetReportCompleteReportComponent implements OnInit {
  public filterForm!: FormGroup;
  dateTimeFormate = dataConstant.dateTimeFormate;
  dateFormate = dataConstant.dateFormate;
  attachUrl = dataConstant.ImageUrl;
  RoleID = dataConstant.RoleID;
  addDate = false;
  report_id:number=0;
  reportStatus= dataConstant.GetReportStatus;
  reportList:any = [];
  reportListToShow:any = [];
  rocObj: any = [];
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

  isRoc = false;
  isDataAnalyst = false;
  isRequester = false;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;
  constructor(
    private fb: FormBuilder,
    private getReportService:GetReportService,
    private commonService: CommonService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private courceService: CourcesService
  ) { 
    this.getUserrole = this.authService.getRolefromlocal();
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.isRoc = this.getUserrole.id === this.RoleID.Roc;
    this.isDataAnalyst = this.getUserrole.id === this.RoleID.DataAnalyst;
    this.isRequester = this.getUserrole.id === this.RoleID.RequesterID;
    this.filterForm = this.fb.group({
      start_date: new FormControl('', []),
      end_date: new FormControl('', []),
      reporting_period: new FormControl('', []),
      roc: new FormControl('', []),
      publisher: new FormControl('', []),
    });
    this.filterForm.controls.start_date.valueChanges.subscribe((x: any) => {
      this.addDate = x ? true : false;
    })
  }

  ngOnInit(): void {
    this.refreshReports({});
    if(this.isDataAnalyst || this.isRoc){
      this.getRoles();
    }
  }

  getRoles() {
    this.commonService.showLoading();
    this.courceService.getRoleUsers().subscribe((res: any) => {
      this.rocObj = res.data[this.RoleID.Roc];
      this.commonService.hideLoading();
    },
      (err: any) => {
        this.commonService.hideLoading();
        console.log(err);
      });
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

  refreshReports(data: any) {
    this.commonService.showLoading();
    this.getReportService.getReportFilter(data).subscribe(
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

  reset() {
    this.filterForm.setValue({
      start_date: '',
      end_date: '',
      reporting_period: '',
      roc: '',
      publisher: ''
    });
    this.refreshReports({});
  }

  filterData() {
    const data = this.filterForm.value;
    this.refreshReports(data);
  }
}
