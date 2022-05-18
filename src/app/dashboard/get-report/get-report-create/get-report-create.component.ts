import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { GetReportService } from 'src/app/shared/services/get-report/get-report.service';
import Swal from 'sweetalert2';
import { GetReportPublishComponent } from '../get-report-publish/get-report-publish.component';

@Component({
  selector: 'app-get-report-create',
  templateUrl: './get-report-create.component.html',
  styleUrls: ['./get-report-create.component.scss']
})
export class GetReportCreateComponent implements OnInit {

  today = new Date();
  minStartDate = {};
  selectedStartDate :any={};
  selectedEndDate :any ={};
  report_id:number=0;
  get_report_details: any = {};
  reportStatus= dataConstant.GetReportStatus;
  dateFormate = dataConstant.dateFormate;
  RoleID = dataConstant.RoleID;

  reportTypeObj: any = [];
  businessUnitsObj:any = [];
  transcriptStatusObj:any =[];
  certificationStatusObj:any = [];
  regionObj:any =[];
  countryObj:any =[];
  rocObj:any =[];
  status_comment:string='';

  getUserrole: any = {};
  getprofileDetails: any = {};
  getReportForm: FormGroup;
  addDate = false;
  isCertification:boolean = false;
  isAvailableHistory:boolean=false;
  isSubmitted:boolean = false;
  isSpecificCountry:boolean=true;
  isOtherBussinessUnit:boolean=false;

  isRoc = false;
  isDataAnalyst = false;
  isRequester = false;
  isRocAction = false;
  isDAaction = false;
  getForm:boolean = false;
  getComment:boolean = false;

  getreportAttachment = { file: '', ext: '' };
  reportAttachment = {file: '', ext: ''};
  rocStatus:string='';

