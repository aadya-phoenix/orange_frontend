import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  reportStatus= dataConstant.GetReportStatus;
  dateFormate = dataConstant.dateFormate;

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

  certiFlag:boolean = false;
  availableHistoryFlag:boolean=false;
  isSubmitted:boolean = false;

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
      this.getReportForm= this.formBuilder.group({
        report_type: new FormControl('', []),
        title: new FormControl('', []),
        transcript_status: new FormControl('', []),
        certification_vendor: new FormControl('', []),
        certification_title: new FormControl('', []),
        certification_domain: new FormControl('', []),
        certification_status: new FormControl('', []),
        region_name: new FormControl('', []),
        country: new FormControl('', []),
        business_unit: new FormControl('', []),
        management_code: new FormControl('', []),
        all_available_history: new FormControl('', []),
        start_date: new FormControl('', []),
        end_date: new FormControl('', []),
        contact_person: new FormControl('', []),
        report_purpose: new FormControl('', []),
        deadline: new FormControl('', []),
        attachment: new FormControl('', []),
        additional_comment: new FormControl('', []),
        regional_cordinator: new FormControl('', []),
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

  changeReportType(event:any){
    let type = event.id;
    if(type == 1){
    this.certiFlag = false;
    }
    else{
      this.certiFlag = true;
    }
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
    this.getReportService.getReportType().subscribe(
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
    this.availableHistoryFlag = !this.availableHistoryFlag;
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

  save(status:any){
    this.isSubmitted = true;
    if (this.getReportForm.invalid) {
      return;
    }
    const body = this.getReportForm.value;
    body.attachment = this.reportAttachment.file;
    body.attachment_ext = this.reportAttachment.ext;
    body.status = status;
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

}
