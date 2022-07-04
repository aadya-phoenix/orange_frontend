import { Component, OnInit } from '@angular/core';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { DnaService } from 'src/app/shared/services/dna/dna.service';
import { TreeNode } from 'primeng/api';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-dna-manager-data',
  templateUrl: './dna-manager-data.component.html',
  styleUrls: ['./dna-manager-data.component.scss']
})
export class DnaManagerDataComponent implements OnInit {
  
  RoleID = dataConstant.RoleID;
  getUserrole: any ;
  getprofileDetails: any;
  userId:any;
  dnaStatus = dataConstant.DnaStatus;
  selectedStatus = this.dnaStatus.total;
  dnaList: any = [];
  dnaListToShow: any = [];
  data:any={};
  icon:any='';
  trackerId:number = 0;
  managerList:TreeNode[]=[];
  dna_count = {
    total: 0,
    closed: 0,
    close: 0,
    pending: 0,
    forwarded:0,
    total_participant:0
  }
  learningList:any= [];
  learningListToShow:any= [];
  searchText: any;
  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }
  constructor(
    private route: ActivatedRoute,
    private authService:AuthenticationService,
    private commonService: CommonService,
    private dnaService:DnaService,
  ) { 
    this.getUserrole = this.authService.getRolefromlocal();
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.userId = this.getprofileDetails.data.id;
  
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.trackerId = Id ? parseInt(Id) : 0;
    }); 
    this.getManagerData();
  }

  getManagerData(){
    this.commonService.showLoading();
    this.dnaService.getManagerData(this.userId).subscribe(
      (res: any) => {
        if(res.status == 1){
        this.commonService.hideLoading();
        let managers =  <TreeNode[]>res.data;
        managers.forEach((x:any)=> {
          x.label = x.first_name;
          x.children = [{label:'sub-manager'},{label:'sub-manager2'}]
          this.managerList.push(x)});
        console.log("manager",this.managerList)  
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

  nodeExpand(event:any){
    if (event.node.expanded) {
      this.icon = '<i class="fa fa-sort-asc" aria-hidden="true">';
    } else {
      this.icon = '<i class="fa fa-sort-asc" aria-hidden="true">';
    }  
    return this.icon;
  }

  getExpandedIcon(){
    let icon: string;

 /*    if (this.node.expanded) {
      icon = this.node.expandedIcon || 'pi-chevron-down'
    } else {
      icon = this.node.collapsedIcon || 'pi-chevron-right'
    }  
  
    return icon;*/
  }

  nodeSelect(event:any){
    if(event.node.id){
    let id = event.node.id;
    this.getLearningList(id);
    }
  }

  getLearningList(id:number){
    this.commonService.showLoading();
    this.dnaService.getUserDigitalLearning(id).subscribe(
      (res: any) => {
        if(res.status == 1){
        this.commonService.hideLoading();
        this.learningList = res.data.digital_learning[this.trackerId];
        this.dna_count = res.data.all_count[this.trackerId];
        this.learningListToShow = res.data.digital_learning[this.trackerId];
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