  report_count = {
    total: 0,
    draft: 0,
    closed: 0,
    rejected: 0,
    pending: 0,
    submitted: 0,
    transferred: 0,
    publish: 0
  }
  statusObj=[{name:'Close',id:'publish'},{name:'Reject',id:'reject'}];
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private authService: AuthenticationService,
    private getReportService: GetReportService,
    private courseService:CourcesService,
    private datepipe:DatePipe) {
    this.minStartDate = `${this.today.getFullYear()}-${("0" + (this.today.getMonth() + 1)).slice(-2)}-${("0" + this.today.getDate()).slice(-2)}`;

    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.getUserrole = this.authService.getRolefromlocal();
    this.isRoc = this.getUserrole.id === this.RoleID.Roc;
    this.isDataAnalyst = this.getUserrole.id === this.RoleID.DataAnalyst;
    this.isRequester = this.getUserrole.id === this.RoleID.RequesterID;
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.report_id = Id ? parseInt(Id) : 0;
      this.getReportDetails();
     });
      
     this.getReportForm= this.formBuilder.group({
        report_type: new FormControl('', [Validators.required]),
        title: new FormControl('', [Validators.required]),
        transcript_status: new FormControl('', []),
        certification_vendor: new FormControl('',  []),
        certification_domain: new FormControl('',  []),
        certification_status: new FormControl('',  []),
        region_name: new FormControl('', []),
        country: new FormControl('', []),
        business_unit: new FormControl('', []),
        other_business_unit:new FormControl('', []),
        management_code: new FormControl('', []),
        all_available_history: new FormControl('', []),
        date_type:new FormControl('', []),
        start_date: new FormControl('', []),
        end_date: new FormControl('', []),
        contact_person: new FormControl('', []),
        report_purpose: new FormControl('', []),
        deadline: new FormControl('', [Validators.required]),
        attachment: new FormControl('', []),
        additional_comment: new FormControl('', []),
        regional_cordinator: new FormControl('', []),
        additional_attachment:new FormControl('',[]),
        status_comment:new FormControl('',[])
     });

    }

  ngOnInit(): void {
    this.getReportType();
    this.getBusinessUnits();
    this.getTranscriptStatus();
    this.getCertificationStatus();
    this.getRegions();
    this.getCountries();
    this.getRegionalCordinator();
  }

  getRegionName(regions:any){
   this.isSpecificCountry = true;
   for(let region of regions){
     if (region.name=='Global'){
       this.isSpecificCountry = false;
       this.getReportForm.get('country')?.patchValue(null);
     }
   }
  }

  getDate(event:any){
    this.today =new Date();
    this.selectedStartDate ={};
    this.selectedEndDate = {};
   let selectedDate = event.target.value;
    if(selectedDate == 'last_year'){
      this.selectedStartDate = this.datepipe.transform(new Date((new Date().getFullYear() - 1),0,1),'yyyy-MM-dd');
      this.getReportForm.controls.start_date.setValue(this.selectedStartDate);
      
      this.selectedEndDate =  this.datepipe.transform(new Date((new Date().getFullYear() - 1),11, 31),'yyyy-MM-dd');
      this.getReportForm.controls.end_date.setValue(this.selectedEndDate);
      this.addDate = true;
    }

    if(selectedDate == 'this_year'){
      this.selectedStartDate = this.datepipe.transform(new Date(new Date().getFullYear() ,0,1),'yyyy-MM-dd');
      this.getReportForm.controls.start_date.setValue(this.selectedStartDate);
      
      this.selectedEndDate = this.datepipe.transform(this.today,'yyyy-MM-dd');
      this.getReportForm.controls.end_date.setValue(this.selectedEndDate);
      this.addDate = true;
    }

    if(selectedDate == 'last_month'){
      this.selectedStartDate = this.datepipe.transform(new Date(this.today.getFullYear(), this.today.getMonth() - 1,1),'yyyy-MM-dd');
      this.getReportForm.controls.start_date.setValue(this.selectedStartDate);
      
      this.selectedEndDate = this.datepipe.transform(new Date(this.today.getFullYear(), this.today.getMonth() ,0),'yyyy-MM-dd');
      this.getReportForm.controls.end_date.setValue(this.selectedEndDate);
      this.addDate = true;
    }

    if(selectedDate == 'this_month'){
      this.selectedStartDate = this.datepipe.transform(new Date(this.today.getFullYear(), this.today.getMonth() ,1),'yyyy-MM-dd');
      this.getReportForm.controls.start_date.setValue(this.selectedStartDate);
      
      this.selectedEndDate = this.datepipe.transform(this.today,'yyyy-MM-dd');
      this.getReportForm.controls.end_date.setValue(this.selectedEndDate);
      this.addDate = true;
    }

    if(selectedDate == 'last_week'){
      let target = 1
      this.selectedStartDate = this.today;
      let newStartDate=this.datepipe.transform(this.selectedStartDate.setDate(this.selectedStartDate.getDate() - ( this.selectedStartDate.getDay() == target ? 7 : (this.selectedStartDate.getDay() + (7 - target)) % 7 )),'yyyy-MM-dd');
      this.getReportForm.controls.start_date.setValue(newStartDate);
      this.today =new Date();
     this.selectedEndDate = this.datepipe.transform(new Date(this.today.getFullYear(),this.today.getMonth(),this.selectedStartDate.getDate()+6),'yyyy-MM-dd');
      this.getReportForm.controls.end_date.setValue(this.selectedEndDate);
      this.addDate = true;
    }

    if(selectedDate == 'this_week'){
      const first = this.today.getDate() - this.today.getDay() + 1;
      this.selectedStartDate = this.datepipe.transform(new Date(this.today.setDate(first)),'yyyy-MM-dd');
      this.getReportForm.controls.start_date.setValue(this.selectedStartDate);
      this.today =new Date();
      this.selectedEndDate = this.datepipe.transform(this.today,'yyyy-MM-dd');
      this.getReportForm.controls.end_date.setValue(this.selectedEndDate);
      this.addDate = true;
    }

    if(selectedDate == 'custom'){
      this.addDate = false;
      this.getReportForm.controls.start_date.setValue('');
      this.getReportForm.controls.end_date.setValue('');
    }
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
      this.getreportAttachment = { file: this.commonService.byteArrayTobase64(f.bytes), ext: f.name.split('.').pop() };
    });
  }

  handleAdditionFileInput(event: any){
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
      this.reportAttachment = { file: this.commonService.byteArrayTobase64(f.bytes), ext: f.name.split('.').pop() };
    });
  }

  changeReportType(event:any){
    this.getForm = true;
    let type = event.id;
    if(type == 1){
    this.isCertification = false;

    this.getReportForm.get('transcript_status')?.setValidators(Validators.required);
    this.getReportForm.get('certification_vendor')?.clearValidators();
    this.getReportForm.get('certification_domain')?.clearValidators();
    this.getReportForm.get('certification_status')?.clearValidators();
    this.getReportForm.get('certification_vendor')?.patchValue(null);
    this.getReportForm.get('certification_domain')?.patchValue(null);
    this.getReportForm.get('certification_status')?.patchValue(null);
    }
    else{
      this.isCertification = true;

      this.getReportForm.get('certification_vendor')?.setValidators(Validators.required);
      this.getReportForm.get('certification_domain')?.setValidators(Validators.required);
      this.getReportForm.get('certification_status')?.setValidators(Validators.required);
      this.getReportForm.get('transcript_status')?.clearValidators();
      this.getReportForm.get('transcript_status')?.patchValue(null);
    }
  }

  getOtherBussinessUnit(event:any){
    let business_unit = event.team_name;
      if (business_unit =='Others'){
        this.isOtherBussinessUnit = true;
      }
      else{
        this.isOtherBussinessUnit = false;
        this.getReportForm.get('other_business_unit')?.patchValue(null);
      }
    
  }

  getRocStatus(event:any){
    console.log("event roc",event.id);
    this.rocStatus = event.id;
  }

  save(status:any){
    this.isSubmitted = true;
    if (this.getReportForm.invalid) {
      return;
    }
    const body = this.getReportForm.value;
    body.attachment = this.getreportAttachment.file;
    body.attachment_ext = this.getreportAttachment.ext;
    body.additional_attachment = this.reportAttachment.file;
    body.additional_attachment_ext = this.reportAttachment.ext;
    if(this.rocStatus){
      body.status = this.rocStatus;
    }
    else{
    body.status = status;
    }
    if (!this.report_id) {
      this.commonService.showLoading();
      this.getReportService.createReport(body).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          this.router.navigateByUrl(`/dashboard/olreport`);
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.toastErrorMsg('Error', err.message);
        }
      );
    }
    else {
      body.report_id = this.report_id;
      this.commonService.showLoading();
      this.getReportService.updateReport(body).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('Get Report', 'Successfully Saved.');
          this.router.navigateByUrl(`/dashboard/olreport/view/${this.report_id}`);
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.toastErrorMsg('Error', err.message);
        }
      );
    }
  }

  getAvailableHistory(event:any){
    this.isAvailableHistory = !this.isAvailableHistory;
    if(this.isAvailableHistory){
      this.getReportForm.controls.start_date.setValue('');
      this.getReportForm.controls.end_date.setValue('');
    }
  }

  dateFormat(date:any){
    const newdate = new Date(date);
    const newdate1 =  `${newdate.getFullYear()}-${newdate.getMonth()+1}-${newdate.getDate()}`; 
    return this.datepipe.transform(newdate,'yyyy-MM-dd');
  }

  getReportDetails() {
    if(!this.report_id){
      return
    }
    else{
    this.commonService.showLoading();
    this.getReportService.getReportDetails(this.report_id).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.get_report_details = res.data;
          this.getForm = true;
          this.getReportForm.controls.report_type.setValue(this.get_report_details.report_type);
          this.getReportForm.controls.title.setValue(this.get_report_details.title);
          if(this.get_report_details.report_type == 'Certifications'){
            this.isCertification = true;
            this.getReportForm.controls.certification_vendor.setValue(this.get_report_details.certification_vendor);
            this.getReportForm.controls.certification_domain.setValue(this.get_report_details.certification_domain);
            this.getReportForm.controls.certification_status.setValue(this.get_report_details.certification_status);
          }
          else{
            this.isCertification = false;
            this.getReportForm.controls.transcript_status.setValue(this.get_report_details.transcript_status);
          }
          this.getReportForm.controls.region_name.setValue(JSON.parse(this.get_report_details.region_name));
          if(this.get_report_details.country){
           this.isSpecificCountry = true;
           this.getReportForm.controls.country.setValue(this.get_report_details.country);
          }
          else{
            this.isSpecificCountry = false;
          }
          this.getReportForm.controls.business_unit.setValue(this.get_report_details.business_unit);
          if(this.get_report_details.other_business_unit){
            this.isOtherBussinessUnit = true;
            this.getReportForm.controls.other_business_unit.setValue(this.get_report_details.other_business_unit);
          }
          this.getReportForm.controls.management_code.setValue(this.get_report_details.management_code);
          this.getReportForm.controls.contact_person.setValue(this.get_report_details.contact_person);
          this.getReportForm.controls.all_available_history.setValue(this.get_report_details.all_available_history == "1" ? true : false);
           if(this.get_report_details.all_available_history == "1"){
            this.isAvailableHistory = true; 
          }
          else{
             this.isAvailableHistory = false;
             this.getReportForm.controls.date_type.setValue(this.get_report_details.date_type);
             this.getReportForm.controls.start_date.setValue(this.dateFormat(this.get_report_details.start_date));
             this.getReportForm.controls.end_date.setValue(this.dateFormat(this.get_report_details.end_date));
           }

          this.getReportForm.controls.report_purpose.setValue(this.get_report_details.report_purpose);
          this.getReportForm.controls.deadline.setValue(this.dateFormat(this.get_report_details.deadline));
          if(this.get_report_details.attachment){
            this.get_report_details.attachUrl = `${dataConstant.ImageUrl}/${this.get_report_details.attachment}`;
            this.get_report_details.attachment = null;
          }
          this.getReportForm.controls.additional_comment.setValue(this.get_report_details.additional_comment);
          if (this.isRequester) {  
           this.getReportForm.controls.regional_cordinator.setValue(this.get_report_details.regional_cordinator);
          }
          if(this.isDataAnalyst){
            if(this.get_report_details.status_show == this.reportStatus.pending){
              this.isDAaction =true;
            }
          }
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
    }
  }

  isDraft() {
    if (this.get_report_details?.status === this.reportStatus.closed || this.get_report_details?.status === this.reportStatus.pending || this.get_report_details?.status === this.reportStatus.reject) {
      return false;
    }
    if (this.getprofileDetails.data.id != this.get_report_details?.user_id && this.get_report_details?.transfer_user_id && !this.get_report_details?.publisher_status ) {
      return false;
    }
    return true;
  }

  isReject() {
    if (this.get_report_details?.status === this.reportStatus.publish || this.get_report_details?.status === this.reportStatus.expired || this.get_report_details?.status === this.reportStatus.reject) {
      return false;
    }
    if (this.isRequester || !this.get_report_details.id) {
      return false;
    }
    if (this.get_report_details?.status === this.reportStatus.draft) {
      return false;
    }
    if (this.get_report_details?.transfer_user_id && !this.get_report_details?.publisher_status ) {
      return false;
    }
    return true;
  }

  isPublish() {
    if (this.get_report_details?.status === this.reportStatus.publish || this.get_report_details?.status === this.reportStatus.expired) {
      return false;
    }
    if (!this.isDataAnalyst) {
      return false;
    }
    if (this.getprofileDetails.data.id != this.get_report_details?.user_id && this.get_report_details?.transfer_user_id && !this.get_report_details?.publisher_status) {
      return false;
    }
    return true;
  }

  isSubmit() {
    if (this.get_report_details?.status === this.reportStatus.publish || this.get_report_details?.status === this.reportStatus.expired) {
      return false;
    }
    if (this.getprofileDetails.data.id === this.get_report_details?.user_id && this.get_report_details?.status === this.reportStatus.pending) {
      return false;
    }
    if (this.isDataAnalyst) {
      return false;
    }
    if (this.getprofileDetails.data.id != this.get_report_details?.user_id && this.get_report_details?.transfer_user_id && !this.get_report_details?.publisher_status ) {
      return false;
    }

    return true;
  }

  isRocSubmit(){
    if(this.isRoc && this.get_report_details?.status === this.reportStatus.pending && 
      this.getprofileDetails.data.id != this.get_report_details?.user_id){
      return true;
    }
    else{
      return false;
    }
  }

  getRocAction(event:any){
   this.getComment = true;
   let rocaction = event.target.value;
   if(rocaction == 'roc'){
     this.isRocAction = true;
   }
   else{
     this.isRocAction = false;
   }
  }

  statusChangeRequest(status: any) {
    const modalRef = this.modalService.open(GetReportPublishComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: `Request ${status == this.reportStatus.reject ? "Reject" : "Publish"}`,
      status: status,
      data: this.get_report_details.id,
      objectDetail: this.get_report_details
    };
  }

  getRegionalCordinator(){
    this.courseService.getNewregionalCordinator().subscribe((res: any) => {
       this.rocObj = res.data;
     },(err: any) => {
       console.log(err);
     });
  }

  getReportType(){
    this.commonService.showLoading();
    this.getReportService.getReportType().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.reportTypeObj = res.data;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  getBusinessUnits(){
    this.commonService.showLoading();
    this.getReportService.getBusinessUnits().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.businessUnitsObj = res.data;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  getTranscriptStatus(){
    this.commonService.showLoading();
    this.getReportService.getTranscriptStatus().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.transcriptStatusObj = res.data;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  getCertificationStatus(){
    this.commonService.showLoading();
    this.getReportService.getCertificationStatus().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.certificationStatusObj = res.data;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  getRegions(){
    this.commonService.showLoading();
    this.getReportService.getRegions().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.regionObj = res.data;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  getCountries(){
   this.courseService.getCountries().subscribe(
     (res: any) => {
       this.countryObj = res.data;
     },(err: any) => {
       console.log(err);
     });
  }

}
