import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { BackOfficeService } from 'src/app/shared/services/back-office/back-office.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import Swal from 'sweetalert2';
import { BackOfficeForwardComponent } from '../back-office-forward/back-office-forward.component';
import { BackOfficePublishComponent } from '../back-office-publish/back-office-publish.component';
const emailregexp = dataConstant.EmailPattren;

@Component({
  selector: 'app-create-back-office',
  templateUrl: './create-back-office.component.html',
  styleUrls: ['./create-back-office.component.scss']
})
export class CreateBackOfficeComponent implements OnInit {
  today = new Date();
  minDate = {};
  RoleID = dataConstant.RoleID;
  dateFormate = dataConstant.dateFormate;
  BackOfficeStatus = dataConstant.BackOfficeStatus;
  back_office_id = 0;
  back_office_details: any = {};
  languageList: any = [];
  cctExpiryperiod: any = [];
  backOfficePublisher: any = [];
  getUserrole: any = {};
  getprofileDetails: any = {};
  createBackOfficeForm: FormGroup;
  languageText = "";
  isReviewer = false;
  isPublisher = false;
  isRequester = false;
  rejectcomment = "";
  backOfficeImage = { image: '', ext: '' };
  isSubmitted = false;
  isCreater = true;
  back_office_count = {
    total: 0,
    draft: 0,
    closed: 0,
    rejected: 0,
    pending: 0,
    submitted: 0,
    transferred: 0,
    expired: 0,
    publish: 0
  }

