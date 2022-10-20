import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CarouselService } from 'src/app/shared/services/carousel/carousel.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { OlTestService } from 'src/app/shared/services/ol-test/ol-test.service';

@Component({
  selector: 'app-ol-test-create',
  templateUrl: './ol-test-create.component.html',
  styleUrls: ['./ol-test-create.component.scss']
})
export class OlTestCreateComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  yesNo: any = [
    { id: 'yes', name: 'Yes' },
    { id: 'no', name: 'No' },
  ];
  ol_test_id = 0;
  isSubmitted = false;
  scoringType = 'by_passing_score'
  createOlTestForm: FormGroup;
  OLTestType = dataConstant.OLTestType;
  selectedTestType = '';
  requestData: any = {};
  constructor(private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private authService: AuthenticationService,
    private olTestService: OlTestService,
    private carouselService: CarouselService) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.createOlTestForm = this.formBuilder.group({
      test_name: new FormControl('', [Validators.required]),
      test_description: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
      attempt_allow: new FormControl('', [Validators.required]),
      allow_review: new FormControl('', [Validators.required]),
      randomize_section: new FormControl('', [Validators.required]),
      randomize_question: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.ol_test_id = Id ? parseInt(Id) : 0;
      if (!this.ol_test_id) {
        const test_type = params.get('test_type');
        if (test_type == this.OLTestType.Online || this.OLTestType.Scorm == test_type) {
          this.selectedTestType = test_type;
        }
        else {
          this.router.navigateByUrl(`/oltest`);
        }
        this.formBind({});
      }
      else {
        this.getDetails();
      }
    });
  }

  formBind(data: any) {
    if (this.selectedTestType == this.OLTestType.Online) {
      this.createOlTestForm.addControl('subject', new FormControl('', [Validators.required]));
      this.createOlTestForm.addControl('instruction', new FormControl(''));
      this.createOlTestForm.addControl('choose_following', new FormControl('', [Validators.required]));
      this.createOlTestForm.addControl('time_to_complete', new FormControl('', [Validators.required]));
      this.createOlTestForm.addControl('passing_score', new FormControl('', [Validators.required]));
    }
    if (this.selectedTestType == this.OLTestType.Scorm) {
      this.createOlTestForm.addControl('question_submission', new FormControl('', [Validators.required]));
      this.createOlTestForm.addControl('timer', new FormControl('', [Validators.required]));
      this.createOlTestForm.addControl('number_of_attempt', new FormControl(''));
      this.createOlTestForm.addControl('time_to_complete_quiz', new FormControl(''));
      this.createOlTestForm.addControl('language', new FormControl(''));
      this.createOlTestForm.addControl('scoring_type', new FormControl('by_passing_score'));
      if (!this.ol_test_id) {
        this.createOlTestForm.addControl('passing_score', new FormControl(''));
        this.createOlTestForm.addControl('passed', new FormControl(''));
        this.createOlTestForm.addControl('failed', new FormControl(''));
        this.createOlTestForm.removeControl('quiz_result');
      }
      this.createOlTestForm.get("scoring_type")?.valueChanges.subscribe((x) => {
        this.scoringType = x;
        if (x == 'none') {
          this.createOlTestForm.addControl('quiz_result', new FormControl(data ? data.quiz_result : ''));
          this.createOlTestForm.removeControl('passed');
          this.createOlTestForm.removeControl('failed');
          this.createOlTestForm.removeControl('passing_score');
        }
        else {
          this.createOlTestForm.addControl('passing_score', new FormControl(data ? data.passing_score : ''));
          this.createOlTestForm.addControl('passed', new FormControl(data ? data.passed : ''));
          this.createOlTestForm.addControl('failed', new FormControl(data ? data.failed : ''));
          this.createOlTestForm.removeControl('quiz_result');
        }
      })
      // scoring_type: new FormControl('', [Validators.required]),
      // passed: new FormControl('', [Validators.required]),
      // failed: new FormControl(''),
      // quiz_result: new FormControl('')
    }
  }

  requiredMessage(field: any) {
    return this.lableConstant.form_fieldname_cannot_be_blank.replace('<form fieldname>', field).replace('<nom du champ>', field);
  }

  getDetails() {
    this.commonService.showLoading();
    this.olTestService.getOlTestDetails(this.ol_test_id).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.requestData = res.data;
          this.selectedTestType = this.requestData.test_type;
          this.formBind(this.requestData);
          this.createOlTestForm.patchValue(this.requestData);
          // this.languageList.forEach((x: { name: string, id: number, slug: string, carousel_show: number, name_original: any }) => {
          //   if (x.carousel_show === 1) {
          //     if (x.slug === 'english') {
          //       this.lauguageFormArray.push(new FormControl(true));
          //       const formControl = this.newMetaData(x)
          //       formControl.controls.title.setValue(this.courseService.getTText(this.coursedata['title']));
          //       formControl.controls.description.setValue(this.courseService.getTText(this.coursedata['description']));
          //       this.carouselFormArray.push(formControl);
          //     }
          //     else {
          //       this.lauguageFormArray.push(new FormControl(false));
          //     }
          //   }
          // });
          // if (this.coursedata.email_preffered_instructor) {
          //   const instructor = this.preferedInstructor.find((x: { id: any; }) => x.id == JSON.parse(this.coursedata.email_preffered_instructor));
          //   this.createBackOfficeForm.controls.email.setValue(instructor.email_id);
          //   this.changeEmail(instructor);
          // }
          // this.createBackOfficeForm.controls.course_deliver.setValue(this.courseService.getTText(this.coursedata['title']));
        }
      },
      (err: any) => {
        this.commonService.errorHandling(err);
        this.commonService.hideLoading();
      }
    );
  }

  saveTest(status: string) {
    this.isSubmitted = true;
    if (this.createOlTestForm.invalid) {
      return;
    }
    const body = this.createOlTestForm.value;
    if (!this.ol_test_id) {
      body.status = status;
      body.test_type = this.selectedTestType;
      this.commonService.showLoading();
      this.olTestService.create(body).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('OL Test', 'Successfully Saved.');
          this.router.navigateByUrl(`/oltest/view/${res.data.id}`);
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.errorHandling(err);
        }
      );
    }
    else {
      body.ol_test_id = this.ol_test_id;
      body.status = this.requestData.status;
      body.test_type = this.requestData.test_type;
      this.commonService.showLoading();
      this.carouselService.update(body).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('OL Test', 'Successfully Saved.');
          this.router.navigateByUrl(`/oltest/view/${this.ol_test_id}`);
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.errorHandling(err);
        }
      );
    }

  }


}
