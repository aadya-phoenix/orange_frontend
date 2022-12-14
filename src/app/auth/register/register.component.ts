import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/auth/authentication.service';
import { PasswordStrengthValidator } from '../password-strength.validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public registerForm!: FormGroup;
  constructor(private authService: AuthenticationService,private router:Router) {}

  ngOnInit(): void {
    const emailregexp = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
    const nameregexp = '^[a-zA-Z ]{2,10}$';
    this.registerForm = new FormGroup({
      first_name: new FormControl('', [
        Validators.required,
        Validators.pattern(nameregexp),
      ]),
      last_name: new FormControl('', [
        Validators.required,
        Validators.pattern(nameregexp),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(emailregexp),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        PasswordStrengthValidator,
      ]),
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  register() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(
        (res: any) => {
          if(res){
            this.router.navigate(['/login'])
          }
        },
        (err: any) => {
        }
      );
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
