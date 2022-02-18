import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public basePath = environment.baseUrl;
  public apiVersion = environment.apiVersion;
  public clientId = environment.clientId;
  public clientSecret = environment.clientSecret;
  constructor(private http: HttpService,private router:Router) {}

  register(data: any) {
    const url = `/api/${this.apiVersion}/register`;
    console.log(data);
    return this.http.post(url, data);
  }

  login(data: any) {
    let clienSecret = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
    };
    let grantObj = { grant_type: 'password' };
    let totalObj = { ...grantObj, ...clienSecret, ...data };
    const url = `/oauth/token`;
    console.log(data);
    return this.http.post(url, totalObj);
  }

  getLoginDetails() {
    return JSON.parse(localStorage.getItem('loginDetails') || '{}');
  }

  getProfileDetails() {
    const url = `api/${this.apiVersion}/profile`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  logOut() {
    localStorage.clear();
    console.log('sdsds')
    this.router.navigate(['/login'])
  }

  Errorhandling(err: HttpErrorResponse) {
    if (err.error instanceof ErrorEvent) {
      console.error(err.error.message);
    } else {
      console.error(`Backend returned code ${err.status}`);
    }
    return throwError('Please try again later.');
  }
}
