import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/constant/customValidators';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CourcesService } from 'src/app/shared/services/cources/cources.service';
import { UserManageService } from 'src/app/shared/services/user-management/user-manage.service';
const passwordRegexp = dataConstant.PasswordPattern;

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  createUserForm: FormGroup;
  rolesList:any=[];
  regionList:any=[];
  isRegion = false;
  isCreate = false;

  constructor(private formBuilder: FormBuilder,
    private userManageServicse:UserManageService,
    private courceService:CourcesService,
    private commonService:CommonService,) { 
    this.createUserForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required,Validators.pattern(passwordRegexp)]),
      confirm_password: new FormControl('', [Validators.required]),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      role_id: new FormControl('', [Validators.required]),
      region_id: new FormControl('', [Validators.required]),
      pdl_member: new FormControl(false, [Validators.required]),
    },
    CustomValidators.mustMatch('password', 'confirm_password') );
  }

  ngOnInit(): void {
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

  getRole(){
    this.courceService.getRole().subscribe(
      res=>{
        this.rolesList= res.data;
      },err=>{
       console.log(err);
     });
  }

  getRegionalCordinator(){
    this.courceService.getregionalCordinator().subscribe(
      res=>{
        this.regionList= res.data;
      },err=>{
       console.log(err);
     });
  }

}
