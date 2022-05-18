import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { VendorService } from 'src/app/shared/services/vendor/vendor.service';
import Swal from 'sweetalert2';
import { VendorManagementHistoryComponent } from '../vendor-management-history/vendor-management-history.component';
import { VendorManagementRatingComponent } from '../vendor-management-rating/vendor-management-rating.component';
import { VendorManagementStatusComponent } from '../vendor-management-status/vendor-management-status.component';

@Component({
  selector: 'app-vendor-management-view-report',
  templateUrl: './vendor-management-view-report.component.html',
  styleUrls: ['./vendor-management-view-report.component.scss']
})
export class VendorManagementViewReportComponent implements OnInit {
  vendorStatus = dataConstant.VendorStatus;
  dateTimeFormate = dataConstant.dateTimeFormate;
  dateFormate = dataConstant.dateFormate;
  RoleID = dataConstant.RoleID;
  vendorList: any = [];
  vendorListToShow: any = [];
  selectedStatus = this.vendorStatus.total;
  isReviewer = false;
  isPublisher = false;
  isRequester = false;
  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }
  vendor_count = {
    total: 0,
    active: 0,
    deactive: 0,
  }
  getUserrole: any;
  getprofileDetails: any;
  searchText: any;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  constructor(
    private vendorService: VendorService,
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
    this.route.queryParams
    .subscribe((params) => {
      if(params?.status){
        this.selectedStatus = params?.status;
      }
    }
  );
    this.refreshCourses();
  }

  viewRequest(item: any) {
    if (item && item.id) {
      this.router.navigateByUrl(`/dashboard/vendormanagement/view/${item.id}`);
    }
  }

  openModal(item: any) {
    const modalRef = this.modalService.open(VendorManagementHistoryComponent, {
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
      this.vendorListToShow = _.orderBy(this.vendorListToShow, column, direction);
    }
    else {
      this.showRecords(this.selectedStatus);
    }
  }

  pageChanged(event: any) {
    this.pagination.pageNumber = event;
  }

  showRecords(type: string) {
    if (type === this.vendorStatus.total) {
      this.vendorListToShow = this.vendorList.map((x: any) => Object.assign({}, x));
    } else {
      this.vendorListToShow = this.vendorList.filter((x: any) => { if (x.status === type) { return x } }).map((x: any) => Object.assign({}, x));
    }
    this.selectedStatus = type;
  }

  refreshCourses() {
    this.commonService.showLoading();
    this.vendorService.getVendorReport({}).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.vendorList = res.data.vendor;
          this.vendorList.forEach((data: any)=>{
            data.nfps_entity = JSON.parse(data.nfps_entity).join(',');
            data.training_offer = JSON.parse(data.training_offer).join(',');
            data.region = JSON.parse(data.region).join(',');
            data.location = JSON.parse(data.location).join(',');
          });
          this.vendor_count = res.data.vendor_count;
          this.showRecords(this.selectedStatus);
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        console.log(err);
      }
    );
  }

  editRequest(item: any) {
    if (item && item.id) {
      this.router.navigateByUrl(`/dashboard/vendormanagement/update/${item.id}`);
    }
  }

  statusChange(item: any) {
    const modalRef = this.modalService.open(VendorManagementStatusComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: `Request ${item.status == this.vendorStatus.active ? "Deactive" : "Active"}`,
      status: item.status == this.vendorStatus.active ? this.vendorStatus.deactive :  this.vendorStatus.active,
      data: item.id,
      objectDetail: item
    };
  }

  deleteRequest(vendor_id: number){
      Swal.fire({
        title: 'Are you sure want to remove?',
        text: 'You will not be able to recover this vendor!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          this.commonService.showLoading();
          this.vendorService.VendorDelete({vendor_id :vendor_id}).subscribe((res:any)=>{
            this.commonService.hideLoading();
            this.refreshCourses();
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
    commentRequest(item: any){
      const modalRef = this.modalService.open(VendorManagementRatingComponent, {
        centered: true,
        size: 'lg',
        windowClass: 'alert-popup',
      });
      modalRef.componentInstance.props = {
        data: item.id,
        objectDetail: item
      };
    }
}
