import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { DnaService } from 'src/app/shared/services/dna/dna.service';

@Component({
  selector: 'app-dna-tracker',
  templateUrl: './dna-tracker.component.html',
  styleUrls: ['./dna-tracker.component.scss']
})
export class DnaTrackerComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  trackerObjList:any=[];
  searchText : string ='';
  trainingDataObj:any = [];
  isSubmitted=false;

  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;
  constructor(
    private dnaService:DnaService,
    private commonService:CommonService,
    private router:Router) {
      this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
     }

  ngOnInit(): void {
  this.getTrackerList();
  }

  getTrackerList(){
    this.dnaService.getTrackerList().subscribe((res:any)=>{
      this.trackerObjList = res.data.tracker;
    },
    err=>{
  
    });
  }

  create(){
    this.router.navigateByUrl('/dashboard/dna/tracker/create'); 
  }

  editRequest(item :any){
    if (item && item.id) {
      this.router.navigateByUrl(`/dashboard/dna/tracker/edit/${item.id}`);
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
