import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { DnaService } from 'src/app/shared/services/dna/dna.service';

@Component({
  selector: 'app-dna-tracker',
  templateUrl: './dna-tracker.component.html',
  styleUrls: ['./dna-tracker.component.scss']
})
export class DnaTrackerComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  trackerObjList: any = [];
  searchText: string = '';
  trainingDataObj: any = [];
  isSubmitted = false;
  isManager = false;
  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;
  constructor(
    private dnaService: DnaService,
    private authService: AuthenticationService,
    private commonService: CommonService,
    private router: Router) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.isManager = this.authService.getProfileDetailsfromlocal().data?.manager == 1 ? true : false;
  }

  ngOnInit(): void {
    if (this.isManager) {
      this.getTrackerList();
    }
  }

  showPaginationCount(pageStart: any, pageEnd: any, total: any) {
    return this.commonService.showPaginationCount(pageStart, pageEnd, total, this.lableConstant.showing_number_entries);
  }

  getTrackerList() {
    this.dnaService.getTrackerList().subscribe((res: any) => {
      this.trackerObjList = res.data.tracker;
    },
      err => {

      });
  }

  create() {
    this.router.navigateByUrl('/dna/tracker/create');
  }

  editRequest(item: any) {
    if (item && item.id) {
      this.router.navigateByUrl(`/dna/tracker/edit/${item.id}`);
    }
  }

  onSort({ column, direction }: any) {
    this.headers.forEach((header: { sortable: any; direction: string; }) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction && column) {
      this.trackerObjList = _.orderBy(this.trackerObjList, column, direction);
    }
    else {
      this.trackerObjList = this.trackerObjList;
    }
  }

  pageChanged(event: any) {
    this.pagination.pageNumber = event;
  }
}
