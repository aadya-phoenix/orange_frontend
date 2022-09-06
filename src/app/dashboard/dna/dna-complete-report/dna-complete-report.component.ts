import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { DnaService } from 'src/app/shared/services/dna/dna.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dna-complete-report',
  templateUrl: './dna-complete-report.component.html',
  styleUrls: ['./dna-complete-report.component.scss']
})
export class DnaCompleteReportComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  dnaStatus = dataConstant.DnaStatus;
  selectedStatus = this.dnaStatus.total;
  dateFormate = dataConstant.dateFormate;
  dnaList: any = [];
  dnaListToShow: any = [];
  isManager = false;
  learningList: any = [];
  learningListToShow: any = [];

  trackerId: any;
  trackerObj: any = [];

  pagination = {
    page: 1,
    pageNumber: 1,
    pageSize: 10
  }
  business_consultant_count = {
    total: 0,
    closed: 0,
    close: 0,
    forwarded: 0,
    pending: 0,
    total_participant: 0
  };
  rom_count = {
    total: 0,
    closed: 0,
    close: 0,
    forwarded: 0,
    pending: 0,
    total_participant: 0
  };
  strategic_count = {
    strategic_1: 0,
    strategic_2: 0,
    strategic_3: 0
  };
  dna_count = {
    total: 0,
    closed: 0,
    close: 0,
    forwarded: 0,
    pending: 0,
    digital_learning: 0
  }
  domain_training = {
    total: 0,
    closed: 0,
    close: 0,
    forwarded: 0,
    pending: 0,
    total_participant: 0
  }
  domain_wise_count = {};
  searchText: any;
  isFrance = false;
  constructor(
    private commonService: CommonService,
    private dnaService: DnaService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.isManager = this.authService.getProfileDetailsfromlocal().data?.manager == 1 ? true : false;
  }

  ngOnInit(): void {
    if (this.isManager) {
      this.route.paramMap.subscribe((params: ParamMap) => {
        const Id = params.get('id');
        this.trackerId = Id ? parseInt(Id) : 0;
        this.getTrackerList();
        this.getLearningList(this.trackerId);
      });
    }
  }

  getTracker(event: any) {
    let selectedTrackerId = event;
    if (event) {
      this.getLearningList(selectedTrackerId);
      let selectedTracker = this.trackerObj.find((x: any) => x.id == event);
      selectedTracker.type_name == 'France' ? this.isFrance = true : this.isFrance = false;
    }
    else {
      this.getLearningList(this.trackerId);
      let tracker = this.trackerObj.find((x: any) => x.id == this.trackerId);
      tracker.type_name == 'France' ? this.isFrance = true : this.isFrance = false;
    }
  }

  getTrackerList() {
    this.dnaService.getTrackerList().subscribe((res: any) => {
      this.trackerObj = res.data.tracker;
      let tracker = this.trackerObj.find((x: any) => x.id == this.trackerId);
      tracker.type_name == 'France' ? this.isFrance = true : this.isFrance = false;
    },
      err => {
      });
  }

  getLearningList(trackerId: any) {
    this.commonService.showLoading();
    this.dnaService.dnaFullReport(trackerId).subscribe(
      (res: any) => {
        if (res.status == 1) {
          this.commonService.hideLoading();
          this.learningListToShow = res.data.digital_learning;
          this.rom_count = res.data.digital_learning_count.rom_count;
          this.business_consultant_count = res.data.digital_learning_count.business_consultant_count;
          this.strategic_count = res.data.digital_learning_count.strategic_count;
          this.domain_training = res.data.digital_learning_count.domain_training;
          this.domain_wise_count = res.data.digital_learning_count.domain_wise;
          this.learningListToShow.forEach((x: any) => {
            if (x.strategic) {
              if (x.strategic == 'strategic_1') {
                x.strategic_name = 'Strategic for BU';
              }
              if (x.strategic == 'strategic_2') {
                x.strategic_name = 'Not strategic but action required';
              }
              if (x.strategic == 'strategic_3') {
                x.strategic_name = 'Not a priority or no action required';
              }
            }
          });
        }
        else {
          this.commonService.hideLoading();
          this.commonService.toastErrorMsg('Error', res.message);
        }
      }, (err: any) => {
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
    this.selectedStatus = type;
  }

  exportExcel(){
    var data =  {type: dataConstant.ExporType.carousel};
    this.commonService.showLoading();
    this.commonService.exportAPI(data).subscribe(
      (res: any) => {
        if(res.status === 1){
          window.open(`${dataConstant.ImageUrl}/${res.data.url}`);
        }
        else{
          Swal.fire(
            'Information!',
            res.message,
            'warning'
          )
        }
        this.commonService.hideLoading();
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }
}
