import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { GeneralDropdownsService } from 'src/app/shared/services/general-dropdowns/general-dropdowns.service';
import { GetReportService } from 'src/app/shared/services/get-report/get-report.service';
import Swal from 'sweetalert2';
import { GetReportCloseOnUpdateComponent } from '../get-report-close-on-update/get-report-close-on-update.component';

@Component({
  selector: 'app-get-report-create',
  templateUrl: './get-report-create.component.html',
  styleUrls: ['./get-report-create.component.scss']
})
export class GetReportCreateComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  today = new Date();
  minStartDate = {};
  selectedStartDate :any={};
  selectedEndDate :any ={};
  report_id:number=0;
  course_id:number=0;
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
  coursedata:any={};
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
  remainingText: any = 500;
  isRoc = false;
  isDataAnalyst = false;
  isRequester = false;
  isRocAction = false;
  isDAaction = false;
  isRocTransfer = false;
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
    private generalDrpdownsService: GeneralDropdownsService,
    private courseService:CourcesService,
    private datepipe:DatePipe) {
      this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.minStartDate = `${this.today.getFullYear()}-${("0" + (this.today.getMonth() + 1)).slice(-2)}-${("0" + this.today.getDate()).slice(-2)}`;

    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.getUserrole = this.authService.getRolefromlocal();
    this.isRoc = this.getUserrole.includes(this.RoleID.Roc);
    this.isDataAnalyst = this.getUserrole.includes(this.RoleID.DataAnalyst);
    this.isRequester = this.getprofileDetails.data?.staff == 1 ? true : false;
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.report_id = Id ? parseInt(Id) : 0;
      const course_id = params.get('course_id')
      this.course_id = course_id ? parseInt(course_id) : 0 ;
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
    this.getTotalCount();
  }

  requiredMessage(field:any){
    return this.lableConstant.form_fieldname_cannot_be_blank.replace('<form fieldname>', field).replace('<nom du champ>', field);
  }

  getTotalCount() {
    this.commonService.showLoading();
    this.getReportService.getReportList().subscribe(
      (res: any) => {
        this.report_count = res.data.get_report_count;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
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
      var dateNow = new Date();
      var firstDayOfTheWeek = (dateNow.getDate() - dateNow.getDay()) + 1; 
      var lastDayOfTheWeek = firstDayOfTheWeek + 6;
      var firstDayOfLastWeek = new Date(dateNow.setDate(firstDayOfTheWeek - 7)) as any;
      var lastDayOfLastWeek = new Date(dateNow.setDate(lastDayOfTheWeek - 7)) as any;
      this.selectedStartDate = this.datepipe.transform(firstDayOfLastWeek,'yyyy-MM-dd');
      this.getReportForm.controls.start_date.setValue(this.selectedStartDate);

      this.selectedEndDate = this.datepipe.transform(lastDayOfLastWeek,'yyyy-MM-dd');
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
    if(body.status == 'reject'){
     // this.changeStatusGetReport(body.status);
      return;
    }
    if (!this.report_id) {
      this.commonService.showLoading();
      this.getReportService.createReport(body).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          this.router.navigateByUrl(`/olreport`);
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.errorHandling(err);
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
          this.router.navigateByUrl(`/olreport/view/${this.report_id}`);
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.errorHandling(err);
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
    return this.datepipe.transform(newdate,'yyyy-MM-dd');
  }

  getReportDetails() {
    if(this.course_id){
      this.getCourseDetails();
    }
    else if(!this.report_id){
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
        this.commonService.errorHandling(err);
      }
    );
    }
  }

  getCourseDetails() {
    this.commonService.showLoading();
    this.courseService.courseDetail(this.course_id).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.coursedata = res.data;
          const selectedType = this.reportTypeObj.find((x: { id: number; }) => x.id == 1);
          this.changeReportType({id:1});
          this.getReportForm.controls.report_type.setValue(selectedType.name);
          this.getReportForm.controls.title.setValue(
            this.courseService.getTText(this.coursedata['title']));
        }
      },
      (err: any) => {
        this.commonService.errorHandling(err);
        this.commonService.hideLoading();
      }
    );
  }

  valueChange(status:string) {
    if(status == 'comment'){
      if (this.getReportForm.value.additional_comment) {
        this.remainingText = 500 - this.getReportForm.value.additional_comment.length;
      }
      else {
        this.remainingText = 500;
      }
    }
    if(status == 'status_comment'){
      if (this.getReportForm.value.status_comment) {
        this.remainingText = 500 - this.getReportForm.value.status_comment.length;
      }
      else {
        this.remainingText = 500;
      }
    }
  }

  statusChangeRequest(status:any){
    var data = {
      report_id: this.get_report_details.id,
      status: status,
    };
    this.getReportService.changeReportStatus(data).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.commonService.toastSuccessMsg('GetReport', `Successfully ${status}.`);
        this.router.navigate(['/olreport']);
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  } 

  closeRequest(status:any){
    const body = this.getReportForm.value;
    body.attachment = this.getreportAttachment.file;
    body.attachment_ext = this.getreportAttachment.ext;
    const modalRef = this.modalService.open(GetReportCloseOnUpdateComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: `Request Close`,
      status: status,
      data: this.report_id,
      objectDetail: body
    };
  }

  isDraft() {
    if (this.get_report_details?.status === this.reportStatus.publish || this.get_report_details?.status === this.reportStatus.pending || this.get_report_details?.status === this.reportStatus.reject) {
      return false;
    }
    if (this.getprofileDetails.data.id != this.get_report_details?.user_id && this.get_report_details?.transfer_user_id && !this.get_report_details?.publisher_status ) {
      return false;
    }
    if(this.get_report_details?.status_show == this.reportStatus.submitted){
       return false;
    }
    
    return true;
  }

  isReject() {
    if (this.get_report_details?.status_show === this.reportStatus.pending && (this.isRoc || this.isDataAnalyst)) {
      return true;
    }
    
    return false;
  }

  isPublish() {
    if (this.get_report_details?.status_show === this.reportStatus.pending && (this.isRoc || this.isDataAnalyst)) {
      return true;
    }
    return false;
  }

  isDaTransfer(){
    if (this.get_report_details?.status_show === this.reportStatus.pending && this.isRoc) {
      return true;
    }
    return false;
  }

  isSubmit() {
    if(!this.get_report_details?.status || (this.isRequester && (this.get_report_details?.status == this.reportStatus.draft) ||(this.get_report_details?.status == this.reportStatus.reject) )  || this.get_report_details?.status === this.reportStatus.draft || (this.getprofileDetails.data.id == this.get_report_details?.user_id &&
      this.get_report_details?.status === this.reportStatus.reject)){
      return true;
    }
    if(this.get_report_details?.status == 'publish' || this.get_report_details?.status_show == this.reportStatus.submitted){
      return false;
    }
    return false;
  }

  isRocSubmit(){
    if(this.isRoc && this.get_report_details?.status_show === this.reportStatus.pending && 
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

  getRegionalCordinator(){
    this.courseService.getNewregionalCordinator().subscribe((res: any) => {
       this.rocObj = res.data;
     },(err: any) => {
      this.commonService.errorHandling(err);
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
        this.commonService.errorHandling(err);
      }
    );
  }

  getBusinessUnits(){
    this.commonService.showLoading();
    this.generalDrpdownsService.getBusinessUnits().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.businessUnitsObj = res.data;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
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
        this.commonService.errorHandling(err);
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
        this.commonService.errorHandling(err);
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
        this.commonService.errorHandling(err);
      }
    );
  }

  getCountries(){
   this.courseService.getCountries().subscribe(
     (res: any) => {
       this.countryObj = res.data;
     },(err: any) => {
      this.commonService.errorHandling(err);
     });
  }

  
}
