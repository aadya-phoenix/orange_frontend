import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { DnaService } from 'src/app/shared/services/dna/dna.service';
import { DnaForwardComponent } from '../dna-forward/dna-forward.component';

@Component({
  selector: 'app-dna-view-bp',
  templateUrl: './dna-view-bp.component.html',
  styleUrls: ['./dna-view-bp.component.scss']
})
export class DnaViewBpComponent implements OnInit {

  dnaStatus = dataConstant.DnaStatus;
  selectedStatus = this.dnaStatus.total;
  dnaList: any = [];
  dnaListToShow: any = [];

  learningList:any= [];
  learningListToShow:any= [];

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
  trackerId:number = 0;
  isDisabled = false;
  learningIds:any = [];
  titleList:any=[];

  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }
  constructor(
    private commonService: CommonService,
    private dnaService:DnaService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.trackerId = Id ? parseInt(Id) : 0;
      this.getLearningList();
    });
  }

  getStatus(event:any){
  }

  forward(){
    
  }

  submit(){}

  selectedItems(item:any){
    this.learningIds.push(item.id);
    this.titleList.push(this.learningList.find((y:any)=> y.id == item.id));
  }

  openModal() {
    const modalRef = this.modalService.open(DnaForwardComponent, {
      centered: true,
      size: 'xl',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: 'Forward Request',
      data: this.learningIds,
      objectDetail: this.titleList,
      type: 'forward'
    };
  }

  getLearningList(){
    this.commonService.showLoading();
    this.dnaService.getDna().subscribe(
      (res: any) => {
        if(res.status == 1){
        this.commonService.hideLoading();
        this.learningList = res.data.digital_learning[this.trackerId];
        }
        else{
          this.commonService.hideLoading();
          this.commonService.toastErrorMsg('Error', res.message);
        }
      },(err:any)=>{
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      });
  }

  showRecords(type: string) {
    if (type === this.dnaStatus.total) {
      this.dnaListToShow = this.dnaList.map((x: any) => Object.assign({}, x));
    } else {
      this.dnaListToShow = this.dnaList.filter((x: any) => { if (x.status_show === type) { return x } }).map((x: any) => Object.assign({}, x));
    }
  }

  pageChanged(event: any) {
    this.pagination.pageNumber = event;
  }

}
