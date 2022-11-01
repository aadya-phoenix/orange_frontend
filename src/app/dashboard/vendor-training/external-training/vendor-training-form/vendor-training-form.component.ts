import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { create, update } from 'lodash';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { GeneralDropdownsService } from 'src/app/shared/services/general-dropdowns/general-dropdowns.service';
import { GetReportService } from 'src/app/shared/services/get-report/get-report.service';
import { VendorTrainingService } from 'src/app/shared/services/vendor-training/vendor-training.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendor-training-form',
  templateUrl: './vendor-training-form.component.html',
  styleUrls: ['./vendor-training-form.component.scss']
})
export class VendorTrainingFormComponent implements OnInit {

  vendorForm:FormGroup;
  vendorStatus = dataConstant.VendorTrainingStatus;
  regionObj:any=[];
  countryObj:any=[];
  regionId:any;
  vendorAttachment = { file: '', ext: '' };
  vendor_details:any;
  vendor_id:any;
  isSubmitted =false;
  lableConstant: any = { french: {}, english: {} };
  getUserrole: any;
  getprofileDetails: any = {};
  isSpecificCountry = true;

  training_type_obj = [{name:'Face-to-face'},{name:'Online training'},{name:'Virtual'},{name:'Self-Paced'},{name:'Subscription'}];
  participant_detail_obj=[{name:'Self'},{name:'Other users'}];
  yes_no_obj = [{name:'Yes'},{name:'No'}];
  preferenceObj=[{name:'Public -Open Registration(subject to availability)'},{name:'Private course: Onsite training'}];

  isRoc = false;
  isRequester = false;
  RoleID = dataConstant.RoleID;

