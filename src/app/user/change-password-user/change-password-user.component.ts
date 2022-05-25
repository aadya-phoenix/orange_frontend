import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { passwordMatchingValidatior } from 'src/app/shared/constant/customValidators';
import { dataConstant } from 'src/app/shared/constant/dataConstant';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { UserManageService } from 'src/app/shared/services/user-management/user-manage.service';
const passwordRegexp = dataConstant.PasswordPattern;

@Component({
  selector: 'app-change-password-user',
  templateUrl: './change-password-user.component.html',
  styleUrls: ['./change-password-user.component.scss']
})
export class ChangePasswordUserComponent implements OnInit {
  
  setPassswordForm: FormGroup;
  user_id:any;
  isSubmitted = false;
  notmatched = false ;

  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userManageServicse:UserManageService,
    private commonService:CommonService,
    private router: Router) { 
    this.setPassswordForm = this.formBuilder.group({
      password: new FormControl('', [Validators.required,Validators.pattern(passwordRegexp)]),
      confirm_password: new FormControl('', [Validators.required,Validators.pattern(passwordRegexp)]),
    },
    { validators: passwordMatchingValidatior } );
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const Id = params.get('id');
      this.user_id = Id ? parseInt(Id) : 0;
    });
  }

  setPassword(){
    this.isSubmitted = true;
    if (this.setPassswordForm.invalid) {
      return;
    }
    const body = this.setPassswordForm.value;
    this.commonService.showLoading();
    this.userManageServicse.changePassword(body,this.user_id).subscribe(
      (res: any) => {
        this.commonService.hideLoading();
        this.commonService.toastSuccessMsg('Password', 'Successfully Changed.');
        this.router.navigateByUrl(`/user/edit/${this.user_id}`);
      },
      (err: any) => {
        this.commonService.hideLoading();
        this.commonService.toastErrorMsg('Error', err.message);
      }
    );
  }

  getConfirm_paassword(){
    const password = this.setPassswordForm.get('password') as FormControl;
    const confirmPassword = this.setPassswordForm.get('confirm_password') as FormControl;
    if(password?.value != confirmPassword?.value){
      this.notmatched= true ;
    }
    else{
      this.notmatched = false;
    }
    }
}