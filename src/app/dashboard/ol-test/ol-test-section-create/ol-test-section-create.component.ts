import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { OlTestService } from 'src/app/shared/services/ol-test/ol-test.service';

@Component({
  selector: 'app-ol-test-section-create',
  templateUrl: './ol-test-section-create.component.html',
  styleUrls: ['./ol-test-section-create.component.scss']
})
export class OlTestSectionCreateComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  createSectionForm: FormGroup;
  isSubmitted = false;
  constructor(private formBuilder: FormBuilder,
    private modalService: NgbActiveModal,
    private olTestService: OlTestService,
    private commonService: CommonService,
    private router: Router) {
      this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.createSectionForm = this.formBuilder.group({
      section: new FormControl('', [Validators.required]),
    });
  }
  objectDetail: any;
  title: any;
  test_id  = 0;
  backOfficePublisher: any = [];
  copyDeletecourse: any;
  ngOnInit(): void {
    this.objectDetail = this.props.objectDetail ? this.props.objectDetail : '';
    this.test_id = this.props.test_id;
    this.title = this.props.title;
    //this.getBackOfficePublisher();
  }

  requiredMessage(field:any){
    return this.lableConstant.form_fieldname_cannot_be_blank.replace('<form fieldname>', field).replace('<nom du champ>', field);
  }

  // getBackOfficePublisher() {
  //   this.commonService.showLoading();
  //   this.backOfficeService.getBackOfficePublisher().subscribe(
  //     (res: any) => {
  //       this.commonService.hideLoading();
  //       this.backOfficePublisher = res.data;
  //     },
  //     (err: any) => {
  //       this.commonService.hideLoading();
  //       this.commonService.errorHandling(err);
  //     }
  //   );
  // }

  createSection() {
    this.isSubmitted = true;
    if (this.createSectionForm.invalid) {
      return;
    }
    if (!this.props.objectDetail.id) {
      var data = {
        section: this.createSectionForm.value.section
      };
      this.commonService.showLoading();
      this.olTestService.createSection(data, this.test_id).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('BackOffice', 'Successfully Transfered.');
          this.modalService.close();
          this.router.navigate(['/back-office']);
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.errorHandling(err);
        }
      );
    }
    else {
      this.passEntry.next(this.createSectionForm.value.publisher_id);
      this.modalService.close();
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
