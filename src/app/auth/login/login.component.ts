import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { EncryptionService } from 'src/app/shared/services/encrypt-decrypt/encryption.service';
import { PasswordStrengthValidator } from '../password-strength.validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private encrypt:EncryptionService
  ) {}

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
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (res: any) => {
          console.log(res);
          if (res) {
            localStorage.setItem('loginDetails', JSON.stringify(res));
            this.router.navigate(['/dashboard']);
            this.authService.getProfileDetails().subscribe((profile) => {
              console.log(profile);
              this.authService.getRoles().subscribe((res: any) => {
                allroles = res.data;
                allroles.find((currentrole: any) => {
                  if (currentrole.id === profile.data.role_id) {
                    roleObj = currentrole;
                  }
                });
                console.log(roleObj);
                localStorage.setItem('role',JSON.stringify(roleObj));
               // localStorage.setItem('role',JSON.stringify(this.encrypt.encryptUsingAES256(roleObj)));
              });
              localStorage.setItem('profileDetails', JSON.stringify(profile));
            });
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
      console.log(this.loginForm.value);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
