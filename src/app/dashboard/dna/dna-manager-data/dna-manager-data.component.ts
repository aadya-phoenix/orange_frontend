import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { DnaService } from 'src/app/shared/services/dna/dna.service';
import { GeneralDropdownsService } from 'src/app/shared/services/general-dropdowns/general-dropdowns.service';

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
  trackerId:number = 0;

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
  learningList:any= [];
  learningListToShow:any= [];
  searchText: any;
  constructor(
    private authService:AuthenticationService,
    private commonService: CommonService,
    private generalDrpdownsService: GeneralDropdownsService,
    private dnaService:DnaService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.getUserrole = this.authService.getRolefromlocal();
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.userId = this.getprofileDetails.data.id;
  
  }

  ngOnInit(): void {
    this.getManagerData();
  }

  getManagerData(){
    this.commonService.showLoading();
    this.dnaService.getManagerData(this.userId).subscribe(
      (res: any) => {
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
      });
  }

  getLearningList(){
    this.commonService.showLoading();
    this.dnaService.getDna().subscribe(
      (res: any) => {
        if(res.status == 1){
        this.commonService.hideLoading();
        this.learningList = res.data.digital_learning[this.trackerId];
        this.dna_count = res.data.all_count[this.trackerId];
        this.learningListToShow = res.data.digital_learning[this.trackerId];
        this.learningList.forEach((x:any)=>{
          if(x.strategic){
           if(x.strategic == 'strategic_1'){
            x.strategic_name = 'Strategic for BU';
           }
           if(x.strategic == 'strategic_2'){
            x.strategic_name = 'Not strategic but action required';
           }
           if(x.strategic == 'strategic_3'){
            x.strategic_name = 'Not a priority or no action required';
           }
          }
         })
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
}