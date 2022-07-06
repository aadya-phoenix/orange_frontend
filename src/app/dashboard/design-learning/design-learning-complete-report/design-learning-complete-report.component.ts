import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { DesignLearningService } from 'src/app/shared/services/design-learning/design-learning.service';
import { GeneralDropdownsService } from 'src/app/shared/services/general-dropdowns/general-dropdowns.service';

@Component({
  selector: 'app-design-learning-complete-report',
  templateUrl: './design-learning-complete-report.component.html',
  styleUrls: ['./design-learning-complete-report.component.scss']
})
export class DesignLearningCompleteReportComponent implements OnInit {

  dateFormate = dataConstant.dateFormate;
  dateTimeFormate = dataConstant.dateTimeFormate;
  designStatus = dataConstant.DesignStatus;
  public filterForm!: FormGroup;
  designListToShow:any=[];
  designList:any =[];
  bussinessUnitObj:any=[];
  selectedStatus:any;
  design_count:any={
    closed: 0,
    draft: 0,
    pending: 0,
    rejected: 0,
    submitted: 0,
    total: 0,
    transferred: 0
  }
  addDate = false;
  searchText:string='';

  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private generalDrpdownsService:GeneralDropdownsService,
    private router: Router,
    private designService: DesignLearningService,
    private authService: AuthenticationService,
  ) {
    this.filterForm = this.fb.group({
      start_date: new FormControl('', []),
      end_date: new FormControl('', []),
      reporting_period: new FormControl('', []),
      status: new FormControl('', []),
      requestor_department: new FormControl('', []),

    });
    this.filterForm.controls.start_date.valueChanges.subscribe((x: any) => {
      this.addDate = x ? true : false;
    })
   }

  ngOnInit(): void {
    this.getBusinessUnits();
    this.refreshModules({});
  }

  refreshModules(data:any) {
    this.commonService.showLoading();
    this.designService.filter(data).subscribe(
      (res: any) => {
        if (res.status === 1 && res.message === 'Success') {
          this.designList = res.data.new_learning;
          this.design_count = res.data.new_learning_count;
          this.showRecords(this.designStatus.total);
        }
        this.commonService.hideLoading();
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }
    
   openModal(item: any) {
  /*   const modalRef = this.modalService.open(CourseHistoryComponent, {
      centered: true,
      size: 'xl',
      modalDialogClass: 'large-width',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: 'View History',
      data: item.id,
      objectDetail: item,
      type: 'viewhistory'
    }; */
  }

  onSort({ column, direction }: any) {
    this.headers.forEach((header: { sortable: any; direction: string; }) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction && column) {
      this.designListToShow = _.orderBy(this.designListToShow, column, direction);
    }
    else {
      this.showRecords(this.selectedStatus);
    }
  }

  pageChanged(event: any) {
    this.pagination.pageNumber = event;
  }

  showRecords(type: string) {
    if (type === this.designStatus.total) {
      this.designListToShow = this.designList.map((x: any) => Object.assign({}, x));
    } else {
      this.designListToShow = this.designList.filter((x: any) => { if (x.status_show === type) { return x } }).map((x: any) => Object.assign({}, x));
    }
    this.selectedStatus = type;
  }

  getBusinessUnits(){
    this.generalDrpdownsService.getBusinessUnits().subscribe( (res: any) => {
      this.commonService.hideLoading();
      this.bussinessUnitObj = res.data;
    },
    (err: any) => {
      this.commonService.hideLoading();
      this.commonService.toastErrorMsg('Error', err.message);
    });
  }

  reset() {
    this.filterForm.setValue({
      start_date: '',
      end_date: '',
      reporting_period: '',
      learning_type: '',
      status: '',
      department: '',
      roc: '',
      publisher: '',
    });
    this.refreshModules({});
  }
  filterData(){
    const data = this.filterForm.value;
    this.refreshModules(data);
  }


}
