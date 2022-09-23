import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import * as _ from 'lodash';
import { passwordMatchingValidatior } from 'src/app/shared/constant/customValidators';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { GeneralDropdownsService } from 'src/app/shared/services/general-dropdowns/general-dropdowns.service';
import { MessageService } from 'src/app/shared/services/message/message.service';
import Swal from 'sweetalert2';
const passwordRegexp = dataConstant.PasswordPattern;
const emailregexp = dataConstant.EmailPattren;

@Component({
  selector: 'app-message-create',
  templateUrl: './message-create.component.html',
  styleUrls: ['./message-create.component.scss']
})
export class MessageCreateComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  dateTimeFormate = dataConstant.dateTimeFormate;
  createMessageForm: FormGroup;
  message_id: any;
  message_details: any;
  isCreate = false;
  isSubmitted = false;

  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private commonService: CommonService,
    private router: Router,) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.createMessageForm = this.formBuilder.group({
      message: new FormControl('', [Validators.required]),
      start_date: new FormControl('', [Validators.required]),
      end_date: new FormControl('', [Validators.required]),
      status: new FormControl('active', []),
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.message_id = Id ? parseInt(Id) : 0;
      if (this.message_id) {
        this.isCreate = false;
        this.getUserDetails();
      }
      else {
        this.isCreate = true;
      }
    });
  }

  requiredMessage(field: any) {
    return this.lableConstant.form_fieldname_cannot_be_blank.replace('<form fieldname>', field).replace('<nom du champ>', field);
  }

  getUserDetails() {
    this.commonService.showLoading();
    this.messageService.getMessageDetails(this.message_id).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1) {
          this.message_details = res.data;
          this.createMessageForm.controls.message.setValue(this.message_details.message);
          this.createMessageForm.controls.start_date.setValue(this.message_details.start_date);
          this.createMessageForm.controls.end_date.setValue(this.message_details.end_date);
          this.createMessageForm.controls.status.setValue(this.message_details.status);
        }
        else {
          this.commonService.toastErrorMsg('Error', res.message);
          this.commonService.hideLoading();
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  cancel(){
    this.router.navigateByUrl(`/message`);
  }

  save() {
    this.isSubmitted = true;
    if (this.createMessageForm.invalid) {
      return;
    }
    const body = this.createMessageForm.value;
    this.message_id ? this.update(body) : this.create(body) ;
  }

  create(body: any) {
    this.commonService.showLoading();
    this.messageService.createMessage(body).subscribe(
      (res: any) => {
        if (res.status === 1) {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('Message', 'Successfully Created.');
          this.router.navigateByUrl(`/message`);
        }
        else {
          this.commonService.toastErrorMsg('Error', res.message);
          this.commonService.hideLoading();
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  update(body: any) {
    this.commonService.showLoading();
    this.messageService.updateMessage(body, this.message_id).subscribe(
      (res: any) => {
        if (res.status == 1) {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('Message', 'Successfully Updated.');
          this.router.navigateByUrl(`/message`);
        }
        else {
          this.commonService.toastErrorMsg('Error', res.message);
          this.commonService.hideLoading();
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }
 
}
