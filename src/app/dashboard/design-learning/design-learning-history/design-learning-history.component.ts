import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { DesignLearningService } from 'src/app/shared/services/design-learning/design-learning.service';

@Component({
  selector: 'app-design-learning-history',
  templateUrl: './design-learning-history.component.html',
  styleUrls: ['./design-learning-history.component.scss']
})
export class DesignLearningHistoryComponent implements OnInit {
  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  lableConstant: any = { french: {}, english: {} };
  public historyList: any;
  public objectDetail: any;
  public modalType: any;
  public title: any;
  designId:number=0;

  constructor(
    private modalService: NgbActiveModal,
    private designService: DesignLearningService,
    private commonService: CommonService,
    private router: Router
  ) { 
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
  }

  ngOnInit(): void {
    this.objectDetail = this.props.objectDetail ? this.props.objectDetail : '';
    this.designId = this.props.data;
    this.title = this.props.title;
    this. getLearningHistory();
  }

  getLearningHistory(){
    this.commonService.showLoading();
    this.designService.history(this.designId).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 ) {
          this.historyList = res.data;
        }
      },
      (err: any) => {
        this.commonService.errorHandling(err);
        this.commonService.hideLoading();
      });
  }

  closeModal() {
    this.modalService.close();
  }

  onClose() {
    this.passEntry.next();
    this.modalService.close();
  }
}
