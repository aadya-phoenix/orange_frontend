import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { VendorTrainingService } from 'src/app/shared/services/vendor-training/vendor-training.service';
import { VendorTrainingHistoryComponent } from '../vendor-training-history/vendor-training-history.component';
import Swal from 'sweetalert2';
import * as _ from 'lodash';

@Component({
  selector: 'app-vendor-training-list',
  templateUrl: './vendor-training-list.component.html',
  styleUrls: ['./vendor-training-list.component.scss']
})
export class VendorTrainingListComponent implements OnInit {

  lableConstant: any = { french: {}, english: {} };
  vendor_id:number=0;
  vendorStatus= dataConstant.VendorTrainingStatus;
  attachUrl = dataConstant.ImageUrl;
  trainingList:any = [];
  trainingListToShow:any = [];
  selectedStatus = this.vendorStatus.total;
  RoleID = dataConstant.RoleID;
  vendor_count = {
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
    private vendorTrainingService:VendorTrainingService,
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
    this.getTrainingList();
  }

  showPaginationCount(pageStart:any, pageEnd:any, total:any) {
    return this.commonService.showPaginationCount(pageStart,pageEnd,total, this.lableConstant.showing_number_entries);
  }
  
  viewRequest(item: any) {
    if (item && item.id) {
      this.router.navigateByUrl(`/vendortraining/view/${item.id}`);
    }
  }

  openModal(item: any) {
    const modalRef = this.modalService.open(VendorTrainingHistoryComponent, {
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
       this.trainingListToShow = _.orderBy(this.trainingListToShow, column, direction);
     }
     else {
       this.showRecords(this.selectedStatus);
     }
  }

  showRecords(type:string){
    if (type === this.vendorStatus.total) {
      this.trainingListToShow = this.trainingList.map((x: any) => Object.assign({}, x));
    } else {
      this.trainingListToShow = this.trainingList.filter((x: any) => { if (x.status_show === type) { return x } }).map((x: any) => Object.assign({}, x));
    }
    this.selectedStatus = type;
  }

  getTrainingList() {
    this.commonService.showLoading();
    this.vendorTrainingService.getTrainingList().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.trainingList = res.data.external_vendor;
       /*    this.vendor_count = res.data.external_vendor_count; */
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

  deleteRequest(id: number){
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
        this.vendorTrainingService.delete({external_vendor_id :id}).subscribe((res:any)=>{
          this.getTrainingList();
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

 /*  copyRequest(vendor_id: number) {
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
          this.vendorTrainingService.copy({vendor_id :vendor_id}).subscribe((res:any)=>{
            this.commonService.hideLoading();
            this.getTrainingList();
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
  } */

  editRequest(item: any) {
    if (item && item.id) {
      this.router.navigateByUrl(`/vendortraining/update/${item.id}`);
    }
  }
}
