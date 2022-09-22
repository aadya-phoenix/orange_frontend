import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { passwordMatchingValidatior } from 'src/app/shared/constant/customValidators';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { GeneralDropdownsService } from 'src/app/shared/services/general-dropdowns/general-dropdowns.service';
import { UserManageService } from 'src/app/shared/services/user-management/user-manage.service';

@Component({
  selector: 'app-dna-user-edit',
  templateUrl: './dna-user-edit.component.html',
  styleUrls: ['./dna-user-edit.component.scss']
})
export class DnaUserEditComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  dateTimeFormate = dataConstant.dateTimeFormate;
  createUserForm: FormGroup;
  user_id: any;
  user_details: any;
  isManager = false;
  rolesList: any = [];
  regionObj: any = [];
  domainObj: any = [];
  countriesObj: any = [];
  bussinessUnitObj: any = [];
  roleId: number = 0;
  regionId: number = 0;
  isSubmitted = false;
  isBussinessUnit = false;
  isCountry = false;
  isDomain = false;
  isRegion = false;
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private courceService: CourcesService,
    private userManageService: UserManageService,
    private commonService: CommonService,
    private authService: AuthenticationService,
    private generalDrpdownsService: GeneralDropdownsService,
    private router: Router,
  ) {
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.isManager = this.authService.getProfileDetailsfromlocal().data?.manager == 1 ? true : false;
    this.createUserForm = this.formBuilder.group({
      role_id: new FormControl('', []),
      region_id: new FormControl('', []),
      learning_type: new FormControl('', []),
      domain_training_id: new FormControl('', []),
      country: new FormControl('', []),
      business_unit_id: new FormControl('', []),
    });
  }

  ngOnInit(): void {
    if (this.isManager) {
      this.route.paramMap.subscribe((params: ParamMap) => {
        const Id = params.get('id');
        this.user_id = Id ? parseInt(Id) : 0;
        this.getUserDetails();
      });
      this.getRole();
      this.getRegions();
      this.getBusinessUnits();
      this.getDomain();
    }
  }

  requiredMessage(field: any) {
    return this.lableConstant.form_fieldname_cannot_be_blank.replace('<form fieldname>', field).replace('<nom du champ>', field);
  }

  getSelectedRole(event: any) {
    this.roleId = event.id;
    if (this.roleId == 5 || this.roleId == 13) {
      this.isRegion = true;
      this.isDomain = false;
      this.isBussinessUnit = false;
      this.isCountry = false;
      this.createUserForm.get('region_id')?.setValidators([Validators.required]);
      this.createUserForm.get('business_unit_id')?.setValue(null);
      this.createUserForm.get('domain_training_id')?.setValue(null);
      this.createUserForm.get('country')?.setValue(null);
    }
    if (this.roleId == 12) {
      this.isRegion = false;
      this.isBussinessUnit = true;
      this.isDomain = false;
      this.isCountry = false;
      this.createUserForm.get('region_id')?.clearValidators();
      this.createUserForm.get('region_id')?.setValue(null);
      this.createUserForm.get('domain_training_id')?.setValue(null);
      this.createUserForm.get('country')?.setValue(null);
    }
    if (this.roleId == 14) {
      this.isDomain = true;
      this.isRegion = false;
      this.isBussinessUnit = false;
      this.isCountry = false;
      this.createUserForm.get('region_id')?.clearValidators();
      this.createUserForm.get('region_id')?.setValue(null);
      this.createUserForm.get('business_unit_id')?.setValue(null);
      this.createUserForm.get('country')?.setValue(null);
    }
  }

  getSelectedRegion(region: any) {
    if (this.roleId == 13) {
      this.regionId = region.id;
      if (region.region_name == 'Global') {
        this.isCountry = false;
        this.createUserForm.get('country')?.setValue(null);
      }
      else {
        this.isCountry = true;
        this.getCountries();
      }
    }
    else {
      return;
    }
  }

  save() {
    this.isSubmitted = true;
    if (this.createUserForm.invalid) {
      return;
    }
    const body = this.createUserForm.value;
    body.email = this.user_details.email;
    body.first_name = this.user_details.first_name;
    body.last_name = this.user_details.last_name;
    body.admin = this.user_details.admin;
    body.learning_type = this.user_details.learning_type;
    body.manager = this.user_details.manager;
    body.pdl_member = this.user_details.pdl_member;
    body.staff = this.user_details.staff;
    body.status = this.user_details.status;
    this.commonService.showLoading();
    this.userManageService.updateUser(body, this.user_id).subscribe(
      (res: any) => {
        if (res.status == 1) {
          this.commonService.hideLoading();
          this.commonService.toastSuccessMsg('User', 'Successfully Updated.');
          this.router.navigateByUrl(`/dna/user`);
        }
        else {
          this.commonService.toastErrorMsg('Error', res.message);
          this.commonService.hideLoading();
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  close() {
    this.router.navigateByUrl(`/dna/user}`);
  }

  getUserDetails() {
    this.commonService.showLoading();
    this.userManageService.getUserDetails(this.user_id).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1) {
          this.user_details = res.data;
          this.roleId = this.user_details.role_id;
          if (this.user_details.role_id === 5) {
            this.isRegion = true;
            this.createUserForm.controls.region_id.setValue(this.user_details.region_id);
          }
          this.createUserForm.controls.role_id.setValue(this.user_details.role_id);
          if (this.user_details.role_id == 12) {
            this.isBussinessUnit = true;
            this.createUserForm.controls.business_unit_id.setValue(this.user_details.business_unit_id);
          }
          if (this.user_details.role_id == 13) {
            this.isRegion = true;
            this.isCountry = true;
            this.createUserForm.controls.region_id.setValue(this.user_details.region_id);
            this.createUserForm.controls.country.setValue(this.user_details.country);
          }

          if (this.user_details.role_id == 14) {
            this.isDomain = true;
            this.createUserForm.controls.domain_training_id.setValue(this.user_details.domain_training_id);
          }
        }
        else {
          this.commonService.toastErrorMsg('Error', res.message);
          this.commonService.hideLoading();
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  getRole() {
    this.courceService.getRole().subscribe(
      res => {
        let roles = res.data;
        this.rolesList = roles.filter((a: any) => {
          return a.status == 1
        });
      }, err => {
        console.log(err);
      });
  }

  getRegions() {
    this.commonService.showLoading();
    this.generalDrpdownsService.getRegions().subscribe(
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

  getCountries() {
    this.commonService.showLoading();
    this.generalDrpdownsService.getCountries().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        let regions = res.data;
        this.countriesObj = regions.filter((x: any) => x.region_id === this.regionId);
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
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

  getDomain() {
    this.commonService.showLoading();
    this.generalDrpdownsService.getDomain().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.domainObj = res.data;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }
}
