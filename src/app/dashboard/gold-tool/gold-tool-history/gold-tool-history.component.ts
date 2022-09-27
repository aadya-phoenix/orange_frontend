import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { GoldToolService } from 'src/app/shared/services/gold-tool/gold-tool.service';

@Component({
  selector: 'app-gold-tool-history',
  templateUrl: './gold-tool-history.component.html',
  styleUrls: ['./gold-tool-history.component.scss']
})
export class GoldToolHistoryComponent implements OnInit {
  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  lableConstant: any = { french: {}, english: {} };
  constructor(private modalService: NgbActiveModal, private goldToolService: GoldToolService, private commonService: CommonService) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
  }
  public historyList: any;
  public objectDetail: any;
  copyDeletecourse: any;
  ngOnInit(): void {
    this.setDialogProps(this.props)
  }

  setDialogProps(dialogdata: any) {
    this.objectDetail = dialogdata.objectDetail ? dialogdata.objectDetail : '';
    this.commonService.showLoading();
    this.goldToolService.goldToolHistory(dialogdata.data).subscribe((res: any) => {
      this.commonService.hideLoading();
      if (res && res.status == 1) {
        this.historyList = res.data;
      }
    });
  }

  closeModal() {
    this.modalService.close();
  }

}