  constructor(private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private authService: AuthenticationService,
    private backOfficeService: BackOfficeService) {
    this.minDate = `${this.today.getFullYear()}-${("0" + (this.today.getMonth() + 1)).slice(-2)}-${("0" + this.today.getDate()).slice(-2)}`;
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.getUserrole = this.authService.getRolefromlocal();
    this.isReviewer = this.getUserrole.id === this.RoleID.BackOfficeReviewer;
    this.isPublisher = this.getUserrole.id === this.RoleID.BackOfficePublisher;
    this.isRequester = this.getUserrole.id === this.RoleID.RequesterID;
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.back_office_id = Id ? parseInt(Id) : 0;
    });
    this.createBackOfficeForm = this.formBuilder.group({
      languages: new FormArray([]),
      metadata: this.formBuilder.array([]),
      image: new FormControl('', this.back_office_id ? [] : [Validators.required]),
      publication_date: new FormControl('', [Validators.required]),
      expiry_type: new FormControl('', [Validators.required]),
      additional_comment: new FormControl('')
    });

  }

  async ngOnInit() {
    this.getTotalCount();
  }

  getBackOfficeDetails() {
    this.commonService.showLoading();
    this.backOfficeService.getBackOfficeDetails(this.back_office_id).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.back_office_details = res.data;
          this.createBackOfficeForm.controls.expiry_type.setValue(this.back_office_details.expiry_type);
          this.createBackOfficeForm.controls.additional_comment.setValue(this.back_office_details.additional_comment);
          this.createBackOfficeForm.controls.publication_date.setValue(new Date(this.back_office_details.publication_date).toISOString().slice(0, 10));
          // this.createBackOfficeForm.controls.image.setValue(this.back_office_details.image);
          this.back_office_details.imageUrl = `${dataConstant.ImageUrl}/${this.back_office_details.image}`;
          this.back_office_details.image = null;
          if(this.getprofileDetails.data.id != this.back_office_details.user_id){
            this.isCreater = false;
          }
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  // get lauguageFormArray(): FormArray {
  //   return this.createBackOfficeForm.get("languages") as FormArray;
  // }

  // get back-officeFormArray(): FormArray {
  //   return this.createBackOfficeForm.get("metadata") as FormArray;
  // }

  // newMetaData(language: { id: any; name: any; slug: any; name_original: any }): FormGroup {
  //   return this.formBuilder.group({
  //     language: language.id, languageName: language.name_original, language_slug: language.slug,
  //     title: new FormControl('', [Validators.required]),
  //     description: new FormControl('', [Validators.required]),
  //     link: new FormControl('', [Validators.required, Validators.pattern(new RegExp(
  //       `${dataConstant.UrlPattern}`,
  //       'i'
  //     ))]), display_manager: 0
  //   })
  // }

  getTotalCount() {
    this.commonService.showLoading();
    this.backOfficeService.getBackOffice().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.back_office_count = res.data.back_office_count;
        // this.getLanguageList();
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  // getLanguageList() {
  //   this.commonService.showLoading();
  //   this.commonService.getLanguages().subscribe(
  //     (res: any) => {
  //       this.commonService.hideLoading();
  //       this.languageList = res.data.filter((x: { back-office_show: number; }) => x.back-office_show === 1);
  //       this.languageText = this.languageList.map((x: { name: string }) => x.name).join('/');
  //       this.getExpiryDateType();
  //     },
  //     (err: any) => {
  //       this.commonService.hideLoading();
  //       this.commonService.toastErrorMsg('Error', err.message);
  //     }
  //   );
  // }

  // launguageFormBind() {
  //   if (!this.back_office_id) {
  //     this.languageList.forEach((x: { name: string, id: number, slug: string, back-office_show: number }) => {
  //       if (x.back-office_show === 1) {
  //         this.lauguageFormArray.push(new FormControl(false));
  //         // if (x.slug === 'english') {
  //         //   this.back-officeFormArray.push(this.newMetaData(x));
  //         // }
  //       }
  //     });
  //   }
  //   else {
  //     this.languageList.forEach((x: { name: string, id: number, slug: string, back-office_show: number, name_original: any }) => {
  //       if (x.back-office_show === 1) {
  //         const existData = this.back_office_details.metadata.find((y: { language_slug: any; }) => y.language_slug == x.slug);
  //         if (existData) {
  //           this.lauguageFormArray.push(new FormControl(true));
  //           const formControl = this.newMetaData(x)
  //           formControl.controls.title.setValue(existData.title);
  //           formControl.controls.description.setValue(existData.description);
  //           formControl.controls.link.setValue(existData.link);
  //           formControl.controls.display_manager.setValue(existData.display_manager);
  //           this.back-officeFormArray.push(formControl);
  //         }
  //         else {
  //           this.lauguageFormArray.push(new FormControl(false));
  //         }
  //       }
  //     });
  //   }
  // }

  // getExpiryDateType() {
  //   this.commonService.showLoading();
  //   this.commonService.getExpiryDateType().subscribe(
  //     (res: any) => {
  //       this.commonService.hideLoading();
  //       this.cctExpiryperiod = res.data;
  //       if (!this.back_office_id) {
  //         this.launguageFormBind();
  //       }
  //       else {
  //         this.getBackOfficeDetails();
  //       }
  //     },
  //     (err: any) => {
  //       this.commonService.hideLoading();
  //       this.commonService.toastErrorMsg('Error', err.message);
  //     }
  //   );
  // }

  // getBackOfficePublisher() {
  //   this.commonService.showLoading();
  //   this.backOfficeService.getBackOfficePublisher().subscribe(
  //     (res: any) => {
  //       this.commonService.hideLoading();
  //       this.back-officePublisher = res.data;
  //     },
  //     (err: any) => {
  //       this.commonService.hideLoading();
  //       this.commonService.toastErrorMsg('Error', err.message);
  //     }
  //   );
  // }

  // languageChange() {
  //   this.lauguageFormArray.controls.forEach((x, index) => {
  //     const language = this.languageList[index];
  //     const formControl = this.back-officeFormArray.controls.find(x => x.value.language === language.id);
  //     if (x.value && !formControl) {
  //       this.back-officeFormArray.push(this.newMetaData(language));
  //     }
  //     else if (!x.value && formControl) {
  //       this.back-officeFormArray.removeAt(this.back-officeFormArray.controls.findIndex(x => x.value.language === language.id));
  //     }
  //   });
  // }

  // removeBackOffice(back-office: any) {
  //   this.back-officeFormArray.removeAt(this.back-officeFormArray.controls.findIndex(x => x.value.language === back-office?.value?.language));
  //   this.lauguageFormArray.controls[this.languageList.findIndex((x: { id: any; }) => x.id === back-office?.value?.language)].setValue(false);
  // }

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
      this.backOfficeImage = { image: this.commonService.byteArrayTobase64(f.bytes), ext: f.name.split('.').pop() };
    });
  }

  isDraft() {
    if (this.back_office_details?.status === this.BackOfficeStatus.publish || this.back_office_details?.status === this.BackOfficeStatus.expired || this.back_office_details?.status === this.BackOfficeStatus.pending || this.back_office_details?.status === this.BackOfficeStatus.reject) {
      return false;
    }
    if (this.getprofileDetails.data.id != this.back_office_details?.user_id && this.back_office_details?.transfer_user_id && !this.back_office_details?.publisher_status && this.isReviewer) {
      return false;
    }
    return true;
  }

  isReject() {
    if (this.back_office_details?.status === this.BackOfficeStatus.publish || this.back_office_details?.status === this.BackOfficeStatus.expired  || this.back_office_details?.status === this.BackOfficeStatus.reject) {
      return false;
    }
    if (this.isRequester || !this.back_office_details.id) {
      return false;
    }
    if (this.back_office_details?.status === this.BackOfficeStatus.draft) {
      return false;
    }
    if (this.back_office_details?.transfer_user_id && !this.back_office_details?.publisher_status && this.isReviewer) {
      return false;
    }
    return true;
  }

  isPublish() {
    if (this.back_office_details?.status === this.BackOfficeStatus.publish || this.back_office_details?.status === this.BackOfficeStatus.expired ) {
      return false;
    }
    if (!this.isPublisher) {
      return false;
    }
    if (this.getprofileDetails.data.id != this.back_office_details?.user_id && this.back_office_details?.transfer_user_id && !this.back_office_details?.publisher_status && this.isReviewer) {
      return false;
    }
    return true;
  }

  isSubmit() {
    if (this.back_office_details?.status === this.BackOfficeStatus.publish || this.back_office_details?.status === this.BackOfficeStatus.expired ) {
      return false;
    }
    if (this.getprofileDetails.data.id === this.back_office_details?.user_id && this.back_office_details?.status === this.BackOfficeStatus.pending) {
      return false;
    }
    if (this.isPublisher) {
      return false;
    }
    if (this.getprofileDetails.data.id != this.back_office_details?.user_id && this.back_office_details?.transfer_user_id && !this.back_office_details?.publisher_status && this.isReviewer) {
      return false;
    }

    return true;
  }

  forwardRequest() {
    const modalRef = this.modalService.open(BackOfficeForwardComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: 'Request Forward',
      data: this.back_office_details.id,
      objectDetail: this.back_office_details
    };
  }

  statusChangeRequest(status: any) {
    const modalRef = this.modalService.open(BackOfficePublishComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'alert-popup',
    });
    modalRef.componentInstance.props = {
      title: `Request ${status == this.BackOfficeStatus.reject ? "Reject" : "Publish"}`,
      status: status,
      data: this.back_office_details.id,
      objectDetail: this.back_office_details
    };
  }

  saveBackOffice(status: string) {
    this.isSubmitted = true;
    if (this.createBackOfficeForm.invalid) {
      return;
    }
    const body = this.createBackOfficeForm.value;
    body.image = this.backOfficeImage.image;
    body.image_ext = this.backOfficeImage.ext;
    body.reviewer_id = "";
    body.status = status;
    if (!this.back_office_id) {
      this.commonService.showLoading();
      this.backOfficeService.create(body).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('BackOffice', 'Successfully Saved.');
          this.router.navigateByUrl(`/dashboard/olback-office/view/${res.data.id}`);
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.toastErrorMsg('Error', err.message);
        }
      );
    }
    else {
      body.back_office_id = this.back_office_id;
      this.commonService.showLoading();
      this.backOfficeService.update(body).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('BackOffice', 'Successfully Saved.');
          this.router.navigateByUrl(`/dashboard/olback-office/view/${this.back_office_id}`);
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.toastErrorMsg('Error', err.message);
        }
      );
    }

  }

}
