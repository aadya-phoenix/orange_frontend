import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { SMEService } from 'src/app/shared/services/sme/sme.service';
import { SmedbHistoryComponent } from '../smedb-history/smedb-history.component';
import { SmedbRatingComponent } from '../smedb-rating/smedb-rating.component';
import { SmedbStatusComponent } from '../smedb-status/smedb-status.component';

@Component({
  selector: 'app-smedb-view-report',
  templateUrl: './smedb-view-report.component.html',
  styleUrls: ['./smedb-view-report.component.scss']
})
export class SmedbViewReportComponent implements OnInit {
  lableConstant: any = { french: {}, english: {}};
  smeStatus = dataConstant.SMEStatus;
  dateTimeFormate = dataConstant.dateTimeFormate;
  dateFormate = dataConstant.dateFormate;
  RoleID = dataConstant.RoleID;
  smeList: any = [];
  addDate = false;
  smeListToShow: any = [];
  selectedStatus = this.smeStatus.total;
  isReviewer = false;
  isPublisher = false;
  isRequester = false;
  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }
  sme_count = {
    total: 0,
    contecntSupport: 0,
    delivery: 0,
    voiceOver: 0
  }
  getUserrole: any;
  getprofileDetails: any;
  searchText: any;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  constructor(
    private smeService: SMEService,
    private commonService: CommonService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.getUserrole = this.authService.getRolefromlocal();
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.isReviewer = this.getUserrole.includes(this.RoleID.CarouselReviewer);
    this.isPublisher = this.getUserrole.includes(this.RoleID.CarouselPublisher);
    this.isRequester = this.getUserrole.includes(this.RoleID.RequesterID);

  }

  ngOnInit(): void {
    this.refreshCarousel({});
  }

  showPaginationCount(pageStart:any, pageEnd:any, total:any) {
    return this.commonService.showPaginationCount(pageStart,pageEnd,total, this.lableConstant.showing_number_entries);
  }

  viewRequest(item: any) {
    if (item && item.id) {
      this.router.navigateByUrl(`/dashboard/smedb/view/${item.id}`);
    }
  }

  openModal(item: any) {
    const modalRef = this.modalService.open(SmedbHistoryComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: 'View History',
      data: item.id,
      objectDetail: item,
      type: 'viewhistory'
    };
  }

  openRatingModal(item: any) {
    const modalRef = this.modalService.open(SmedbRatingComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: 'View History',
      data: item.id,
      objectDetail: item,
      type: 'viewhistory'
    };
  }

  statusChange(item: any) {
    const modalRef = this.modalService.open(SmedbStatusComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: `Request ${item.sme_status == this.smeStatus.active ? "Deactive" : "Active"}`,
      status: item.sme_status == this.smeStatus.active ? this.smeStatus.deactive :  this.smeStatus.active,
      data: item.id,
      objectDetail: item,
      isSMEStatus: true,
    };
    modalRef.componentInstance.passEntry.subscribe((res: any) => {
      this.filterData()
    });
  }


  onSort({ column, direction }: any) {
    this.headers.forEach((header: { sortable: any; direction: string; }) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction && column) {
      this.smeListToShow = _.orderBy(this.smeListToShow, column, direction);
    }
    else {
      this.showRecords(this.selectedStatus);
    }
  }

  pageChanged(event: any) {
    this.pagination.pageNumber = event;
  }

  showRecords(type: string) {
    if (type === this.smeStatus.total) {
      this.smeListToShow = this.smeList.map((x: any) => Object.assign({}, x));
    } else {
      this.smeListToShow = this.smeList.filter((x: any) => { if (x.domain.includes(type)) { return x } }).map((x: any) => Object.assign({}, x));
    }
    this.selectedStatus = type;
  }

  reset() {
    this.refreshCarousel({});
  }

  filterData() {
    this.refreshCarousel({});
  }

  refreshCarousel(data: any) {
    this.commonService.showLoading();
    this.smeService.getSMEDatabaseReport(data).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.smeList = res.data.sme;
          this.sme_count = res.data.sme_count;
          this.sme_count.contecntSupport = res.data.sme_count["content-support"];
          this.sme_count.delivery = res.data.sme_count["delivery"];
          this.sme_count.voiceOver = res.data.sme_count["voice-over-learning"];
          this.smeList.forEach((element: any) => {
            element.domain = JSON.parse(element.domain).join(', ');
          });
          this.showRecords(this.smeStatus.total);
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }


}
