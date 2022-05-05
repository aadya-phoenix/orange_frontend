import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';

@Component({
  selector: 'app-session-complete-report',
  templateUrl: './session-complete-report.component.html',
  styleUrls: ['./session-complete-report.component.scss']
})
export class SessionCompleteReportComponent implements OnInit {

  public filterForm!: FormGroup;
  carouselStatus = dataConstant.CarouselStatus;
  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }
  session_count = {
    total: 0,
    draft: 0,
    closed: 0,
    rejected: 0,
    pending: 0,
    submitted: 0,
    publish: 0
  }
  getUserrole: any;
  getprofileDetails: any;
  searchText: any;
  carouselListToShow: any = [];
  selectedStatus = this.carouselStatus.total;
  addDate = false;
  isReviewer = false;
  isPublisher = false;
  isRequester = false;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  
  constructor(
    private fb: FormBuilder,
  ) { 
    this.filterForm = this.fb.group({
      start_date: new FormControl('', []),
      end_date: new FormControl('', []),
      reporting_period: new FormControl('', []),
    });
  }

  ngOnInit(): void {
  }

  reset(){}

  filterData(){}

  showRecords(status:string){}

  viewRequest(item:any){}

  pageChanged(event:any){}

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

}
