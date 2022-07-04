import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { DesignLearningService } from 'src/app/shared/services/design-learning/design-learning.service';
import { GeneralDropdownsService } from 'src/app/shared/services/general-dropdowns/general-dropdowns.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-design-learning-create',
  templateUrl: './design-learning-create.component.html',
  styleUrls: ['./design-learning-create.component.scss']
})
export class DesignLearningCreateComponent implements OnInit {

  createDesignForm: FormGroup;
  dateFormate = dataConstant.dateFormate;
  designStatus = dataConstant.DesignStatus;
  formId:any=0;
  bussinessUnitObj:any=[];
  isSubmitted =false;
  isUpdate = false;
  isOtherBU = false;
  designAttachment = { file: '', ext: '' };

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private designService:DesignLearningService,
    private generalDrpdownsService:GeneralDropdownsService,
    private router: Router,
    private route: ActivatedRoute,
  ) { 
    this.createDesignForm = this.formBuilder.group({
      project_name: new FormControl('', [Validators.required]),
      key_sponsor: new FormControl('', [Validators.required]),
      requestor: new FormControl('', [Validators.required]),
      budget: new FormControl('',),
      requestor_department: new FormControl('', [Validators.required]),
      contributor: new FormControl('', [Validators.required]),
      project_manager: new FormControl('', ),
      explain_purpose: new FormControl('', [Validators.required]),
      objective: new FormControl('', [Validators.required]),
      kpi: new FormControl('', [Validators.required]),
      target_audience: new FormControl('', [Validators.required]),
      learning_solution: new FormControl('', [Validators.required]),
      impact: new FormControl('', [Validators.required]),
      success_factor: new FormControl('', [Validators.required]),
      knowledge: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
      size_target_audience: new FormControl('', [Validators.required]),
      launch_date: new FormControl('', [Validators.required]),
      audience_location: new FormControl('', [Validators.required]),
      learn_target_audience: new FormControl('', [Validators.required]), 
      comment: new FormControl('', [Validators.required]),
      attachment:new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.getBusinessUnits();
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.formId = Id ? parseInt(Id) : 0;
      this.formId ? this.isUpdate = true : this.isUpdate = false;
    });
  }

  handleFileInput(event: any) {
    const fsize = event.target.files[0].size;
    const file = Math.round((fsize / 1024)/1024);
    if(file > dataConstant.maxImageSize){
      Swal.fire(
        'Images!',
        `Image is more than ${dataConstant.maxImageSize} mb. Please select valida file`,
        'warning'
      )
      return;
    }
    this.commonService.FileConvertintoBytearray(event.target.files[0], async (f) => {
      // creating array bytes
      this.designAttachment = { file: this.commonService.byteArrayTobase64(f.bytes), ext: f.name.split('.').pop() };
    });
  }

  getOtherBusinessUnit(item:any){
    if(item.id == 8){
      this.isOtherBU = true;
      this.createDesignForm.addControl('other_bussiness_unit', new FormControl('', [Validators.required]));
    }
    else{
      this.isOtherBU = false;
      this.createDesignForm.removeControl('other_bussiness_unit');
    }
  }

  save(status:any){
    console.log("test module 1",this.createDesignForm.value);
    this.isSubmitted = true;
    if (this.createDesignForm.invalid) {
      return;
    }
    const body = this.createDesignForm.value;
    body.attachment = this.designAttachment.file;
    body.attachment_ext = this.designAttachment.ext;
    body.status = status; 
     if(this.formId){
      body.digital_learning_id = this.formId;
      this.update(body);
    }
    else{
      this.create(body);
    } 
  }

  create(body:any){
    this.commonService.showLoading();
    this.designService.create(body).subscribe(
      (res: any) => {
        if(res.status == 1){
        this.commonService.hideLoading();
        this.commonService.toastSuccessMsg('New Learning Module', 'Successfully Created.');
        }
        else{
          this.commonService.hideLoading();
          this.commonService.toastErrorMsg('Error', res.message);
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      });
  }

  update(body:any){
    this.commonService.showLoading();
    this.designService.update(body).subscribe(
      (res: any) => {
        if(res.status == 1){
        this.commonService.hideLoading();
        this.commonService.toastSuccessMsg('New Learning Module', 'Successfully Updated.');
        }
        else{
          this.commonService.hideLoading();
          this.commonService.toastErrorMsg('Error', res.message);
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      });
  }

  getBusinessUnits(){
    this.generalDrpdownsService.getBusinessUnits().subscribe( (res: any) => {
      this.commonService.hideLoading();
      this.bussinessUnitObj = res.data;
    },
    (err: any) => {
      this.commonService.hideLoading();
      this.commonService.toastErrorMsg('Error', err.message);
    }
  );
  }

}
