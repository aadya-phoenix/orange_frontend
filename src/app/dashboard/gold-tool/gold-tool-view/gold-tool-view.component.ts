import { Component, OnInit } from '@angular/core';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Component({
  selector: 'app-gold-tool-view',
  templateUrl: './gold-tool-view.component.html',
  styleUrls: ['./gold-tool-view.component.scss']
})
export class GoldToolViewComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  constructor(private commonService: CommonService) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
  }
  ngOnInit(): void {
  }

}
