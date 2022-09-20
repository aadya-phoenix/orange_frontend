import { Component, OnInit } from '@angular/core';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Component({
  selector: 'app-gold-tool-complete-report',
  templateUrl: './gold-tool-complete-report.component.html',
  styleUrls: ['./gold-tool-complete-report.component.scss']
})
export class GoldToolCompleteReportComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  constructor(private commonService: CommonService) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
  }

  ngOnInit(): void {
  }

}
