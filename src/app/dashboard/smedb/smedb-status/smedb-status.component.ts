import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { SMEService } from 'src/app/shared/services/sme/sme.service';

@Component({
  selector: 'app-smedb-status',
  templateUrl: './smedb-status.component.html',
  styleUrls: ['./smedb-status.component.scss']
})
export class SmedbStatusComponent implements OnInit {

  @Input() props: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  lableConstant: any = { french: {}, english: {} };
  publishSMEForm: FormGroup;
  isSubmitted = false;
  isSMEStatus= false;
  status = '';
  SMEStatus = dataConstant.SMEStatus;
  constructor(private formBuilder: FormBuilder,
    private modalService: NgbActiveModal,
    private SMEService: SMEService,
    private commonService: CommonService) {
      this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
      this.publishSMEForm = this.formBuilder.group({
        status_comment: new FormControl('', [Validators.required]),
      });
  }
  public historyList: any;
  public objectDetail: any;
  public modalType: any;
  public title: any;
  remainingText: any = 500;
  ngOnInit(): void {
    this.objectDetail = this.props.objectDetail ? this.props.objectDetail : '';
    this.title = this.props.title;
    this.status = this.props.status;
    this.isSMEStatus = this.props.isSMEStatus;
    this.publishSMEForm.get("status_comment")?.valueChanges.subscribe(() => {
      this.valueChange();
    });
  }

  requiredMessage(field:any){
    return this.lableConstant.form_fieldname_cannot_be_blank.replace('<form fieldname>', field).replace('<nom du champ>', field);
  }

  publishSME() {
    this.isSubmitted = true;
    if (this.publishSMEForm.invalid) {
      return;
    }
    this.commonService.showLoading();
    if(this.isSMEStatus){
      const data = {
        sme_id: this.props.objectDetail.id,
        status_comment: this.publishSMEForm.value.status_comment,
        sme_status: this.props.status
      };
      this.SMEService.SMEStatus(data).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('SME Datbase', `Successfully ${this.props.status}.`);
          this.modalService.close();
          this.passEntry.next();
         },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.errorHandling(err); 
        }
      );
    }
    else{
      const data = {
        sme_id: this.props.objectDetail.id,
        status_comment: this.publishSMEForm.value.status_comment,
        status: this.props.status
      };
    this.SMEService.SMEDatabaseStatus(data).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.commonService.toastSuccessMsg('SME Datbase', `Successfully ${this.props.status}.`);
        this.modalService.close();
        this.passEntry.next();
       },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err); 
      }
    );
    }
  }

  closeModal() {
    this.passEntry.next();
    this.modalService.close();
  }

  onClose() {
    this.passEntry.next();
    this.modalService.close();
  }

  valueChange() {
    if (this.publishSMEForm.value.status_comment) {
      this.remainingText = 500 - this.publishSMEForm.value.status_comment.length;
    }
    else {
      this.remainingText = 500;
    }
  }

}
