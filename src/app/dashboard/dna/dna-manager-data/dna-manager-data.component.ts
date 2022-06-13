import { Component, OnInit } from '@angular/core';
import { dataConstant } from 'src/app/shared/constant/dataConstant';

@Component({
  selector: 'app-dna-manager-data',
  templateUrl: './dna-manager-data.component.html',
  styleUrls: ['./dna-manager-data.component.scss']
})
export class DnaManagerDataComponent implements OnInit {

  dnaStatus = dataConstant.DnaStatus;
  selectedStatus = this.dnaStatus.total;
  dnaList: any = [];
  dnaListToShow: any = [];

  dna_count = {
    total: 0,
    draft: 0,
    closed: 0,
    rejected: 0,
    pending: 0,
    submitted: 0,
    transferred: 0,
    expired: 0,
    publish: 0
  }
  searchText: any;
  constructor() { }

  ngOnInit(): void {
  }

  showRecords(type: string) {
    if (type === this.dnaStatus.total) {
      this.dnaListToShow = this.dnaList.map((x: any) => Object.assign({}, x));
    } else {
      this.dnaListToShow = this.dnaList.filter((x: any) => { if (x.status_show === type) { return x } }).map((x: any) => Object.assign({}, x));
    }
  }
}