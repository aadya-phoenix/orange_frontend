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
  minDate = {};
  maxDate = {};
  today = new Date();
  isCreate = false;
  isSubmitted = false;
  statusList = [{name:'Active', id:'active'},{name:'Deactive', id:'deactive'}]

  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private commonService: CommonService,
    private router: Router,) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.minDate = `${this.today.getFullYear()}-${("0" + (this.today.getMonth() + 1)).slice(-2)}-${("0" + this.today.getDate()).slice(-2)}`;
    this.createMessageForm = this.formBuilder.group({
      message: new FormControl('', [Validators.required]),
      start_date: new FormControl('', [Validators.required]),
      end_date: new FormControl('', [Validators.required]),
      status: new FormControl('active', []),
    });
    this.createMessageForm.get("start_date")?.valueChanges.subscribe((x: {}) => {
      this.maxDate = x;
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
          const start_date = new Date(this.message_details.start_date);
          const end_date = new Date(this.message_details.end_date);
          this.message_details.start_date = `${start_date.getFullYear()}-${("0" + (start_date.getMonth() + 1)).slice(-2)}-${("0" + start_date.getDate()).slice(-2)}`;
          this.message_details.end_date = `${end_date.getFullYear()}-${("0" + (end_date.getMonth() + 1)).slice(-2)}-${("0" + end_date.getDate()).slice(-2)}`;
          this.createMessageForm.patchValue(this.message_details);
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
    body.message_id = this.message_id;
    this.messageService.updateMessage(body).subscribe(
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
