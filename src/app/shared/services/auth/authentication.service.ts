import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { EncryptionService } from '../encrypt-decrypt/encryption.service';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  basePath: any = environment.baseUrl;
  apiVersion: any = environment.apiVersion;
  clientId: any = environment.clientId;
  clientSecret: any = environment.clientSecret;



  constructor(private http: HttpService, private router: Router, private encrypt: EncryptionService, private httpClient: HttpClient) { }


  register(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/register';
    return this.http.post(url, data);
  }

  login(data: any) {
    let clienSecret = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
    };
    let grantObj = { grant_type: 'password' };
    let totalObj = { ...grantObj, ...clienSecret, ...data };
    const url = this.basePath + 'oauth/token';
    return this.httpClient.post(url, totalObj,{
      headers: new HttpHeaders({
      })
    });
  }

  getLoginDetails() {
    return JSON.parse(localStorage.getItem('loginDetails') || '{}');
  }

  getProfileDetails() {
    const url = this.basePath + 'api/' + this.apiVersion + '/profile';
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  getProfileDetailsfromlocal() {
    return JSON.parse(localStorage.getItem('profileDetails') || '{}');
  }

  getRolefromlocal() {
    if (localStorage.getItem('userName')) {
      const user = JSON.parse(localStorage.getItem('userName') || '{}');
      return user.role_id;
    }
    else {
      return [];
    }
  }

  getUserDetailslocal() {
    return JSON.parse(localStorage.getItem('userName') || '{}');
  }

  getRoles() {
    const url = this.basePath + 'api/' + this.apiVersion + '/roles';
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  getUserRoles() {
    const url = this.basePath + 'api/' + this.apiVersion + '/role-users';
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  getROMROCList(rom_id: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/rom/'+rom_id+'/roc';
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  lastLogin() {
    const url = this.basePath + 'api/' + this.apiVersion + '/user/last-login';
    return this.http.post(url, {}).pipe(catchError(this.Errorhandling));
  }

  logOut() {
    const laungauge = localStorage.getItem('laungauge');
    localStorage.clear();
    if (laungauge) {
      localStorage.setItem('laungauge', laungauge);
    }
    this.router.navigate(['/login']);
  }

  Errorhandling(err: HttpErrorResponse) {
    if (err.status === 401) {
      this.router.navigate(['/login']);
    }
    if (err.error instanceof ErrorEvent) {
      console.error(err.error.message);
    } else {
      console.error(`Backend returned code ${err.status}`);
    }
    return throwError('Please try again later.');
  }
}
