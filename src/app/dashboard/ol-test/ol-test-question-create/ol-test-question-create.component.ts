import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { BackOfficeService } from 'src/app/shared/services/back-office/back-office.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { OlTestService } from 'src/app/shared/services/ol-test/ol-test.service';

@Component({
  selector: 'app-ol-test-question-create',
  templateUrl: './ol-test-question-create.component.html',
  styleUrls: ['./ol-test-question-create.component.scss']
})
export class OlTestQuestionCreateComponent implements OnInit {

  lableConstant: any = { french: {}, english: {} };
  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  createQuestionForm: FormGroup;
  isSubmitted = false;
  isOLTest = true;
  questionList = dataConstant.OLTestQuestion;
  constructor(private formBuilder: FormBuilder,
    private modalService: NgbActiveModal,
    private olTestService: OlTestService,
    private commonService: CommonService,
    private router: Router) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.createQuestionForm = this.formBuilder.group({
      section_id: new FormControl('', []),
      question: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      correct_answer: new FormControl('', [Validators.required]),
      option: new FormControl('', []),
      file: new FormControl('', []),
      feedback: new FormControl('', []),
      correct_feedback: new FormControl('', []),
      incorrect_feedback: new FormControl('', []),
      try_again_feedback: new FormControl('', []),
      active: new FormControl('', []),
      none: new FormControl(false, []),
      all: new FormControl(false, []),
    });
  }
  objectDetail: any = {};
  title = '';
  id = 0;
  sectionList: any = [];
  requestData: any = {};
  ngOnInit(): void {
    this.objectDetail = this.props.objectDetail ? this.props.objectDetail : '';
    this.title = this.props.title;
    this.isOLTest = this.objectDetail.test_type == dataConstant.OLTestType.Online ? true : false;
    this.id = this.props.question_id;
    if (this.id) {
      this.getQuestionDetails();
    }
  }

  requiredMessage(field: any) {
    return this.lableConstant.form_fieldname_cannot_be_blank.replace('<form fieldname>', field).replace('<nom du champ>', field);
  }

  getQuestionDetails() {
    this.commonService.showLoading();
    this.olTestService.getQuestionDetails(this.objectDetail.id, this.id).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.requestData = res.data;
        this.createQuestionForm.patchValue(this.requestData);
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  createSection() {
    this.isSubmitted = true;
    if (this.createQuestionForm.invalid) {
      return;
    }
    if (!this.id) {
      const data = this.createQuestionForm.value;
      this.commonService.showLoading();
      this.olTestService.createQuestion(data, this.objectDetail.id).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('Question', 'Successfully created.');
          this.modalService.close();
          this.router.navigateByUrl(`/oltest/view/${this.objectDetail.id}`);
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.errorHandling(err);
        }
      );
    }
    else {
      let data = this.createQuestionForm.value;
      data.question_id = this.id;
      this.commonService.showLoading();
      this.olTestService.updateQuestion(data, this.objectDetail.id).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('Question', 'Successfully updated.');
          this.modalService.close();
          this.router.navigateByUrl(`/oltest/view/${this.objectDetail.id}`);
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.errorHandling(err);
        }
      );
    }
  }

  closeModal() {
    this.modalService.close();
  }

  onClose() {
    this.passEntry.next();
    this.modalService.close();
  }

}
