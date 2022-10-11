import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CarouselService } from 'src/app/shared/services/carousel/carousel.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';

@Component({
  selector: 'app-ol-test-create',
  templateUrl: './ol-test-create.component.html',
  styleUrls: ['./ol-test-create.component.scss']
})
export class OlTestCreateComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  ol_test_id = 0;
  isSubmitted = false;
  createOlTestForm: FormGroup;
  OLTestType = dataConstant.OLTestType;
  selectedTestType = this.OLTestType.Online;
  constructor(private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private authService: AuthenticationService,
    private courseService: CourcesService,
    private carouselService: CarouselService) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.ol_test_id = Id ? parseInt(Id) : 0;
      if (!this.ol_test_id) {
        const test_type = params.get('test_type');
        if (test_type == this.OLTestType.Online || this.OLTestType.Scorm == test_type) {
          this.selectedTestType = this.OLTestType.Online;
        }
        else {
          this.router.navigateByUrl(`/oltest`);
        }
      }
    });
    this.createOlTestForm = this.formBuilder.group({
      test_name: new FormControl('', [Validators.required]),
      test_type: new FormControl('', [Validators.required]),
      test_description: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
      attempt_allow: new FormControl('', [Validators.required]),
      allow_review: new FormControl('', [Validators.required]),
      randomize_section: new FormControl('', [Validators.required]),
      randomize_question: new FormControl('', [Validators.required])
    });
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
      this.createOlTestForm.addControl('scoring_type', new FormControl(''));
      this.createOlTestForm.addControl('question_submission', new FormControl('', [Validators.required]));
      this.createOlTestForm.addControl('question_submission', new FormControl('', [Validators.required]));
      // scoring_type: new FormControl('', [Validators.required]),
      // passed: new FormControl('', [Validators.required]),
      // failed: new FormControl(''),
      // quiz_result: new FormControl('')
    }
  }

  ngOnInit(): void {
  }

  requiredMessage(field: any) {
    return this.lableConstant.form_fieldname_cannot_be_blank.replace('<form fieldname>', field).replace('<nom du champ>', field);
  }

}
