import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { DnaService } from 'src/app/shared/services/dna/dna.service';

@Component({
  selector: 'app-dna-view',
  templateUrl: './dna-view.component.html',
  styleUrls: ['./dna-view.component.scss']
})
export class DnaViewComponent implements OnInit {

  dnaStatus = dataConstant.DnaStatus;
  selectedStatus = this.dnaStatus.total;
  learningList: any = [];
  learningListToShow: any = [];
  trackerId:any;

  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }

  tracker_details:any;
  type:number=0;
  isFrance = false;

  searchText: any;
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
      this.getTrackerDetail();
    });
    this.getLearningList();
  }

  getLearningList(){
    this.commonService.showLoading();
    this.dnaService.getDna().subscribe(
      (res: any) => {
        if(res.status == 1){
        this.commonService.hideLoading();
        this.learningList = res.data.digital_learning;
        this.learningListToShow = this.learningList.filter((x:any)=>x.tracker_id === this.trackerId);
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

  getTrackerDetail(){
    this.commonService.showLoading();
    this.dnaService.getTrackerDetail(this.trackerId).subscribe(
      (res: any) => {
        if(res.status == 1){
        this.commonService.hideLoading();
        this.tracker_details = res.data;
        this.type = this.tracker_details.type;
        this.type == 1 ? this.isFrance = true : this.isFrance = false;
        }
        else{
          this.commonService.hideLoading();
          this.commonService.toastErrorMsg('Error', res.message);
        }
      },err=>{
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      });
  }


  pageChanged(event: any) {
    this.pagination.pageNumber = event;
  }
 
}
