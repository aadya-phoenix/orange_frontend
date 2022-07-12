import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CarouselService } from 'src/app/shared/services/carousel/carousel.service';
import { CarouselHistoryComponent } from '../carousel-history/carousel-history.component';
import * as _ from 'lodash';
import { CommonService } from 'src/app/shared/services/common/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carousel-list',
  templateUrl: './carousel-list.component.html',
  styleUrls: ['./carousel-list.component.scss']
})
export class CarouselListComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  carouselStatus = dataConstant.CarouselStatus;
  dateTimeFormate = dataConstant.dateTimeFormate;
  dateFormate = dataConstant.dateFormate;
  RoleID = dataConstant.RoleID;
  carouselList: any = [];
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
  //isReviewer = false;
//  isPublisher = false;
//  isRequester = false;
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
    private carouselService: CarouselService,
    private commonService: CommonService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.getUserrole = this.authService.getRolefromlocal();
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.isReviewer = this.getUserrole.id === this.RoleID.CarouselReviewer;
    this.isPublisher = this.getUserrole.id === this.RoleID.CarouselPublisher;
    this.isRequester = this.getUserrole.id === this.RoleID.RequesterID;
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        if(params?.status){
          this.selectedStatus = params?.status;
        }
      }
    );
    this.refreshCourses();
  }

  viewRequest(item: any) {
    if (item && item.id) {
      this.router.navigateByUrl(`/dashboard/olcarousel/view/${item.id}`);
    }
  }

  openModal(item: any) {
    const modalRef = this.modalService.open(CarouselHistoryComponent, {
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

  refreshCourses() {
    this.commonService.showLoading();
    this.carouselService.getCarousel().subscribe(
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

  editRequest(item: any) {
    if (item && item.id) {
      this.router.navigateByUrl(`/dashboard/olcarousel/update/${item.id}`);
    }
  }

  deleteRequest(carousel_id: number){
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
          this.carouselService.carouselDelete({carousel_id :carousel_id}).subscribe((res:any)=>{
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
      })
  }

  copyRequest(carousel_id: number) {
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
          this.carouselService.carouselCopy({carousel_id :carousel_id}).subscribe((res:any)=>{
            this.commonService.hideLoading();
            this.refreshCourses();
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
}