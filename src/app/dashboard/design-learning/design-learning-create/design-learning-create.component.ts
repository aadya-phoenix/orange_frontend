import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { DesignLearningService } from 'src/app/shared/services/design-learning/design-learning.service';
import { GeneralDropdownsService } from 'src/app/shared/services/general-dropdowns/general-dropdowns.service';
import { DesignLearningForwardComponent } from '../design-learning-forward/design-learning-forward.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-design-learning-create',
  templateUrl: './design-learning-create.component.html',
  styleUrls: ['./design-learning-create.component.scss']
})
export class DesignLearningCreateComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  createDesignForm: FormGroup;
  dateFormate = dataConstant.dateFormate;
  designStatus = dataConstant.DesignStatus;
  RoleID = dataConstant.RoleID;
  designId:any=0;
  showobjective: any;
  bussinessUnitObj:any=[];
  projectManagerList:any=[];
  design_details:any={};
  design_details_status:string='';
  isSubmitted =false;
  isUpdate = false;
  isOtherBU = false;
  designAttachment = { file: '', ext: '' };
  isDesigner = false;
  isHeadDesigner = false;
  isProjectmanager = false;
  isBusinessConsultant = false;
  getUserrole: any = {};
  getprofileDetails: any = {};
  show_fields = false;
  public impactObj: any = [
    { id: 'high', name: 'High' },
    { id: 'medium', name: 'Medium' },
    { id: 'low', name: 'Low' },
  ];
  public tools: object = {
    items: [
      'UnorderedList']
  };
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private authService: AuthenticationService,
    private designService:DesignLearningService,
    private generalDrpdownsService:GeneralDropdownsService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private datepipe:DatePipe
  ) { 
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.getUserrole = this.authService.getRolefromlocal();
    this.isDesigner = this.getUserrole.includes(this.RoleID.DesignTeam);
    this.isHeadDesigner = this.getUserrole.includes(this.RoleID.HeadOfDesign);
    this.isBusinessConsultant = this.getUserrole.includes(this.RoleID.BussinessConsultant);

    this.createDesignForm = this.formBuilder.group({
      project_name: new FormControl('', [Validators.required]),
      key_sponsor: new FormControl('', [Validators.required]),
      requestor: new FormControl('', [Validators.required]),
      budget: new FormControl('',),
      requestor_department: new FormControl('', [Validators.required]),
      contributor: new FormControl('', [Validators.required]),
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
      attachment:new FormControl('', [])
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.designId = Id ? parseInt(Id) : 0;
      this.designId ? this.isUpdate = true : this.isUpdate = false;
      if(this.designId){
        this.getDesignDetails();
      }
    });
    this.getBusinessUnits();
    this.getProjectManager();
    if(this.isHeadDesigner){
       this.createDesignForm.addControl('project_manager', new FormControl(null, []));
     }
     else {
       this.createDesignForm.removeControl('project_manager');
     }
     if(this.isHeadDesigner || this.isDesigner){
      this.createDesignForm.addControl('who_create', new FormControl(null, []));
     }
    else {
      this.createDesignForm.removeControl('who_create');
    }
  }

  backToList(){
    this.router.navigate(['/designlearning']);
  }

  requiredMessage(field:any){
    return this.lableConstant.form_fieldname_cannot_be_blank.replace('<form fieldname>', field).replace('<nom du champ>', field);
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

  getDesignDetails() {
    this.commonService.showLoading();
    this.designService.detail(this.designId).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.design_details = res.data;
          this.design_details_status = res.data.status;
          this.createDesignForm.controls.project_name.setValue(this.design_details.project_name);
          this.createDesignForm.controls.key_sponsor.setValue(this.design_details.key_sponsor);
          this.createDesignForm.controls.requestor.setValue(this.design_details.requestor);
          this.createDesignForm.controls.budget.setValue(this.design_details.budget);
          this.createDesignForm.controls.requestor_department.setValue(this.design_details.requestor_department);
          if(this.design_details.other_requestor_department){
            this.isOtherBU =true;
            this.createDesignForm.addControl('other_requestor_department', new FormControl('', [Validators.required]));
            this.createDesignForm.controls.other_requestor_department.setValue(this.design_details.other_requestor_department);
          }
          else{
            this.isOtherBU = false;
            this.createDesignForm.removeControl('other_requestor_department');
          }
          this.createDesignForm.controls.contributor.setValue(this.design_details.contributor);
          this.createDesignForm.controls.explain_purpose.setValue(this.design_details.explain_purpose);
          this.createDesignForm.controls.objective.setValue(this.design_details.objective);
          this.createDesignForm.controls.kpi.setValue(this.design_details.kpi);
          this.createDesignForm.controls.target_audience.setValue(this.design_details.target_audience);
          this.createDesignForm.controls.learning_solution.setValue(this.design_details.learning_solution);
          this.createDesignForm.controls.impact.setValue(this.design_details.impact);
          this.createDesignForm.controls.success_factor.setValue(this.design_details.success_factor);
          this.createDesignForm.controls.knowledge.setValue(this.design_details.knowledge);
          this.createDesignForm.controls.duration.setValue(this.design_details.duration);
          this.createDesignForm.controls.size_target_audience.setValue(this.design_details.size_target_audience);
          this.createDesignForm.controls.launch_date.setValue(this.dateFormat(this.design_details.launch_date));
          this.createDesignForm.controls.audience_location.setValue(this.design_details.audience_location);
          this.createDesignForm.controls.comment.setValue(this.design_details.comment);
          this.createDesignForm.controls.learn_target_audience.setValue(this.design_details.learn_target_audience);
          if(this.design_details.project_manager){
            this.isProjectmanager = true;
            this.createDesignForm.addControl('project_manager', new FormControl(null, []));
            this.createDesignForm.controls.project_manager.setValue(this.design_details.project_manager);
          }
          if(this.design_details.who_create){
            this.createDesignForm.controls.who_create.setValue(this.design_details.who_create);
          }
          if(this.design_details.attachment){
            this.design_details.attachUrl = `${dataConstant.ImageUrl}/${this.design_details.attachment}`;
            this.design_details.attachment = null;
          }
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  getOtherBusinessUnit(item:any){
    if(item?.id == 8){
      this.isOtherBU = true;
      this.createDesignForm.addControl('other_requestor_department', new FormControl('', [Validators.required]));
    }
    else{
      this.isOtherBU = false;
      this.createDesignForm.removeControl('other_requestor_department');
    }
  }

  save(status:any){
   
    this.isSubmitted = true;
    if (this.createDesignForm.invalid) {
      return;
    }
    const body = this.createDesignForm.value;
    body.attachment = this.designAttachment.file;
    body.attachment_ext = this.designAttachment.ext;
    body.status = status; 
     if(this.designId){
      body.new_learning_id = this.designId;
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
        this.router.navigateByUrl("/designlearning");
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
        this.router.navigateByUrl("/designlearning");
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

  forward(){
    this.isSubmitted = true;
    if (this.createDesignForm.invalid) {
      return;
    }
    const body = this.createDesignForm.value;
    body.new_learning_id = this.designId;
    if(this.designAttachment.file){
    body.attachment = this.designAttachment.file;
    body.attachment_ext = this.designAttachment.ext;
    }
    this.designService.forwardRequest(body).subscribe(
      (res: any) => {
        if(res.status == 1){
        this.commonService.hideLoading();
        this.commonService.toastSuccessMsg('New Learning Module', 'Successfully Forwarded.');
        this.router.navigateByUrl("/designlearning");
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

  openModal(status: any) {
    this.isSubmitted = true;
    const body = this.createDesignForm.value;
    if (this.createDesignForm.invalid) {
      return;
    }
    
    if(this.designAttachment.file){
      body.attachment = this.designAttachment.file;
      body.attachment_ext = this.designAttachment.ext;
    }
    if(!this.designId){
      body.status = this.designStatus.pending;
      this.create(body);
      return;
    }
    this.design_details_status == this.designStatus.reject ? body.status = this.designStatus.pending:
    body.status = status;
    body.new_learning_id = this.designId;
    const modalRef = this.modalService.open(DesignLearningForwardComponent, {
      centered: true,
      size: 'xl',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      data: this.designId,
      objectDetail: body,
      status: status
    };
  }

  approve(){
    this.isSubmitted = true;
    if (this.createDesignForm.invalid) {
      return;
    }
    const body = this.createDesignForm.value;
    body.new_learning_id = this.designId;
    body.status = this.designStatus.approve;
    if(this.designAttachment.file){
      console.log("design",this.designAttachment)
    body.attachment = this.designAttachment.file;
    body.attachment_ext = this.designAttachment.ext;
    }
    this.designService.changeStatus(body).subscribe(
      (res: any) => {
        if(res.status == 1){
        this.commonService.hideLoading();
        this.commonService.toastSuccessMsg('New Learning Module', 'Successfully Forwarded.');
        this.router.navigateByUrl("/designlearning");
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

  isSubmit() {
    if (!this.design_details.status || !this.isDesigner || !this.isHeadDesigner) {
      return false;
    }
    return false;
  }

  isDraft(){
    if (this.design_details.status) {
      return false;
    }
    return true;
  }

  isReject(){
    console.log("this.design_details_status",this.design_details_status);
    if (this.isDesigner || this.isHeadDesigner) {
      return true;
    }
    if (this.design_details?.head_status != this.designStatus.reject || this.design_details?.head_status != this.designStatus.approve)  {
      return true;
    } 
     if (this.design_details_status == this.designStatus.pending)  {
      return true;
    } 
    return false;
  }

  getBusinessUnits(){
    this.generalDrpdownsService.getBusinessUnits().subscribe( (res: any) => {
      this.commonService.hideLoading();
      this.bussinessUnitObj = res.data;
    },
    (err: any) => {
      this.commonService.hideLoading();
      this.commonService.toastErrorMsg('Error', err.message);
    });
  }

  getProjectManager(){
    this.designService.getProjectManager().subscribe( (res: any) => {
      this.commonService.hideLoading();
      this.projectManagerList = res.data;
    },
    (err: any) => {
      this.commonService.hideLoading();
      this.commonService.toastErrorMsg('Error', err.message);
    });
  }

  dateFormat(date:any){
    const newdate = new Date(date);
    return this.datepipe.transform(newdate,'yyyy-MM-dd');
  }


}
