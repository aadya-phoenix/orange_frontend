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
      password: new FormControl('', this.isCreate ? [Validators.required,Validators.pattern(passwordRegexp)] : []),
      confirm_password: new FormControl('', this.isCreate ? [Validators.required,Validators.pattern(passwordRegexp)] : []),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      role_id: new FormControl('', [Validators.required]),
      region_id: new FormControl('', []),
      pdl_member: new FormControl(false, []),
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
      }
      else{
        this.isCreate = true;
      }
    });
    this.getRole();
    this.getRegionalCordinator();
  }

  getSelectedRole(event:any){
   if(event.id == 3){
     this.isRegion = true;
   }
   else{
    this.isRegion = false;
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
    !this.user_id ? this.create(body) : this.update(body);
  }

  create(body:any){
    this.commonService.showLoading();
    this.userManageService.createUser(body).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.commonService.toastSuccessMsg('User', 'Successfully Created.');
        this.router.navigateByUrl(`/user/edit/${res.data.id}`);
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
        this.commonService.hideLoading();
        this.commonService.toastSuccessMsg('User', 'Successfully Updated.');
        this.router.navigateByUrl(`/user`);
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  delete(){
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this request!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.commonService.showLoading();
        this.userManageService.changeUserStatus({status:"0"},this.user_id).subscribe((res:any)=>{
          this.commonService.hideLoading();
          this.router.navigateByUrl(`/user`);
          Swal.fire(
            'Deleted!',
            'Your request has been deleted.',
            'success'
          )
        },(err:any)=>{
          this.commonService.hideLoading();
        })
        
      }
    })
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
          }
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  setPassword() {
    if (this.user_id) {
      this.router.navigateByUrl(`/user/change-password/${this.user_id}`);
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
        this.rolesList= res.data;
      },err=>{
       console.log(err);
     });
  }
}
