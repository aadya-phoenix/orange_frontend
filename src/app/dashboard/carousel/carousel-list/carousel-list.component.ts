import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CarouselService } from 'src/app/shared/services/carousel/carousel.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { ViewHistoryComponent } from '../../create-course/view-history/view-history.component';

@Component({
  selector: 'app-carousel-list',
  templateUrl: './carousel-list.component.html',
  styleUrls: ['./carousel-list.component.scss']
})
export class CarouselListComponent implements OnInit {
  carouselStatus = dataConstant.CarouselStatus;
  carouselList: any = [];
  carouselListToShow: any = [];
  selectedStatus = this.carouselStatus.total;
  page = 1;
  pageNumber = 1;
  newPageNumber = 1;
  pageSize = 10;
  carousel_count = {
    total: 0,
    draft: 0,
    closed: 0,
    rejected: 0,
    pending: 0,
    submitted: 0,
    transferred: 0
  }
  startPageEntry: any;
  endPageEntry: any;
  newstartPageEntry: any;
  newendPageEntry: any;
  getUserprofile: any;
  getUserrole: any;
  searchText: any;
  draftRequests: any = [];
  public learningTypes: any;
  pendingRequests: any = [];
  transferredRequests: any = [];
  showbuttons: any;
  usersubmitRequests: any = [];
  rejectedRequests: any = [];
  closedRequests: any = [];
  submittedRequests: any = []
  allCourses: any;
  routegetdata: any;
  getprofileDetails: any;
  historylaststatus: any;
  coursedata: any = [];
  allcoursedataroc: any = [];
  allcoursedatapub: any = [];
  allcoursedatareq: any = [];
  i: number = 0;
  j: number = 0;
  public compare = (v1: string | number, v2: string | number) =>
    v1 < v2 ? -1 : v1 > v2 ? 1 : 0;


  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  constructor(
    private courceService: CourcesService,
    private carouselService: CarouselService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.getUserrole = this.authService.getRolefromlocal();
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.routegetdata = this.router.getCurrentNavigation()?.extras.state;
    if (!this.routegetdata) {
      this.router.navigateByUrl('/dashboard/carousel');
    }
    else {
      this.allCourses = this.pendingRequests;
      this.getrecords(this.pendingRequests);
    }
    console.log(this.getprofileDetails)

  }

  ngOnInit(): void {
    this.refreshCourses();
    if (this.routegetdata) {
      this.allCourses = this.pendingRequests;
    }
    this.startPageEntry = (this.pageSize * (this.pageNumber - 1)) + 1;
    this.endPageEntry = this.pageSize * this.pageNumber;

    this.newstartPageEntry = (this.pageSize * (this.newPageNumber - 1)) + 1;
    this.newendPageEntry = this.pageSize * this.newPageNumber;
  }

  viewRequest(item: any) {
    if (item && item.id) {
      this.router.navigateByUrl(`/dashboard/olcarousel/view/${item.id}`);
    }
  }

  openModal(course: any) {
    this.courceService.courseHistory(course.id).subscribe((res: any) => {
      console.log(res);
      if (res && res.status == 1) {
        const modalRef = this.modalService.open(ViewHistoryComponent, {
          centered: true,
          size: 'lg',
          windowClass: 'alert-popup',
        });
        modalRef.componentInstance.props = {
          title: 'View History',
          data: res.data,
          data1: course,
          type: 'viewhistory'
        };
      }
    })

  }

  service: any = {
    page: 1,
    pageSize: 5,
    maxSize: 2,
  };

  onSort({ column, direction }: any) {
    // this.headers.forEach((header: { sortable: any; direction: string; }) => {
    //   if (header.sortable !== column) {
    //     header.direction = '';
    //   }
    // });

    // if (direction === '' || column === '') {
    //   this.courcesList = this.courcesList;
    // } else {
    //   this.courcesList = [...this.courcesList].sort((a, b) => {
    //     const res = this.compare(a[column], b[column]);
    //     return direction === 'asc' ? res : -res;
    //   });
    // }
  }

  getNewFilterRecords(event: any) {
    console.log("eventtarget", event.target.value);
    this.getrecords(event.target.value);
  }
  getrecords(data: any) {
    // this.courcesList = data;
    // console.log(this.courcesList);
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
    this.carouselService.getCarousel().subscribe(
      (res: any) => {
        if (res.status === 1 && res.message === 'Success') {
          this.carouselList = res.data.carousel;
          this.carousel_count = res.data.carousel_count;
          this.showRecords(this.carouselStatus.total);
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getRequest(cource: any) {
    this.courceService.courseDetail(cource.id).subscribe((res: any) => {
      console.log(res);
      let coursedetail = res.data;
      let username = { user_name: cource.user_name, showbuttons: cource.purchase_order }
      this.router.navigateByUrl('/dashboard/cources/request-detail', {
        state: { ...coursedetail, ...username },
      });
    }, (err: any) => {
      console.log(err)
    });


  }

  editRequest(course: any) {
    this.router.navigateByUrl('/dashboard/cources/create-cource', {
      state: course,
    });
    console.log(course)
  }


  pageChanged(event: any) {
    console.log(event);
    this.pageNumber = event;
    this.startPageEntry = (this.pageSize * (this.pageNumber - 1)) + 1;
    this.endPageEntry = this.pageSize * this.pageNumber;
  }
  newPageChanged(event: any) {
    console.log(event);
    this.newPageNumber = event;
    this.newstartPageEntry = (this.pageSize * (this.newPageNumber - 1)) + 1;
    this.newendPageEntry = this.pageSize * this.newPageNumber;
  }

  GetCourseHistory(id: any): any {
    this.courceService.courseHistory(id).subscribe((res: any) => {
      console.log(res);
      if (res && res.status == 1) {
        let history = res.data;
        return history[history.length - 1].status;
      }
    })
  }

}
