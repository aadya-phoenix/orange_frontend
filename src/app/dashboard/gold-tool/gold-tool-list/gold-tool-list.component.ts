import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import * as _ from 'lodash';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Component({
  selector: 'app-gold-tool-list',
  templateUrl: './gold-tool-list.component.html',
  styleUrls: ['./gold-tool-list.component.scss']
})
export class GoldToolListComponent implements OnInit {
  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;
  goldToolStatus = dataConstant.GoldToolStatus;
  selectedStatus = this.goldToolStatus.total;
  lableConstant: any = { french: {}, english: {} };
  searchText: any;
  goldToolList: any = [];
  goldToolListToView: any = [];
  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }

  constructor(private commonService: CommonService) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
  }

  ngOnInit(): void {
  }

  showPaginationCount(pageStart:any, pageEnd:any, total:any) {
    return this.commonService.showPaginationCount(pageStart,pageEnd,total, this.lableConstant.showing_number_entries);
  }

  pageChanged(event: any) {
    this.pagination.pageNumber = event;
  }

  onSort({ column, direction }: any) {
    this.headers.forEach((header: { sortable: any; direction: string; }) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction && column) {
      this.goldToolListToView = _.orderBy(this.goldToolListToView, column, direction);
    }
    else {
      this.getrecords(this.selectedStatus);
    }
  }

  getrecords(type: string) {
    if (type === this.goldToolStatus.total) {
      this.goldToolListToView = this.goldToolList.map((x: any) => Object.assign({}, x));
    } else {
      this.goldToolListToView = this.goldToolList.filter((x: any) => { if (x.status_show === type) { return x } }).map((x: any) => Object.assign({}, x));
    }
    this.selectedStatus = type;
  }


}
