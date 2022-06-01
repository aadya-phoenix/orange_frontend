import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DnaService } from 'src/app/shared/services/dna/dna.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { GeneralDropdownsService } from 'src/app/shared/services/general-dropdowns/general-dropdowns.service';
import * as _ from 'lodash';
import { NgbdSortableHeader } from 'src/app/shared/directives/sorting.directive';

@Component({
  selector: 'app-learning-needs',
  templateUrl: './learning-needs.component.html',
  styleUrls: ['./learning-needs.component.scss']
})
export class LearningNeedsComponent implements OnInit {

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
    private formBuilder: FormBuilder,
    private courceService:CourcesService,
    private dnaService:DnaService,
    private generalService:GeneralDropdownsService,
    private commonService:CommonService) {
      
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

  view(item:any){}

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
