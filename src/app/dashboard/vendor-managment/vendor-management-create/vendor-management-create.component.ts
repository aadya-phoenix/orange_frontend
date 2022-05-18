import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { VendorService } from 'src/app/shared/services/vendor/vendor.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import Swal from 'sweetalert2';
// import { BackOfficeForwardComponent } from '../back-office-forward/back-office-forward.component';
// import { BackOfficeHistoryComponent } from '../back-office-history/back-office-history.component';
// import { BackOfficePublishComponent } from '../back-office-publish/back-office-publish.component';

@Component({
  selector: 'app-vendor-management-create',
  templateUrl: './vendor-management-create.component.html',
  styleUrls: ['./vendor-management-create.component.scss']
})
export class VendorManagementCreateComponent implements OnInit {
  today = new Date();
  minDate = {};
  RoleID = dataConstant.RoleID;
  dateFormate = dataConstant.dateFormate;
  BackOfficeStatus = dataConstant.BackOfficeStatus;
  yesnoDropdown = [{name:'Yes',value:1},{name:'No',value:0}]
  CCTContactPoint: any = [];
  CCTLearningLocation: any = [];
  CCTNfpsEntity: any = [];
  CCTOfferTraining: any = [];
  vendor_id = 0;
  vendor_details: any = {};
  other_training_offer = false;
  orange_contact = false;
  preferedInstructor: any = [];
  termsAndCondition: any = [];
  entityList: any = [];
  languageList: any = [];
  cctExpiryperiod: any = [];
  backOfficePublisher: any = [];
  cordinatorsList: any = [];
  backupCordinatorsList: any = [];
  cctDeliveryPerimeter: any = [];
  cctLearningRole: any = [];
  getUserrole: any = {};
  getprofileDetails: any = {};
  createVendorForm: FormGroup;
  languageText = "";
  isReviewer = false;
  isPublisher = false;
  isRequester = false;
  rejectcomment = "";
  remainingText = 500;
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
    private courseService: CourcesService,
    private authService: AuthenticationService,
    private vendorService: VendorService) {
    this.minDate = `${this.today.getFullYear()}-${("0" + (this.today.getMonth() + 1)).slice(-2)}-${("0" + this.today.getDate()).slice(-2)}`;
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.getUserrole = this.authService.getRolefromlocal();
    this.isReviewer = this.getUserrole.id === this.RoleID.BackOfficeReviewer;
    this.isPublisher = this.getUserrole.id === this.RoleID.BackOfficePublisher;
    this.isRequester = this.getUserrole.id === this.RoleID.RequesterID;
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.vendor_id = Id ? parseInt(Id) : 0;
    });
    this.createVendorForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      region: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      website: new FormControl('', [Validators.pattern(new RegExp(
        `${dataConstant.UrlPattern}`,
        'i'
      ))]),
      nfps_entity: new FormControl('', [Validators.required]),
      epurchase: new FormControl(0, [Validators.required]),
      global_contract: new FormControl(0, [Validators.required]),
      training_offer: new FormControl(''),
      other_comment: new FormControl('', [Validators.required]),
      contact: this.formBuilder.array([]),
      other_training_offer: new FormControl(''),
    });
    this.createVendorForm.get("global_contract")?.valueChanges.subscribe(x => {
      if (x) {
        this.createVendorForm.addControl("orange_contact", new FormControl('', [Validators.required]))
        this.orange_contact = true;
      }
      else {
        this.orange_contact = false;
        this.createVendorForm.removeControl("orange_contact");
      }
    });
    this.createVendorForm.get("training_offer")?.valueChanges.subscribe(x => {
      if (_.includes(x, 'Others')) {
        this.other_training_offer = true;
      }
      else {
        this.other_training_offer = false;
        this.createVendorForm.controls.other_training_offer.setValue(null);
      }
    });
    this.createVendorForm.get("other_comment")?.valueChanges.subscribe(() => {
      this.valueChange();
    });
  }

  async ngOnInit() {
    this.getCordinators();

  }

  get contactFormArray(): FormArray {
    return this.createVendorForm.get("contact") as FormArray;
  }
  newContactData(id: any, index: any): FormGroup {
    return this.formBuilder.group({
      index: index,
      id: id,
      contact_for: new FormControl('', [Validators.required]),
      person: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      phone: new FormControl(''),
    })
  }

  getCordinators() {
    this.commonService.showLoading();
    this.courseService.getNewregionalCordinator().subscribe(
      (res: any) => {
        console.log(res);
        this.cordinatorsList = res.data;
        this.getCCTContactPoint();
      },
      (err: any) => {
        console.log(err);
        this.commonService.hideLoading();
      }
    );
  }

  getCCTContactPoint() {
    this.commonService.showLoading();
    this.vendorService.getCCTContactPoint().subscribe(
      (res: any) => {
        this.CCTContactPoint = res.data;
        this.getCCTLearningLocation();
      },
      (err: any) => {
        console.log(err);
        this.commonService.hideLoading();
      }
    );
  }

  getCCTLearningLocation() {
    this.commonService.showLoading();
    this.vendorService.getCCTLearningLocation().subscribe(
      (res: any) => {
        console.log(res);
        this.CCTLearningLocation = res.data;
        this.getCCTNfpsEntity();
      },
      (err: any) => {
        console.log(err);
        this.commonService.hideLoading();
      }
    );
  }

  getCCTNfpsEntity() {
    this.commonService.showLoading();
    this.vendorService.getCCTNfpsEntity().subscribe(
      (res: any) => {
        this.CCTNfpsEntity = res.data;
        this.getCCTOfferTraining();
      },
      (err: any) => {
        console.log(err);
        this.commonService.hideLoading();
      }
    );
  }
  getCCTOfferTraining() {
    this.commonService.showLoading();
    this.vendorService.getCCTOfferTraining().subscribe(
      (res: any) => {
        console.log(res);
        this.CCTOfferTraining = res.data;
        this.commonService.hideLoading();
        if (this.vendor_id) {
          this.getBackOfficeDetails();
        }
        else {
          this.addContact();
          this.commonService.hideLoading();
        }
      },
      (err: any) => {
        console.log(err);
        this.commonService.hideLoading();
      }
    );
  }



  addContact() {
    this.contactFormArray.push(this.newContactData(0, this.contactFormArray.length));
  }

  removeContact(contact: any) {
    if (this.contactFormArray.length > 1) {
      this.contactFormArray.removeAt(this.contactFormArray.controls.findIndex(x => x.value.index === contact?.value?.index));
    }
  }

  valueChange() {
    if (this.createVendorForm.value.other_comment) {
      this.remainingText = 500 - this.createVendorForm.value.other_comment.length;
    }
    else {
      this.remainingText = 500;
    }
  }

  getBackOfficeDetails() {
    this.commonService.showLoading();
    this.vendorService.getVendorDetails(this.vendor_id).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.vendor_details = res.data;
          this.createVendorForm.controls.name.setValue(this.vendor_details.name);
          this.createVendorForm.controls.region.setValue(JSON.parse(this.vendor_details.region));
          this.createVendorForm.controls.location.setValue(JSON.parse(this.vendor_details.location));
          this.createVendorForm.controls.address.setValue(this.vendor_details.address);
          this.createVendorForm.controls.website.setValue(this.vendor_details.website);
          this.createVendorForm.controls.nfps_entity.setValue(JSON.parse(this.vendor_details.nfps_entity));
          this.createVendorForm.controls.epurchase.setValue(this.vendor_details.epurchase);
          this.createVendorForm.controls.global_contract.setValue(this.vendor_details.global_contract);
          if (this.vendor_details.global_contract) {
            this.createVendorForm.addControl("orange_contact", new FormControl('', [Validators.required]))
            this.createVendorForm.controls.orange_contact.setValue(this.vendor_details.orange_contact);
            this.orange_contact = true;
          }
          this.createVendorForm.controls.training_offer.setValue(JSON.parse(this.vendor_details.training_offer));
          this.createVendorForm.controls.other_comment.setValue(this.vendor_details.other_comment);
          this.createVendorForm.controls.other_training_offer.setValue(this.vendor_details.other_training_offer);
          this.vendor_details.contact.forEach((element: any, index: any) => {
            const formControl = this.newContactData(element.id, index);
            formControl.controls.contact_for.setValue(element.contact_for);
            formControl.controls.person.setValue(element.person);
            formControl.controls.email.setValue(element.email);
            formControl.controls.phone.setValue(element.phone);
            this.contactFormArray.push(formControl);
          });
          this.valueChange();
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  changeEmail(item: any) {
    if (item) {
      this.createVendorForm.controls.first_name.setValue(item.first_name);
      this.createVendorForm.controls.last_name.setValue(item.last_name);
      this.createVendorForm.controls.cuid.setValue(item.department_manager_cuid);
    }
  }

  statusChangeRequest(status: any) {
    // const modalRef = this.modalService.open(BackOfficePublishComponent, {
    //   centered: true,
    //   size: 'lg',
    //   windowClass: 'alert-popup',
    // });
    // modalRef.componentInstance.props = {
    //   title: `Request ${status == this.BackOfficeStatus.reject ? "Reject" : "Publish"}`,
    //   status: status,
    //   data: this.vendor_details.id,
    //   objectDetail: this.vendor_details
    // };
  }

  saveVendor(status: string) {
    this.isSubmitted = true;
    if (this.createVendorForm.invalid) {
      return;
    }
    const body = this.createVendorForm.value;
    body.status = status;
    this.saveData(body);
  }

  saveData(body: any) {
    if (!this.vendor_id) {
      this.commonService.showLoading();
      this.vendorService.create(body).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('Vendor', 'Successfully Saved.');
          this.router.navigateByUrl(`/dashboard/vendormanagement/view/${res.data.id}`);
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.toastErrorMsg('Error', err.message);
        }
      );
    }
    else {
      body.vendor_id = this.vendor_id;
      this.commonService.showLoading();
      this.vendorService.update(body).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('Vendor', 'Successfully Saved.');
          this.router.navigateByUrl(`/dashboard/vendormanagement/view/${this.vendor_id}`);
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.toastErrorMsg('Error', err.message);
        }
      );
    }
  }
}
