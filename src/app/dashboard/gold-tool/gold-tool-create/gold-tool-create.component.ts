import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { GeneralDropdownsService } from 'src/app/shared/services/general-dropdowns/general-dropdowns.service';
import { GoldToolService } from 'src/app/shared/services/gold-tool/gold-tool.service';
import { GoldToolAgreeComponent } from '../gold-tool-agree/gold-tool-agree.component';

@Component({
  selector: 'app-gold-tool-create',
  templateUrl: './gold-tool-create.component.html',
  styleUrls: ['./gold-tool-create.component.scss']
})
export class GoldToolCreateComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  isSubmitted = false;
  preferedInstructor: any = [];
  hrbpEmails:any = [];
  searchedPreferedInstructor: any = [];
  regionDnaObj: any = [];
  regions: any = [];
  countriesObj: any = [];
  countries: any = [];
  bussinessUnitObj: any = [];
  gold_tool_id = 0;
  gold_tool_details: any = {};
  getUserrole: any;
  getprofileDetails: any = {};
  goldLevelAccess = [{
    id: 'Confidential', name: 'Confidential'
  }, {
    id: 'Non-confidential', name: 'Non-confidential'
  }, {
    id: 'YLJ-hubs-PO', name: 'YLJ hubs PO'
  }]

  public createGoldToolForm!: FormGroup;
  constructor(private commonService: CommonService,
    private authService: AuthenticationService,
    private modalService: NgbModal,
    private goldToolService: GoldToolService,
    private route: ActivatedRoute,
    private generalDrpdownsService: GeneralDropdownsService,
    private router: Router,
    private courseService: CourcesService,
    private fb: FormBuilder) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.getUserrole = this.authService.getRolefromlocal();
    this.getprofileDetails = this.authService.getProfileDetailsfromlocal();
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.gold_tool_id = Id ? parseInt(Id) : 0;
    });
    this.createGoldToolForm = this.fb.group({
      requester_name: new FormControl(''),
      requester_email: new FormControl(''),
      additional_comment: new FormControl(''),
      metadata: this.fb.array([
      ]),
    });
  }

  ngOnInit(): void {
    this.getPreferedInstructor();
    this.getHRBPEmail();
    if (this.gold_tool_id) {
      this.getGoldToolDetails();
    } else {
      this.createGoldToolForm.controls.requester_name.setValue(`${this.getprofileDetails.data.first_name} ${this.getprofileDetails.data.last_name}`);
      this.createGoldToolForm.controls.requester_email.setValue(`${this.getprofileDetails.data.email}`);
      this.addMetadata();
    }
  }

  private metaDataGroup(): FormGroup {
    return this.fb.group({
      id: '',
      name: new FormControl('', [Validators.required]),
      email_for_participant: new FormControl('', [Validators.required, Validators.pattern(dataConstant.EmailPattren)]),
      cuid_ftid: new FormControl('', [Validators.required]),
      business_unit_id: new FormControl('', [Validators.required]),
      region: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      gold_level_access: new FormControl('', [Validators.required]),
      hrbp_email: new FormControl('', [Validators.required, Validators.pattern(dataConstant.EmailPattren)]),
      hrbp_name: new FormControl('', [Validators.required]),
      business_justification: new FormControl('', [Validators.required]),
      agree:new FormControl(false, [Validators.requiredTrue])
    });
  }

  get metadataArray(): FormArray {
    return <FormArray>this.createGoldToolForm.get('metadata');
  }

  //preferred instructor
  getPreferedInstructor() {
    this.commonService.showLoading();
    this.courseService.getpreferedInstructor().subscribe(
      (res: any) => {
        this.preferedInstructor = res.data;
        this.getRegions();
      },
      (err: any) => {
        this.commonService.errorHandling(err);
        this.commonService.hideLoading();
      }
    );
  }


   //preferred instructor
   getHRBPEmail() {
    this.commonService.showLoading();
    this.goldToolService.getHRBPEmail().subscribe(
      (res: any) => {
        this.hrbpEmails = res.data;
        this.getRegions();
      },
      (err: any) => {
        this.commonService.errorHandling(err);
        this.commonService.hideLoading();
      }
    );
  }

  searchInstructor(elem: any) {
    if (elem) {
      this.searchedPreferedInstructor = this.preferedInstructor.filter((x: any) => x.email_id.includes(elem));
    }
    else {
      this.searchedPreferedInstructor = [];
    }
  }

  changeEmail(item: any, i: any) {
    if (item) {
      this.metadataArray.at(i)?.get('name')?.setValue(`${item.first_name} ${item.last_name}`);
      this.metadataArray.at(i)?.get('cuid_ftid')?.setValue(item.department_manager_cuid);
    }
  }


  getRegions() {
    this.commonService.showLoading();
    this.generalDrpdownsService.getRegions().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.regionDnaObj = res.data;
        this.getCountries();
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  getCountries() {
    this.commonService.showLoading();
    this.generalDrpdownsService.getCountries().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.countriesObj = res.data;
        this.getBusinessUnits();
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  getSelectedRegion(event: any, i:any) {
    this.countries[i] = this.countriesObj.filter((x: any) => x.region_id === event.id);
  }

  getBusinessUnits() {
    this.generalDrpdownsService.getBusinessUnits().subscribe((res: any) => {
      this.commonService.hideLoading();
      this.bussinessUnitObj = res.data;
    },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  agreeChange(event:any) {
    if (event.agree.value) {
      this.modalService.open(GoldToolAgreeComponent, {
        centered: true,
        size:'xl',
        windowClass: 'alert-popup',
      });
    }
  }

  requiredMessage(field: any) {
    return this.lableConstant.form_fieldname_cannot_be_blank.replace('<form fieldname>', field).replace('<nom du champ>', field);
  }



  addMetadata(): void {
    this.metadataArray.push(this.metaDataGroup());
  }

  copyMetadata(data: any): void {
    this.metadataArray.push(this.fb.group({
      id: '',
      name: new FormControl('', [Validators.required]),
      email_for_participant: new FormControl('', [Validators.required, Validators.pattern(dataConstant.EmailPattren)]),
      cuid_ftid: new FormControl('', [Validators.required]),
      business_unit_id: new FormControl(data.business_unit_id, [Validators.required]),
      region: new FormControl(data.region, [Validators.required]),
      country: new FormControl(data.country, [Validators.required]),
      gold_level_access: new FormControl(data.gold_level_access, [Validators.required]),
      hrbp_email: new FormControl(data.hrbp_email, [Validators.required, Validators.pattern(dataConstant.EmailPattren)]),
      hrbp_name: new FormControl(data.hrbp_name, [Validators.required]),
      business_justification: new FormControl(data.business_justification, [Validators.required]),
      agree:new FormControl(data.agree, [Validators.requiredTrue])
    }));
  }

  updateMetadata(data: any): FormGroup {
    return this.fb.group({
      id: data.id,
      name: new FormControl(data.name, [Validators.required]),
      email_for_participant: new FormControl(data.email_for_participant, [Validators.required, Validators.pattern(dataConstant.EmailPattren)]),
      cuid_ftid: new FormControl(data.cuid_ftid, [Validators.required]),
      business_unit_id: new FormControl(data.business_unit_id, [Validators.required]),
      region: new FormControl(data.region, [Validators.required]),
      country: new FormControl(data.country, [Validators.required]),
      gold_level_access: new FormControl(data.gold_level_access, [Validators.required]),
      hrbp_email: new FormControl(data.hrbp_email, [Validators.required, Validators.pattern(dataConstant.EmailPattren)]),
      hrbp_name: new FormControl(data.hrbp_name, [Validators.required]),
      business_justification: new FormControl(data.business_justification, [Validators.required]),
      agree:new FormControl(data.agree, [Validators.requiredTrue])
    });
  }

  removeMetadata(index: number): void {
    this.metadataArray.removeAt(index);
  }

  getGoldToolDetails() {
    this.commonService.showLoading();
    this.goldToolService.getGoldToolDetails(this.gold_tool_id).subscribe((res: any) => {
      this.commonService.hideLoading();
      if (res.status === 1 && res.message === 'Success') {
        this.gold_tool_details = res.data;
        this.createGoldToolForm.controls.requester_name.setValue(this.gold_tool_details.requester_name);
        this.createGoldToolForm.controls.requester_email.setValue(this.gold_tool_details.requester_email);
        this.createGoldToolForm.controls.additional_comment.setValue(this.gold_tool_details.additional_comment);
        const metadata = this.gold_tool_details.metadata;
        metadata.forEach((meta: any) => {
          this.metadataArray.push(this.updateMetadata(meta));
        });
      }
    }, err => {
      this.commonService.hideLoading();
      this.commonService.errorHandling(err);
    });
  }

  createGoldTool(status: any) {
    this.isSubmitted = true;
    if (this.createGoldToolForm.invalid) {
      return;
    }
    const body = this.createGoldToolForm.value;
    body.status = status;
    if (!this.gold_tool_id) {
      this.commonService.showLoading();
      this.goldToolService.create(body).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('Gold access request', 'Successfully Saved.');
          this.router.navigateByUrl(`/gold-tool/view/${res.data.id}`);
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.errorHandling(err);
        }
      );
    }
    else {
      body.gold_tool_id = this.gold_tool_id;
      this.commonService.showLoading();
      this.goldToolService.update(body).subscribe(
        (res: any) => {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('Gold access request', 'Successfully Saved.');
          this.router.navigateByUrl(`/gold-tool/view/${this.gold_tool_id}`);
        },
        (err: any) => {
          this.commonService.hideLoading();
          this.commonService.errorHandling(err);
        }
      );
    }

  }

}
