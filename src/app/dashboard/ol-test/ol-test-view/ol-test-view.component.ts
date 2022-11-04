import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { OlTestService } from 'src/app/shared/services/ol-test/ol-test.service';
import { OlTestQuestionCreateComponent } from '../ol-test-question-create/ol-test-question-create.component';
import { OlTestSectionCreateComponent } from '../ol-test-section-create/ol-test-section-create.component';

@Component({
  selector: 'app-ol-test-view',
  templateUrl: './ol-test-view.component.html',
  styleUrls: ['./ol-test-view.component.scss']
})
export class OlTestViewComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  id = 0;
  requestdata: any = {};
  OLTestType = dataConstant.OLTestType;
  getUserrole: any = {};
  getprofileDetails: any = {};
  searchText: any;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private commonService: CommonService,
    private modalService: NgbModal,
    private router: Router,
    private olTestService: OlTestService
  ) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.getUserrole = this.authService.getRolefromlocal();
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.id = Id ? parseInt(Id) : 0;
      this.getDetails();
    });
  }

  getDetails() {
    this.commonService.showLoading();
    this.olTestService.getOlTestDetails(this.id).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.requestdata = res.data;
        }
      },
      (err: any) => {
        this.commonService.errorHandling(err);
        this.commonService.hideLoading();
      }
    );
  }

  createSection() {
    const modalRef = this.modalService.open(OlTestSectionCreateComponent, {
      centered: true,
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      objectDetail: {},
      test_id :this.id 
    };
    modalRef.componentInstance.passEntry.subscribe((res: any) => {
      //body.publisher_id = res;
      //this.saveData(body);
    });
  }

  createQuestion() {
    const modalRef = this.modalService.open(OlTestQuestionCreateComponent, {
      centered: true,
      size: 'xl',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      objectDetail: {},
    };
    modalRef.componentInstance.passEntry.subscribe((res: any) => {
      //body.publisher_id = res;
      //this.saveData(body);
    });
  }

  exportTest() {

  }
  previewTest() {

  }
  copyRequest() {

  }
  editRequest() {

  }
  deleteRequest() {

  }

}
