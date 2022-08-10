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
  lableConstant: any = { french: {}, english: {} };
  setPassswordForm: FormGroup;
  user_id:any;
  isSubmitted = false;
  notmatched = false ;

  constructor(private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private userManageServicse:UserManageService,
    private commonService:CommonService,
    private router: Router) { 
      this.lableConstant = localStorage.getItem('laungauge') === dataConstant.Laungauges.FR ? this.commonService.laungaugesData.french : this.commonService.laungaugesData.english;
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

  requiredMessage(field:any){
    return this.lableConstant.form_fieldname_cannot_be_blank.replace('<form fieldname>', field).replace('<nom du champ>', field);
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
        if (res.status === 1 ){
        this.commonService.hideLoading();
        this.commonService.toastSuccessMsg('Password', 'Successfully Changed.');
        this.router.navigateByUrl(`/user/edit/${this.user_id}`);
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
