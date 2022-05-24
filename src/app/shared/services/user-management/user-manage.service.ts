import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common/common.service';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class UserManageService {

  public basePath = environment.baseUrl;
  public apiVersion = environment.apiVersion;
  public headers = new Headers({});
  constructor(private http: HttpService, private commmonService: CommonService) {
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  createuser(data:any){
    const url = `api/${this.apiVersion}/user/create`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling)); 
  }

  getUsers(){
    const url = `/api/${this.apiVersion}/users`;
    return this.http
    .get(url, this.http.headers)
    .pipe(catchError(this.commmonService.Errorhandling));
  }

  updateUser(data:any){
    const url = `api/${this.apiVersion}/user/update`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling)); 
  }

  getUserDetails(id:number){
    const url = `/api/${this.apiVersion}/user/${id}/detail`;
    return this.http
    .get(url, this.http.headers)
    .pipe(catchError(this.commmonService.Errorhandling));
  }

}
