import { Component, OnInit } from '@angular/core';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';

@Component({
  selector: 'app-gold-tool-list',
  templateUrl: './gold-tool-list.component.html',
  styleUrls: ['./gold-tool-list.component.scss']
})
export class GoldToolListComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  searchText: any;
  constructor(private commonService: CommonService) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
  }

  ngOnInit(): void {
  }

}
