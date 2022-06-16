import { Component, OnInit } from '@angular/core';
import { dataConstant } from '../shared/constant/dataConstant';
import { CommonService } from '../shared/services/common/common.service';

@Component({
  selector: 'app-pdltools',
  templateUrl: './pdltools.component.html',
  styleUrls: ['./pdltools.component.scss']
})
export class PdltoolsComponent implements OnInit {
  yearsList: any = [];
  moduleList: any = {};
  year = null;
  module= null;

  constructor(private commonService: CommonService) {
    this.yearsList = this.commonService.LastFewYearsList();
    this.moduleList = dataConstant.ModuleList;
  }

  ngOnInit(): void {
  }

}
