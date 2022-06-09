import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { DnaService } from 'src/app/shared/services/dna/dna.service';

@Component({
  selector: 'app-dna-view-rpt',
  templateUrl: './dna-view-rpt.component.html',
  styleUrls: ['./dna-view-rpt.component.scss']
})
export class DnaViewRptComponent implements OnInit {

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
  statusComment:string='';
  trackerId:number = 0;
  selectedId = 0;
  learningIds:any = [];

  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }
  constructor(
    private commonService: CommonService,
    private dnaService:DnaService,
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

  selectedItems(item:any){
    this.learningIds.push(item.id);
  }

  submit(){
    const body = {} as any;
    body.digital_learning_id = this.learningIds;
    body.status  = this.dnaStatus.close;
    body.status_comment = this.statusComment;
    this.dnaService.dnaChangeStatus(body).subscribe((res: any) => {
      if(res.status == 1){
      this.commonService.hideLoading();
      }
      else{
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', res.message);
      }
    },(err:any)=>{
      this.commonService.hideLoading();
      this.commonService.toastErrorMsg('Error', err.message);
    })
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
