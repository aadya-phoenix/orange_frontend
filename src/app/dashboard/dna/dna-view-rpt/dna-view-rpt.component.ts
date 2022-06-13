import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { DnaService } from 'src/app/shared/services/dna/dna.service';
import { GeneralDropdownsService } from 'src/app/shared/services/general-dropdowns/general-dropdowns.service';

@Component({
  selector: 'app-dna-view-rpt',
  templateUrl: './dna-view-rpt.component.html',
  styleUrls: ['./dna-view-rpt.component.scss']
})
export class DnaViewRptComponent implements OnInit {

  dnaStatus = dataConstant.DnaStatus;
  selectedStatus = this.dnaStatus.total;
  dnaList: any = [];
  priorityObj: any = [];
  countriesObj:any =[];
  bussinessUnitObj:any = [];
  dnaListToShow: any = [];
  status:string = '';

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
  isChecked=false;

  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }
  constructor(
    private commonService: CommonService,
    private dnaService:DnaService,
    private generalDrpdownsService: GeneralDropdownsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.trackerId = Id ? parseInt(Id) : 0;
      this.getLearningList();
    }); 
    this.getPriority();
    this. getCountries();
    this.getBusinessUnits();
  }

  getBUFilterRecords(item:any){
   if (item) {
     this.learningListToShow = [...this.learningList].filter((a, b) => {
       return a.business_unit_id == item
     });
   }  
   else{
     this.learningListToShow = this.learningList;
   }
  }

  getPriorityFilterRecords(item:any){
    if (item) {
      this.learningListToShow = [...this.learningList].filter((a, b) => {
        return a.priority_id == item
      });
    }  
    else{
      this.learningListToShow = this.learningList;
    }
  }

  getStatusFilterRecords(item:any){
    if (item) {
      this.learningListToShow = [...this.learningList].filter((a, b) => {
        return a.status == item
      });
    }  
    else{
      this.learningListToShow = this.learningList;
    }
  }

  getCountryFilterRecords(item:any){
    if (item) {
      this.learningListToShow = [...this.learningList].filter((a, b) => {
        return a.country == item
      });
    }  
    else{
      this.learningListToShow = this.learningList;
    }
  }

  getStatus(event:any){
    if(event == 1){
      this.status = this.dnaStatus.close;
    }
  }

  selectedItems(item:any){
    item.isChecked = !item.isChecked;
    if(item.isChecked == true){
    this.learningIds.push(item.id);
    }
    else{
      this.learningIds.pop(item.id);
    }
  }

  checkAllOptions() {
    this.learningIds=[];
    this.isChecked = !this.isChecked;
    this.learningList.forEach((val:any) => { val.isChecked = this.isChecked });
    this.learningListToShow = this.learningList.filter((y:any)=> y.status == this.dnaStatus.pending);
    this.learningListToShow.forEach((val:any)=>{
      this.learningIds.push(val.id);
    });
  }

  submit(){
    if(this.status != this.dnaStatus.close){
      return;
    }
    const body = {} as any;
    body.digital_learning_id = this.learningIds;
    body.status  = this.dnaStatus.close;
    body.status_comment = this.statusComment;
    body.strategic = '';
    this.dnaService.dnaChangeStatus(body).subscribe((res: any) => {
      if(res.status == 1){
      this.commonService.hideLoading();
      this.router.navigateByUrl('dashboard/dna');
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

  getLearningList(){
    this.commonService.showLoading();
    this.dnaService.getDna().subscribe(
      (res: any) => {
        if(res.status == 1){
        this.commonService.hideLoading();
        this.learningList = res.data.digital_learning[this.trackerId];
        this.learningListToShow = res.data.digital_learning[this.trackerId];
        this.learningListToShow.forEach((element:any) => {
          element.isChecked = false;
        });
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

  getPriority(){
    this.commonService.showLoading();
    this.generalDrpdownsService.getPriority().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.priorityObj = res.data;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  getCountries(){
    this.commonService.showLoading();
    this.generalDrpdownsService.getCountries().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.countriesObj= res.data;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  getBusinessUnits(){
    this.generalDrpdownsService.getBusinessUnits().subscribe( (res: any) => {
      this.commonService.hideLoading();
      this.bussinessUnitObj = res.data;
    },
    (err: any) => {
      this.commonService.hideLoading();
      this.commonService.toastErrorMsg('Error', err.message);
    }
  );
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
