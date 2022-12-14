import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common/common.service';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class UserManageService {

  basePath: any = environment.baseUrl;
  apiVersion: any = environment.apiVersion;
  public headers = new Headers({});
  constructor(private http: HttpService, private commmonService: CommonService) {
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  createUser(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/user/create';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  getUsers() {
    const url = this.basePath + 'api/' + this.apiVersion + '/users';
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  updateUser(data: any, id: number) {
    const url = this.basePath + 'api/' + this.apiVersion + '/user/'+id+'/update';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  getUserDetails(id: number) {
    const url = this.basePath + 'api/' + this.apiVersion + '/user/'+id+'/detail';
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  changeUserStatus(data: any, id: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/user/'+id+'/status';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  changePassword(data: any, id: number) {
    const url = this.basePath + 'api/' + this.apiVersion + '/user/'+id+'/password';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  switchUser(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/user/switch';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }
  contcatUs(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/contact-us/send';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }
}
