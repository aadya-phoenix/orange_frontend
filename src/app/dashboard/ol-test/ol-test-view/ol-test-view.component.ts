import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { OlTestService } from 'src/app/shared/services/ol-test/ol-test.service';
import Swal from 'sweetalert2';
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
  questionList = dataConstant.OLTestQuestion;
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
          if (this.requestdata.section && this.requestdata.question) {
            this.requestdata.section.forEach((section: any) => {
              section.question = _.filter(this.requestdata.question, ['section_id', section.id]);
            });
          }
          this.requestdata.questionWithoutSection = _.filter(this.requestdata.question, ['section_id', null]);
        }
      },
      (err: any) => {
        this.commonService.errorHandling(err);
        this.commonService.hideLoading();
      }
    );
  }

  createSection(id:any) {
    const modalRef = this.modalService.open(OlTestSectionCreateComponent, {
      centered: true,
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      objectDetail: {},
      test_id: this.id,
      section_id: id
    };
    modalRef.componentInstance.passEntry.subscribe((res: any) => {
      this.getDetails();
    });
  }

  createQuestion(id:any) {
    const modalRef = this.modalService.open(OlTestQuestionCreateComponent, {
      centered: true,
      size: 'xl',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      objectDetail: this.requestdata,
      question_id: id
    };
    modalRef.componentInstance.passEntry.subscribe((res: any) => {
      this.getDetails();
    });
  }

  getQuestionType(type: any) {
    const questionType: any = _.find(this.questionList, (x: any) => {
      if (x.id == type) {
        return x;
      }
    })
    return questionType ? questionType.name : '';
  }

  exportTest() {

  }
  previewTest() {

  }

  copyQuestion(id:any) {
    Swal.fire({
      title: 'Are you sure you want to copy?',
      text: 'You will copy this request',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, copy it!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        // this.commonService.showLoading();
        // this.olTestService.copyQuestion({ section_id: id }, this.id).subscribe((res: any) => {
        //   this.commonService.hideLoading();
        //   this.getDetails();
        //   Swal.fire(
        //     'Copied!',
        //     'Your request has been copyed.',
        //     'success'
        //   )
        // }, (err: any) => {
        //   this.commonService.hideLoading();
        //   this.commonService.errorHandling(err);
        // })
      }
    })
  }
  deleteSection(id: any) {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this section!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.commonService.showLoading();
        this.olTestService.deleteSection({ section_id: id }, this.id).subscribe((res: any) => {
          this.commonService.hideLoading();
          this.getDetails();
          Swal.fire(
            'Deleted!',
            'Your request has been deleted.',
            'success'
          )
        }, (err: any) => {
          this.commonService.hideLoading();
          this.commonService.errorHandling(err);
        })

      }
    })
  }
  deleteQuestion(id: any) {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this question!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.commonService.showLoading();
        this.olTestService.deleteQuestion({ question_id: id }, this.id).subscribe((res: any) => {
          this.commonService.hideLoading();
          this.getDetails();
          Swal.fire(
            'Deleted!',
            'Your request has been deleted.',
            'success'
          )
        }, (err: any) => {
          this.commonService.hideLoading();
          this.commonService.errorHandling(err);
        })

      }
    })
  }

}