  constructor(
    private fb:FormBuilder,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private getReportService:GetReportService,
    private modalService: NgbModal,
    private authService: AuthenticationService,
    private courseService:CourcesService,
    private datepipe:DatePipe,
    private generalDrpdownsService:GeneralDropdownsService,
    private vendorTrainingService:VendorTrainingService
    
  ) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.getUserrole = this.authService.getRolefromlocal();
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.isRoc = this.getUserrole.includes(this.RoleID.Roc);
    this.isRequester = this.getprofileDetails.data?.staff == 1 ? true : false;

    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.vendor_id = Id ? parseInt(Id) : 0;
    });
    this.vendorForm = this.fb.group({
      training_name: new FormControl('',[]),
      region: new FormControl('',[]),
      country: new FormControl('',[]),
      location: new FormControl('',[]),
      training_date: new FormControl('',[]),
      preferred_time: new FormControl('',[]),
      training_type: new FormControl('',[]),
      participant_detail: new FormControl('',[]),
      email_for_participant: new FormControl('',[]),
      budget: new FormControl('',[]),
      management_code: new FormControl('',[]),
      quote: new FormControl('',[]),
      attach_quote:new FormControl('',[]),
      preference_course: new FormControl('',[]),
      additional_contact: new FormControl('',[]),
      additional_detail: new FormControl('',[]),
      duration: new FormControl('',[]),
    });
   }

  ngOnInit(): void {
    this.vendor_id ? this.getDetails() : '';
    this.getRegions();
  }

 /*  getRegionalCordinator(){
    this.courseService.getNewregionalCordinator().subscribe((res: any) => {
       this.regionObj = res.data;
     },(err: any) => {
      this.commonService.errorHandling(err);
     });
  } */

  getRegionName(region: any) {
    this.regionId = region.id;
    this.isSpecificCountry = true;
    this.getCountries();
     if (region.name=='Global'){
       this.isSpecificCountry = false;
       this.vendorForm.get('country')?.patchValue(null);
     }
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

  getCountries() {
    this.commonService.showLoading();
    this.generalDrpdownsService.getCountries().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        let regions = res.data;
        this.countryObj = regions.filter((x: any) => x.region_id === this.regionId);
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

/*   getCountries(){
   this.courseService.getCountries().subscribe(
     (res: any) => {
       this.countryObj = res.data;
     },(err: any) => {
      this.commonService.errorHandling(err);
     });
  } */

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
      this.vendorAttachment = { file: this.commonService.byteArrayTobase64(f.bytes), ext: f.name.split('.').pop() };
    });
  }

  save(status:any){
    this.isSubmitted = true;
    if (this.vendorForm.invalid) {
      return;
    }
    const body = this.vendorForm.value;
    body.attach_quote = this.vendorAttachment.file;
    body.attach_quote_ext = this.vendorAttachment.ext;
    body.status = status;
    this.vendor_id ? this.update(body) : this.create(body);
  }

  create(body:any){
    this.commonService.showLoading();
    this.vendorTrainingService.create(body).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.commonService.toastSuccessMsg('External Vendor', 'Successfully Created.');
        this.router.navigateByUrl(`/vendortraining/list`);
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  update(body:any){
    body.external_vendor_id = this.vendor_id;
    this.commonService.showLoading();
    this.vendorTrainingService.update(body).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.commonService.toastSuccessMsg('External Vendor', 'Successfully Updated.');
        this.router.navigateByUrl(`/vendortraining/view/${this.vendor_id}`);
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  dateFormat(date:any){
    const newdate = new Date(date);
    return this.datepipe.transform(date,'yyyy-MM-dd');
  }

  getDetails() {
    this.commonService.showLoading();
    this.vendorTrainingService.getDetails(this.vendor_id).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.vendor_details = res.data;
          this.vendorForm.controls.training_name.setValue(this.vendor_details.training_name);
          this.vendorForm.controls.region.setValue(JSON.parse(this.vendor_details.region));
          if(this.vendor_details.country){
            this.isSpecificCountry = true;
            this.vendorForm.controls.country.setValue(this.vendor_details.country);
          }
          this.vendorForm.controls.location.setValue(this.vendor_details.location);
          this.vendorForm.controls.training_date.setValue(this.dateFormat(this.vendor_details.training_date));
          this.vendorForm.controls.preferred_time.setValue(this.vendor_details.preferred_time);
          this.vendorForm.controls.training_type.setValue(this.dateFormat(this.vendor_details.training_type));
          if(this.vendor_details.attach_quote){
            this.vendor_details.attachUrl = 
            `${dataConstant.ImageUrl}/${this.vendor_details.attach_quote}`;
            this.vendor_details.attach_quote = null;
          }
          this.vendorForm.controls.participant_detail.setValue(this.vendor_details.participant_detail);
          this.vendorForm.controls.email_for_participant.setValue(this.vendor_details.email_for_participant);
          this.vendorForm.controls.budget.setValue(this.vendor_details.budget);
          this.vendorForm.controls.management_code.setValue(this.vendor_details.management_code);
          this.vendorForm.controls.quote.setValue(this.vendor_details.quote);
          this.vendorForm.controls.preference_course.setValue(this.vendor_details.preference_course);
          this.vendorForm.controls.additional_contact.setValue(this.vendor_details.additional_contact);
          this.vendorForm.controls.additional_detail.setValue(this.vendor_details.additional_detail);
          this.vendorForm.controls.duration.setValue(this.vendor_details.duration);
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      });
  }

  isDraft() {
    if (this.vendor_details?.status === this.vendorStatus.publish || this.vendor_details?.status === this.vendorStatus.pending || this.vendor_details?.status === this.vendorStatus.reject) {
      return false;
    }
    if (this.getprofileDetails.data.id != this.vendor_details?.user_id && this.vendor_details?.transfer_user_id && !this.vendor_details?.publisher_status ) {
      return false;
    }
    if(this.vendor_details?.status_show == this.vendorStatus.submitted){
       return false;
    }
    
    return true;
  }

  isReject() {
    if (this.vendor_details?.status_show === this.vendorStatus.pending && this.isRoc ) {
      return true;
    }
    
    return false;
  }

  isPublish() {
    if (this.vendor_details?.status_show === this.vendorStatus.pending && this.isRoc) {
      return true;
    }
    return false;
  }

  isSubmit() {
    if(!this.vendor_details?.status || (this.isRequester && (this.vendor_details?.status == this.vendorStatus.draft) ||(this.vendor_details?.status == this.vendorStatus.reject) )  || this.vendor_details?.status === this.vendorStatus.draft || (this.getprofileDetails.data.id == this.vendor_details?.user_id &&
      this.vendor_details?.status === this.vendorStatus.reject)){
      return true;
    }
    if(this.vendor_details?.status == 'publish' || this.vendor_details?.status_show == this.vendorStatus.submitted){
      return false;
    }
    return false;
  }
}
