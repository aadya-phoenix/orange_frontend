import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { EncryptionService } from 'src/app/shared/services/encrypt-decrypt/encryption.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  incorrectCredential = false;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private router: Router,
    private encrypt: EncryptionService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    const emailregexp = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
    this.loginForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(emailregexp),
      ]),
      password: new FormControl('', [
        Validators.required,
        // Validators.minLength(8),
        // Validators.maxLength(20),
        // PasswordStrengthValidator,
      ]),
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  login() {
    let allroles;
    let roleObj: any;
    this.incorrectCredential = false;
    if (this.loginForm.valid) {
      this.commonService.showLoading();
      this.authService.login(this.loginForm.value).subscribe(
        (res: any) => {
          if (res) {
            localStorage.setItem('loginDetails', JSON.stringify(res));
            this.lastLogin();
            this.authService.getProfileDetails().subscribe((profile) => {
              // this.authService.getRoles().subscribe((res: any) => {
              //   allroles = res.data;
              //   allroles.find((currentrole: any) => {
              //     if (currentrole.id === profile.data.role_id) {
              //       roleObj = currentrole;
              //     }
              //   });
              //   this.commonService.hideLoading();
              //   localStorage.setItem('role', JSON.stringify(roleObj));
              // });
              localStorage.setItem('profileDetails', JSON.stringify(profile));
              let params = this.route.snapshot.queryParams;
              if (params['redirectURL']) {
                this.router.navigate([params['redirectURL']]);
              } else {
                this.router.navigate(['/']);
              }
            });
          }
        },
        (error) => {
          this.incorrectCredential = error.status == 401;
          this.commonService.errorHandling(error);
          this.commonService.hideLoading();
        }
      );
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  lastLogin() {
    this.authService.lastLogin().subscribe(res => {
    }, err => {
      this.commonService.errorHandling(err);
    })
  }
}
