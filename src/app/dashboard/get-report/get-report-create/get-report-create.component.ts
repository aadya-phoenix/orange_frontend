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

@Component({
  selector: 'app-get-report-create',
  templateUrl: './get-report-create.component.html',
  styleUrls: ['./get-report-create.component.scss']
})
export class GetReportCreateComponent implements OnInit {
  today = new Date();
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

  getUserrole: any = {};
  getprofileDetails: any = {};
  getReportForm: FormGroup;

  isCertification:boolean = false;
  isAvailableHistory:boolean=false;
  isSubmitted:boolean = false;
  isSpecificCountry:boolean=true;

  isRoc = false;
  isDataAnalyst = false;
  isRequester = false;

  reportAttachment = { file: '', ext: '' };

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

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private authService: AuthenticationService,
    private getReportService: GetReportService,
    private courseService:CourcesService) {
      
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
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
       /*  title: new FormControl('', this.isCertification ?[Validators.required]:[]), */
        title: new FormControl('', []),
        transcript_status: new FormControl('', []),
        certification_vendor: new FormControl('',  []),
        certification_title: new FormControl('', []),
        certification_domain: new FormControl('',  []),
        certification_status: new FormControl('',  []),
        region_name: new FormControl('', []),
        country: new FormControl('', []),
        business_unit: new FormControl('', []),
        management_code: new FormControl('', []),
        all_available_history: new FormControl('', []),
        start_date: new FormControl('', []),
        end_date: new FormControl('', []),
        contact_person: new FormControl('', []),
        report_purpose: new FormControl('', []),
        deadline: new FormControl('', [Validators.required]),
        attachment: new FormControl('', []),
        additional_comment: new FormControl('', []),
        regional_cordinator: new FormControl('', [Validators.required]),
      });

      this.getUserrole = this.authService.getRolefromlocal();
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
   for(let region of regions){
     if (region.name=='Global'){
       this.isSpecificCountry = false;
     }
     else{
       this.isSpecificCountry = true;
     }
   }
  }

  getDate(event:any){
   let selectedDate = event.target.value;
    if(selectedDate == 'last_year'){
      this.getReportForm.controls.start_date.setValue('');
    }

    if(selectedDate == 'this_year'){}

    if(selectedDate == 'last_month'){}

    if(selectedDate == 'this_month'){}

    if(selectedDate == 'last_week'){}

    if(selectedDate == 'this_week'){}

    if(selectedDate == 'custom'){}
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
      this.reportAttachment = { file: this.commonService.byteArrayTobase64(f.bytes), ext: f.name.split('.').pop() };
    });
  }

  changeReportType(event:any){
    let type = event.id;
    if(type == 1){
    this.isCertification = false;

    this.getReportForm
    .get('title')
    ?.setValidators(Validators.required);
    this.getReportForm
    .get('title')
    ?.setValidators(Validators.required);

    this.getReportForm
    .get('certification_vendor')
    ?.clearValidators();
    this.getReportForm
    .get('certification_title')
    ?.clearValidators();
    this.getReportForm
    .get('certification_domain')
    ?.clearValidators();
    this.getReportForm
    .get('certification_status')
    ?.clearValidators();

    this.getReportForm
    .get('certification_vendor')
    ?.patchValue(null);
    this.getReportForm
    .get('certification_title')
    ?.patchValue(null);
    this.getReportForm
    .get('certification_domain')
    ?.patchValue(null);
    this.getReportForm
    .get('certification_status')
    ?.patchValue(null);
    }
    else{
      this.isCertification = true;

      this.getReportForm
      .get('certification_vendor')
      ?.setValidators(Validators.required);
      this.getReportForm
      .get('certification_title')
      ?.setValidators(Validators.required);
      this.getReportForm
      .get('certification_domain')
      ?.setValidators(Validators.required);
      this.getReportForm
      .get('certification_status')
      ?.setValidators(Validators.required);
      this.getReportForm
      .get('title')
      ?.clearValidators();
      this.getReportForm
      .get('title')
      ?.clearValidators();

      this.getReportForm
      .get('title')
      ?.patchValue(null);
      this.getReportForm
      .get('title')
      ?.patchValue(null);
    }
  }

  save(status:any){
    this.isSubmitted = true;
    if (this.getReportForm.invalid) {
      console.log("form invalid")
      return;
    }
    const body = this.getReportForm.value;
    body.attachment = this.reportAttachment.file;
    body.attachment_ext = this.reportAttachment.ext;
    body.status = status;
    console.log("obj",body);
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
          this.commonService.toastSuccessMsg('Carousel', 'Successfully Saved.');
          this.router.navigateByUrl(`/dashboard/olcarousel/view/${this.report_id}`);
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.toastErrorMsg('Error', err.message);
        }
      );
    }
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

  getRegionalCordinator(){
    this.courseService.getNewregionalCordinator().subscribe((res: any) => {
       this.rocObj = res.data;
     },(err: any) => {
       console.log(err);
     });
  }

  getAvailableHistory(event:any){
    this.isAvailableHistory = !this.isAvailableHistory;
  }

  getReportDetails() {
    this.commonService.showLoading();
    this.getReportService.getReportDetails(this.report_id).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.get_report_details = res.data;
          this.getReportForm.controls.report_type.setValue(this.get_report_details.report_type);
          this.getReportForm.controls.title.setValue(this.get_report_details.title);
          this.getReportForm.controls.transcript_status.setValue(this.get_report_details.transcript_status);
          this.getReportForm.controls.certification_vendor.setValue(this.get_report_details.certification_vendor);
          this.getReportForm.controls.certification_title.setValue(this.get_report_details.certification_title);
          this.getReportForm.controls.certification_domain.setValue(this.get_report_details.certification_domain);
          this.getReportForm.controls.certification_status.setValue(this.get_report_details.certification_status);
          this.getReportForm.controls.region_name.setValue(JSON.parse(this.get_report_details.region_name));
          this.getReportForm.controls.country.setValue(this.get_report_details.country);
          this.getReportForm.controls.business_unit.setValue(this.get_report_details.business_unit);
          this.getReportForm.controls.management_code.setValue(this.get_report_details.management_code);
          this.getReportForm.controls.contact_person.setValue(this.get_report_details.contact_person);
          this.getReportForm.controls.start_date.setValue(this.get_report_details.start_date);
          this.getReportForm.controls.end_date.setValue(this.get_report_details.end_date);
          this.getReportForm.controls.all_available_history.setValue(this.get_report_details.all_available_history === "1" ? true : false);
          this.getReportForm.controls.report_purpose.setValue(this.get_report_details.report_purpose);
          this.getReportForm.controls.deadline.setValue(this.get_report_details.deadline);
          this.getReportForm.controls.attachment.setValue(this.get_report_details.attachment);
          this.getReportForm.controls.additional_comment.setValue(this.get_report_details.additional_comment);
          if (this.isRequester) {  
           this.getReportForm.controls.regional_cordinator.setValue(this.get_report_details.regional_cordinator);
          }

          /* if (this.getprofileDetails.data.id != this.get_report_details.user_id) {
            this.isCreater = false;
          } */
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
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

}
