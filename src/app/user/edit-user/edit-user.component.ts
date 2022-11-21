import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import * as _ from 'lodash';
import {  passwordMatchingValidatior } from 'src/app/shared/constant/customValidators';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { GeneralDropdownsService } from 'src/app/shared/services/general-dropdowns/general-dropdowns.service';
import { UserManageService } from 'src/app/shared/services/user-management/user-manage.service';
import Swal from 'sweetalert2';
const passwordRegexp = dataConstant.PasswordPattern;
const emailregexp = dataConstant.EmailPattren;

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  lableConstant: any = { french: {}, english: {} };
  dateTimeFormate = dataConstant.dateTimeFormate;
  createUserForm: FormGroup;
  user_id:any;
  user_details:any;
  rolesList:any=[];
  regionList:any=[];
  regionDnaObj:any=[];
  domainObj: any = [];
  countriesObj:any =[];
  regions:any = [];
  bussinessUnitObj:any = [];
  isRegion = false;
  isDnaRegion = false;
  isCreate = false;
  notmatched = false ;
  isSubmitted = false;
  isDomain = false;
  isBussinessUnit = false;
  isCountry = false;
  isLearningType =false;
  learningTypes:any=[];
  roleId:any =[];
  regionId: number=0;

  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userManageService:UserManageService,
    private courceService:CourcesService,
    private generalDrpdownsService: GeneralDropdownsService,
    private commonService:CommonService,
    private router: Router,) { 
    this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
    this.createUserForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required,Validators.pattern(emailregexp)]),
      manager_email: new FormControl('', [Validators.required,Validators.pattern(emailregexp)]),
     // password: new FormControl('', []),
     // confirm_password: new FormControl('', []),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      role_id: new FormControl([], []),
      //region_id: new FormControl('', []),
    //  learning_type:new FormControl([''], []),
      pdl_member: new FormControl(false, []),
      status: new FormControl(true, []),
      admin: new FormControl(false, []),
      manager:new FormControl(false, []),
      staff: new FormControl(true, []),
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.user_id = Id ? parseInt(Id) : 0;
      if(this.user_id){
       this.isCreate = false ;
       this.getUserDetails();
       this.createUserForm.removeControl('password');
       this.createUserForm.removeControl('confirm_password');
      }
      else{
        this.isCreate = true;
       // this.getCountries();
        this.createUserForm.addControl('password', new FormControl(null, [Validators.required, Validators.pattern(passwordRegexp)]));
        this.createUserForm.addControl('confirm_password', new FormControl(null, [Validators.required, Validators.pattern(passwordRegexp)]));
      }
    });
    this.getRole();
    this.getRegionalCordinator();
    this.getLearningType();
    this.getBusinessUnits();
    this.getRegions();
  }

  requiredMessage(field:any){
    return this.lableConstant.form_fieldname_cannot_be_blank.replace('<form fieldname>', field).replace('<nom du champ>', field);
  }

  getSelectedRole(event:any){
    this.roleId = event.map((x: { id: any; }) => x.id);
    if(this.roleId.includes(3) ){
     this.isRegion = true;
     this.isLearningType = false;
     this.isDnaRegion = false;
     this.isCountry = false;
     this.isDomain = false;
     this.isBussinessUnit = false;
     this.createUserForm.addControl('region_id', new FormControl(null, [Validators.required]));
     this.createUserForm.removeControl('learning_type');
     this.createUserForm.removeControl('business_unit_id');
     this.createUserForm.removeControl('domain_training_id');
     this.createUserForm.removeControl('country');
    }
    else if(this.roleId.includes(4)){
     this.isLearningType =true;
     this.isRegion = false;
     this.isDnaRegion = false;
     this.isCountry = false;
     this.isDomain = false;
     this.isBussinessUnit = false;
     this.createUserForm.addControl('learning_type', new FormControl(null, [Validators.required]));
     this.createUserForm.removeControl('region_id');
     this.createUserForm.removeControl('business_unit_id');
     this.createUserForm.removeControl('domain_training_id');
     this.createUserForm.removeControl('country');
    }
    else if(this.roleId.includes(5)){
      this.isDnaRegion = true;
      this.isRegion = false;
      this.isLearningType = false;
      this.isDomain = false;
      this.isBussinessUnit = false;
      this.isCountry = false;
      this.createUserForm.addControl('region_id', new FormControl(null, [Validators.required]));
      this.createUserForm.removeControl('learning_type');
      this.createUserForm.removeControl('business_unit_id');
      this.createUserForm.removeControl('domain_training_id');
      this.createUserForm.removeControl('country');
     }
     else if(this.roleId.includes(12)){
      this.isBussinessUnit = true;
      this.isLearningType = false;
      this.isRegion = false;
      this.isDomain = false;
      this.isDnaRegion = false;
      this.isCountry = false; 
      this.createUserForm.addControl('business_unit_id', new FormControl(null, [Validators.required]));
      this.createUserForm.removeControl('learning_type');
      this.createUserForm.removeControl('domain_training_id');
      this.createUserForm.removeControl('region_id');
      this.createUserForm.removeControl('country');
     }
     else if(this.roleId.includes(13)){
      this.isDnaRegion = true;
      this.isCountry = true;
      this.isLearningType = false;
      this.isDomain = false;
      this.isRegion = false;
      this.isBussinessUnit = false;
      this.createUserForm.addControl('region_id', new FormControl(null, [Validators.required]));
      this.createUserForm.addControl('country', new FormControl(null, [Validators.required]));
      this.createUserForm.removeControl('business_unit_id');
      this.createUserForm.removeControl('learning_type');
      this.createUserForm.removeControl('domain_training_id');
     }
    else if(this.roleId.includes(14)){
      this.isDomain = true;
      this.isRegion = false;
      this.isBussinessUnit = false;
      this.isCountry = false;
      this.isDnaRegion = false;
      this.isLearningType = false;
      this.createUserForm.addControl('domain_training_id', new FormControl(null, [Validators.required]));
      this.createUserForm.removeControl('region_id');
      this.createUserForm.removeControl('learning_type');
      this.createUserForm.removeControl('business_unit_id');
      this.createUserForm.removeControl('country');
     }
    else{
     this.isRegion = false;
     this.isDnaRegion = false;
     this.isLearningType = false;
     this.isBussinessUnit = false;
     this.isCountry = false;
     this.isDomain = false;
     this.createUserForm.removeControl('region_id');
     this.createUserForm.removeControl('learning_type');
     this.createUserForm.removeControl('business_unit_id');
     this.createUserForm.removeControl('country');
     this.createUserForm.removeControl('domain_training_id');
    }
  }

  getConfirm_paassword(){
  const password = this.createUserForm.get('password') as FormControl;
  const confirmPassword = this.createUserForm.get('confirm_password') as FormControl;
  if(password?.value != confirmPassword?.value){
    this.notmatched= true ;
  }
  else{
    this.notmatched = false;
  }
  }

  save(){
    this.isSubmitted = true;
    if (this.createUserForm.invalid) {
      return;
    }
    const body = this.createUserForm.value;
    let isValidRole = true;
    if(body.role_id && body.role_id.length > 0){
      const roles =Object.values(_.countBy(this.rolesList.filter((x: { id: any; }) => body.role_id.includes(x.id)),'module'));
      roles.forEach((element: any) => {
        if(_.gt(element, 1))
        {
          isValidRole = false;
          Swal.fire(
            'Role!',
            `One Module have more than one role select. Please select valid role`,
            'warning'
          )
          return;
        }
      });
    }
    if(isValidRole){
      !this.user_id ? this.create(body) : this.update(body);
    }
   
  }

  create(body:any){
    this.commonService.showLoading();
    this.userManageService.createUser(body).subscribe(
      (res: any) => {
        if (res.status === 1){
        this.commonService.hideLoading();
        this.commonService.toastSuccessMsg('User', 'Successfully Created.');
        this.router.navigateByUrl(`/user`);
        }
        else{
          this.commonService.toastErrorMsg('Error',res.message);
          this.commonService.hideLoading();
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  update(body:any){
    this.commonService.showLoading();
    this.userManageService.updateUser(body,this.user_id).subscribe(
      (res: any) => {
        if (res.status == 1 ){
        this.commonService.hideLoading();
        this.commonService.toastSuccessMsg('User', 'Successfully Updated.');
        this.router.navigateByUrl(`/user`);
       }
       else{
        this.commonService.toastErrorMsg('Error',res.message);
        this.commonService.hideLoading();
       }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  getUserDetails() {
    this.commonService.showLoading();
    this.userManageService.getUserDetails(this.user_id).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 ) {
          this.user_details = res.data;
          this.createUserForm.controls.email.setValue(this.user_details.email);
          this.createUserForm.controls.manager_email.setValue(this.user_details.manager_email);
          this.createUserForm.controls.first_name.setValue(this.user_details.first_name);
          this.createUserForm.controls.last_name.setValue(this.user_details.last_name);
          this.createUserForm.controls.role_id.setValue(this.user_details.role_id);
          if(this.user_details.role_id.includes(3)){
            this.isRegion = true;
            this.createUserForm.addControl('region_id', new FormControl(null, [Validators.required]));
            this.createUserForm.controls.region_id.setValue(this.user_details.region_id);
          }
          if(this.user_details.role_id.includes(4) ){
            this.isLearningType = true;
            this.createUserForm.addControl('learning_type', new FormControl(null, [Validators.required]));
            if(this.user_details.learning_type){
              this.createUserForm.controls.learning_type.setValue(JSON.parse(this.user_details.learning_type));
            }
          }
          if(this.user_details.role_id.includes(5) ){
            this.isDnaRegion = true;
            this.createUserForm.addControl('region_id', new FormControl(null, [Validators.required]));
            this.createUserForm.controls.region_id.setValue(this.user_details.region_id);
          }
          if(this.user_details.role_id.includes(12) ){
            this.isBussinessUnit = true;
            this.createUserForm.addControl('business_unit_id', new FormControl(null, [Validators.required]));
            this.createUserForm.controls.business_unit_id.setValue(this.user_details.business_unit_id);
          }
          if(this.user_details.role_id.includes(13) ){
            this.isDnaRegion = true;
            this.isCountry = true;
            this.regionId = this.user_details.region_id;
            this.getCountries(this.regionId);
            this.createUserForm.addControl('region_id', new FormControl(null, [Validators.required]));
            this.createUserForm.addControl('country', new FormControl(null, [Validators.required]));
            this.createUserForm.controls.country.setValue(this.user_details.country);
            this.createUserForm.controls.region_id.setValue(this.user_details.region_id);
          }
          if(this.user_details.role_id.includes(14) ){
            this.isDomain = true;
            this.createUserForm.addControl('domain_training_id', new FormControl(null, [Validators.required]));
            this.createUserForm.controls.domain_training_id.setValue(this.user_details.domain_training_id);
          }
          this.createUserForm.controls.pdl_member.setValue(this.user_details.pdl_member == "1" ? true : false);
          this.createUserForm.controls.status.setValue(this.user_details.status == "1" ? true : false);
          if(this.user_details.admin){
           this.createUserForm.controls.admin.setValue(this.user_details.admin == "1" ? true : false);
           }
           if(this.user_details.manager){
            this.createUserForm.controls.manager.setValue(this.user_details.manager == "1" ? true : false);
             }
          if(this.user_details.staff){
           this.createUserForm.controls.staff.setValue(this.user_details.staff == "1" ? true : false);
           }
          }
          else{
            this.commonService.toastErrorMsg('Error',res.message);
            this.commonService.hideLoading();
          }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.errorHandling(err);
      }
    );
  }

  setPassword() {
    this.commonService.showLoading();
    if (this.user_id) {
      this.router.navigateByUrl(`/user/change-password/${this.user_id}`);
      this.commonService.hideLoading();
    }
    
  }

  getRegionalCordinator(){
    this.courceService.getregionalCordinator().subscribe(
      res=>{
        this.regionList= res.data;
      },err=>{
        this.commonService.errorHandling(err);
     });
  }

  getRole(){
    this.courceService.getModuleRole().subscribe(
      res=>{
        let roles = res.data;
        this.rolesList = [];
        roles.forEach((module: any) => {
          if(module.roles){
          module.roles.forEach((element: any) => {
            if(element.status){
              element.module = module.module;
              this.rolesList.push(element);
            }
          });
        }
        });
      },err=>{
        this.commonService.errorHandling(err);
     });
  }

  getLearningType(){
    this.courceService.getLearningType().subscribe(
      res=>{
        this.learningTypes= res.data;
      },err=>{
        this.commonService.errorHandling(err);
     });  
  }

  getRegions(){
    this.commonService.showLoading();
    this.generalDrpdownsService.getRegions().subscribe(
      (res: any) => {
        this.commonService.hideLoading();
       this.regionDnaObj = res.data;
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  getCountries(regionid:any){
   this.commonService.showLoading();
   this.generalDrpdownsService.getCountriesByRegion(regionid).subscribe(
     (res: any) => {
       this.commonService.hideLoading();
       this.countriesObj = res.data;
       //this.countriesObj = this.regions.filter((x:any)=>x.region_id === this.regionId);
     },
     (err: any) => {
       this.commonService.hideLoading();
       this.commonService.toastErrorMsg('Error', err.message);
     }
   );
  }

  getSelectedRegion(event:any){
    this.regionId = event.id;
    if (event.region_name == 'Global') {
      this.isCountry = false;
      this.createUserForm.removeControl('country');
    }
    else {
      this.isCountry = true;
      this.createUserForm.addControl('country',new FormControl('', [Validators.required]));
      this.createUserForm.controls.country.setValue('');
      this.getCountries(this.regionId);
    }
    this.countriesObj = this.regions.filter((x:any)=>x.region_id === this.regionId);
  }
 
  getBusinessUnits(){
    this.generalDrpdownsService.getBusinessUnits().subscribe( (res: any) => {
      this.commonService.hideLoading();
      this.bussinessUnitObj = res.data;
    },
    (err: any) => {
      this.commonService.hideLoading();
      this.commonService.toastErrorMsg('Error', err.message);
    }
  );
  }
 
  getDomain(){
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
