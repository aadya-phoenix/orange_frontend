import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CarouselService } from 'src/app/shared/services/carousel/carousel.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import Swal from 'sweetalert2';
import { CarouselHistoryComponent } from '../carousel-history/carousel-history.component';

@Component({
  selector: 'app-carousel-view-report',
  templateUrl: './carousel-view-report.component.html',
  styleUrls: ['./carousel-view-report.component.scss']
})
export class CarouselViewReportComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  public filterForm!: FormGroup;
  carouselStatus = dataConstant.CarouselStatus;
  dateTimeFormate = dataConstant.dateTimeFormate;
  dateFormate = dataConstant.dateFormate;
  RoleID = dataConstant.RoleID;
  carouselList: any = [];
  addDate = false;
  carouselListToShow: any = [];
  selectedStatus = this.carouselStatus.total;
  isReviewer = false;
  isPublisher = false;
  isRequester = false;
  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }
  carousel_count = {
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
    private carouselService: CarouselService,
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
    this.filterForm = this.fb.group({
      start_date: new FormControl('', []),
      end_date: new FormControl('', []),
      reporting_period: new FormControl('', []),
    });
    this.filterForm.controls.start_date.valueChanges.subscribe((x: any) => {
      this.addDate = x ? true : false;
    })

  }

  ngOnInit(): void {
    this.refreshCarousel({});
  }

  showPaginationCount(pageStart:any, pageEnd:any, total:any) {
    return this.commonService.showPaginationCount(pageStart,pageEnd,total, this.lableConstant.showing_number_entries);
  }

  viewRequest(item: any) {
    if (item && item.id) {
      this.router.navigateByUrl(`/dashboard/olcarousel/view/${item.id}`);
    }
  }

  openModal(item: any) {
    const modalRef = this.modalService.open(CarouselHistoryComponent, {
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


  onSort({ column, direction }: any) {
    this.headers.forEach((header: { sortable: any; direction: string; }) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction && column) {
      this.carouselListToShow = _.orderBy(this.carouselListToShow, column, direction);
    }
    else {
      this.showRecords(this.selectedStatus);
    }
  }

  pageChanged(event: any) {
    this.pagination.pageNumber = event;
  }

  showRecords(type: string) {
    if (type === this.carouselStatus.total) {
      this.carouselListToShow = this.carouselList.map((x: any) => Object.assign({}, x));
    } else {
      this.carouselListToShow = this.carouselList.filter((x: any) => { if (x.status_show === type) { return x } }).map((x: any) => Object.assign({}, x));
    }
    this.selectedStatus = type;
  }

  reset() {
    this.filterForm.setValue({
      start_date: '',
      end_date: '',
      reporting_period: '',
    });
    this.refreshCarousel({});
  }

  filterData() {
    const data = this.filterForm.value;
    this.refreshCarousel(data);
  }

  refreshCarousel(data: any) {
    this.commonService.showLoading();
    this.carouselService.getCarouselReport(data).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.carouselList = res.data.carousel;
          this.carousel_count = res.data.carousel_count;
          this.showRecords(this.carouselStatus.total);
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
    data.type = dataConstant.ExporType.carousel;
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
