import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { GetReportService } from 'src/app/shared/services/get-report/get-report.service';

@Component({
  selector: 'app-get-report-view',
  templateUrl: './get-report-view.component.html',
  styleUrls: ['./get-report-view.component.scss']
})
export class GetReportViewComponent implements OnInit {

  id = 0;
  requestdata: any = {};
  getUserrole: any = {};
  getprofileDetails:any = {};
  dateFormate = dataConstant.dateFormate;
  RoleID = dataConstant.RoleID;
  isReviewer = false;
  isPublisher = false;
  isRequester = false;
  GetReportStatus = dataConstant.GetReportStatus;
  constructor(
    private route: ActivatedRoute,
    private getReportService: GetReportService,
    private authService: AuthenticationService,
    private commonService: CommonService,
    private modalService: NgbModal,
    private router: Router
  ) { 
    this.getUserrole = this.authService.getRolefromlocal();
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.id = Id ? parseInt(Id) : 0;
      this.getReportDetails();
    });
  }

  getReportDetails(){
    this.commonService.showLoading();
    this.getReportService.getReportDetails(this.id).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.requestdata = res.data;
          console.log("res data",this.requestdata)
        }
      },
      (err: any) => {
        console.log(err);
        this.commonService.hideLoading();
      }
    );
  }

}
