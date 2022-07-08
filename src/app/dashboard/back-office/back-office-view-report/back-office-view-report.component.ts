import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { BackOfficeService } from 'src/app/shared/services/back-office/back-office.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import Swal from 'sweetalert2';
import { BackOfficeHistoryComponent } from '../back-office-history/back-office-history.component';

@Component({
  selector: 'app-back-office-view-report',
  templateUrl: './back-office-view-report.component.html',
  styleUrls: ['./back-office-view-report.component.scss']
})
export class BackOfficeViewReportComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  public filterForm!: FormGroup;
  backOfficeStatus = dataConstant.BackOfficeStatus;
  dateTimeFormate = dataConstant.dateTimeFormate;
  dateFormate = dataConstant.dateFormate;
  RoleID = dataConstant.RoleID;
  backOfficeList: any = [];
  addDate = false;
  backOfficeListToShow: any = [];
  selectedStatus = this.backOfficeStatus.total;
  isReviewer = false;
  isPublisher = false;
  isRequester = false;
  publisherObj: any = [];
  rocObj: any = [];
  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }
  back_office_count = {
    total: 0,
    draft: 0,
    closed: 0,
    rejected: 0,
    pending: 0,
    submitted: 0,
    transferred: 0,
    expired: 0,
    publish: 0
  }
  getUserrole: any;
  getprofileDetails: any;
  searchText: any;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  constructor(
    private fb: FormBuilder,
    private backOfficeService: BackOfficeService,
    private commonService: CommonService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private router: Router,
    private courceService: CourcesService
  ) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.getUserrole = this.authService.getRolefromlocal();
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.isReviewer = this.getUserrole.id === this.RoleID.BackOfficeReviewer;
    this.isPublisher = this.getUserrole.id === this.RoleID.BackOfficePublisher;
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
    this.refreshBackOffice({});
    if(this.isPublisher || this.isReviewer){
      this.getRoles();
    }
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
      this.router.navigateByUrl(`/dashboard/back-office/view/${item.id}`);
    }
  }

  openModal(item: any) {
    const modalRef = this.modalService.open(BackOfficeHistoryComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: this.lableConstant.View_History,
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
      this.backOfficeListToShow = _.orderBy(this.backOfficeListToShow, column, direction);
    }
    else {
      this.showRecords(this.selectedStatus);
    }
  }

  pageChanged(event: any) {
    this.pagination.pageNumber = event;
  }

  showRecords(type: string) {
    if (type === this.backOfficeStatus.total) {
      this.backOfficeListToShow = this.backOfficeList.map((x: any) => Object.assign({}, x));
    } else {
      this.backOfficeListToShow = this.backOfficeList.filter((x: any) => { if (x.status_show === type) { return x } }).map((x: any) => Object.assign({}, x));
    }
    this.selectedStatus = type;
  }

  reset() {
    this.filterForm.setValue({
      start_date: '',
      end_date: '',
      reporting_period: '',
      roc: '',
      publisher: ''
    });
    this.refreshBackOffice({});
  }

  filterData() {
    const data = this.filterForm.value;
    this.refreshBackOffice(data);
  }

  refreshBackOffice(data: any) {
    this.commonService.showLoading();
    this.backOfficeService.getBackOfficeReport(data).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.backOfficeList = res.data.back_office;
          this.back_office_count = res.data.back_office_count;
          this.showRecords(this.backOfficeStatus.total);
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  exportExcel(){
    const data = this.filterForm.value;
    data.type = dataConstant.ExporType.back_office;
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
