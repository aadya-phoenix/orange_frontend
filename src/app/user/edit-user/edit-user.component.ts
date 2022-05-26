import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {  passwordMatchingValidatior } from 'src/app/shared/constant/customValidators';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
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
  dateTimeFormate = dataConstant.dateTimeFormate;
  createUserForm: FormGroup;
  user_id:any;
  user_details:any;
  rolesList:any=[];
  regionList:any=[];
  isRegion = false;
  isCreate = false;
  notmatched = false ;
  isSubmitted = false;

  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userManageService:UserManageService,
    private courceService:CourcesService,
    private commonService:CommonService,
    private router: Router,) { 
    this.createUserForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required,Validators.pattern(emailregexp)]),
      password: new FormControl('', []),
      confirm_password: new FormControl('', []),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      role_id: new FormControl('', [Validators.required]),
      region_id: new FormControl('', []),
      pdl_member: new FormControl(false, []),
      status: new FormControl(true, []),
      admin: new FormControl(false, []),
      staff: new FormControl(true, []),
    },
    { validators: passwordMatchingValidatior } );
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.user_id = Id ? parseInt(Id) : 0;
      if(this.user_id){
       this.isCreate = false ;
       this.getUserDetails();
       this.createUserForm.get('password')?.clearValidators();
       this.createUserForm.get('confirm_password')?.clearValidators();
       this.createUserForm.get('password')?.setValue(null);
       this.createUserForm.get('confirm_password')?.setValue(null);
      }
      else{
        this.isCreate = true;
        this.createUserForm.get('password')?.setValidators([Validators.required, Validators.pattern(passwordRegexp)]);
        this.createUserForm.get('confirm_password')?.setValidators([Validators.required, Validators.pattern(passwordRegexp)]);
      }
    });
    this.getRole();
    this.getRegionalCordinator();
  }

  getSelectedRole(event:any){
   if(event.id == 3 || event.id == 5){
     this.isRegion = true;
     this.createUserForm.get('region_id')?.setValidators([Validators.required]);
   }
   else{
    this.isRegion = false;
    this.createUserForm.get('region_id')?.clearValidators();
    this.createUserForm.get('region_id')?.setValue(null);
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
    const newbody = this.createUserForm.value;
    console.log("body",newbody);
    this.isSubmitted = true;
    if (this.createUserForm.invalid) {
      console.log("invalid");
      return;
      
    }
    const body = this.createUserForm.value;
    !this.user_id ? this.create(body) : this.update(body);
  }

  create(body:any){
    this.commonService.showLoading();
    this.userManageService.createUser(body).subscribe(
      (res: any) => {
        if (res.status === 1 && res.message === 'Success'){
        this.commonService.hideLoading();
        this.commonService.toastSuccessMsg('User', 'Successfully Created.');
        this.router.navigateByUrl(`/user/edit/${res.data.id}`);
        }
        else{
          this.commonService.toastErrorMsg('Error',res.message);
          this.commonService.hideLoading();
        }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  update(body:any){
    this.commonService.showLoading();
    this.userManageService.updateUser(body,this.user_id).subscribe(
      (res: any) => {
        if (res.status === 1 && res.message === 'Success'){
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
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  getUserDetails() {
    this.commonService.showLoading();
    this.userManageService.getUserDetails(this.user_id).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        if (res.status === 1 && res.message === 'Success') {
          this.user_details = res.data;
          this.createUserForm.controls.email.setValue(this.user_details.email);
          this.createUserForm.controls.first_name.setValue(this.user_details.first_name);
          this.createUserForm.controls.last_name.setValue(this.user_details.last_name);
          this.createUserForm.controls.role_id.setValue(this.user_details.role_id);
          if(this.user_details.role_id == 3){
          this.createUserForm.controls.region_id.setValue(this.user_details.region_id);
          this.isRegion = true;
          }
          else{
            this.isRegion = false;
          }
          this.createUserForm.controls.pdl_member.setValue(this.user_details.pdl_member == "1" ? true : false);
          this.createUserForm.controls.status.setValue(this.user_details.status == "1" ? true : false);
          if(this.user_details.admin){
          this.createUserForm.controls.admin.setValue(this.user_details.admin == "1" ? true : false);
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
        this.commonService.toastErrorMsg('Error', err.message);
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
       console.log(err);
     });
  }

  getRole(){
    this.courceService.getRole().subscribe(
      res=>{
        let roles = res.data;
        this.rolesList = roles.filter((a:any) => {
          return a.status == 1
        });
      },err=>{
       console.log(err);
     });
  }
}
