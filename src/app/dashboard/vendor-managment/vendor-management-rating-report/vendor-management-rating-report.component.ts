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
import { VendorService } from 'src/app/shared/services/vendor/vendor.service';
import Swal from 'sweetalert2';
import { VendorManagementHistoryComponent } from '../vendor-management-history/vendor-management-history.component';
import { VendorManagementRatingComponent } from '../vendor-management-rating/vendor-management-rating.component';
import { VendorManagementStatusComponent } from '../vendor-management-status/vendor-management-status.component';

@Component({
  selector: 'app-vendor-management-rating-report',
  templateUrl: './vendor-management-rating-report.component.html',
  styleUrls: ['./vendor-management-rating-report.component.scss']
})
export class VendorManagementRatingReportComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  public filterForm!: FormGroup;
  vendorStatus = dataConstant.VendorStatus;
  status= [{name:'Active', value:'active'},{name:'Deactive', value:'deactive'}];
  overallRatings= [];
  CCTOfferTraining = [];
  CCTLearningLocation = [];
  CCTNfpsEntity = [];
  cordinatorsList = [];
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
    private fb: FormBuilder,
    private vendorService: VendorService,
    private commonService: CommonService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private courseService: CourcesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.getUserrole = this.authService.getRolefromlocal();
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.filterForm = this.fb.group({
      status: new FormControl('', []),
      created_by: new FormControl('', []),
      vendor_name: new FormControl('', []),
      epurchase: new FormControl('', []),
      other_training_offer: new FormControl('', []),
      overall_rating: new FormControl(null, []),
      nfps_entity: new FormControl(null, []),
      region: new FormControl('', []),
      location: new FormControl('', []),
      training_offer: new FormControl('', []),
    });
  }

  ngOnInit(): void {
    this.route.queryParams
    .subscribe((params) => {
      if(params?.status){
        this.selectedStatus = params?.status;
      }
    }
  );
   this.getCordinators();
  }

  showPaginationCount(pageStart:any, pageEnd:any, total:any) {
    return this.commonService.showPaginationCount(pageStart,pageEnd,total, this.lableConstant.showing_number_entries);
  }
  
  getCordinators() {
    this.commonService.showLoading();
    this.courseService.getNewregionalCordinator().subscribe(
      (res: any) => {
         this.cordinatorsList = res.data;
        this.getCCTLearningLocation();
      },
      (err: any) => {
        this.commonService.errorHandling(err); 
        this.commonService.hideLoading();
      }
    );
  }

  getCCTLearningLocation() {
    this.commonService.showLoading();
    this.vendorService.getCCTLearningLocation().subscribe(
      (res: any) => {
        this.CCTLearningLocation = res.data;
        this.getCCTNfpsEntity();
      },
      (err: any) => {
        this.commonService.errorHandling(err); 
        this.commonService.hideLoading();
      }
    );
  }

  getCCTNfpsEntity() {
    this.commonService.showLoading();
    this.vendorService.getCCTNfpsEntity().subscribe(
      (res: any) => {
        this.CCTNfpsEntity = res.data;
        this.getCCTOfferTraining();
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err); 
      }
    );
  }
  getCCTOfferTraining() {
    this.commonService.showLoading();
    this.vendorService.getCCTOfferTraining().subscribe(
      (res: any) => {
        this.CCTOfferTraining = res.data;
        this.commonService.hideLoading();
       this.getCCTRating();
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err); 
      }
    );
  }

  getCCTRating() {
    this.commonService.showLoading();
    this.vendorService.getCCTRating().subscribe(
      (res: any) => {
        this.overallRatings = res.data;
        this.commonService.hideLoading();
        this.refreshCourses({});
      },
      (err: any) => {
        this.commonService.errorHandling(err); 
        this.commonService.hideLoading();
      }
    );
  }




  viewRequest(item: any) {
    if (item && item.vendor_id) {
      this.router.navigateByUrl(`/vendormanagement/view/${item.vendor_id}`);
    }
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

  
  reset() {
    this.filterForm.setValue({
      status:'',
      created_by: '',
      vendor_name: '',
      epurchase: '',
      other_training_offer: '',
      overall_rating: null,
      nfps_entity: null,
      region: '',
      location:'',
      training_offer: '',
    });
    this.refreshCourses(this.filterForm.value);
  }

  filterData() {
    const data = this.filterForm.value;
    this.refreshCourses(data);
  }

  refreshCourses(data:any) {
    this.commonService.showLoading();
    this.vendorService.getVendorRatingReport(data).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.vendorList = res.data.vendor;
          let newqvendorList: any[] = [];
          let currentVendor = '';
          let newVendorList = _.groupBy(_.map(res.data.vendor,(x: any) => Object.assign({}, {
            vendor_id: x.vendor_id,
            rating: x.rating,
              rating_name: x.rating_name,
              comment: x.comment,
              created_by_email: x.created_by_email, })),'vendor_id');
          this.vendorList.forEach((data: any)=>{
            if(currentVendor != data.vendor_id){
            data.ratings =  newVendorList[data.vendor_id] ;
            data.nfps_entity = JSON.parse(data.vendor_detail.nfps_entity).join(',');
            data.region = JSON.parse(data.vendor_detail.region).join(',');
            data.location = JSON.parse(data.vendor_detail.location).join(',');
            data.name = data.vendor_detail.name;
            newqvendorList.push(Object.assign({}, data));
            }
            currentVendor = data.vendor_id;
          });
          this.vendor_count = res.data.vendor_count;
          this.vendorList = newqvendorList;
          this.showRecords(this.selectedStatus);
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
      this.router.navigateByUrl(`/vendormanagement/update/${item.id}`);
    }
  }

  ratingReport(){
    this.router.navigateByUrl(`/vendormanagement/rating`);
  }

    exportExcel(){
      const data = this.filterForm.value;
      data.type = dataConstant.ExporType.vendor_rating;
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
