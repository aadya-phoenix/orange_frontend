import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common/common.service';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class DesignLearningService {

  public basePath = environment.baseUrl;
  public apiVersion = environment.apiVersion;
  public headers = new Headers({});
  public params = new HttpParams();

  constructor(private http: HttpService, private commmonService: CommonService) {
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  create(data: any) {
    const url = `/api/${this.apiVersion}/new-learning/create`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  update(data: any) {
    const url = `/api/${this.apiVersion}/new-learning/update`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  getModules(){
    const url = `/api/${this.apiVersion}/new-learning`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getProjectManager(){
    const url = `/api/${this.apiVersion}/new-learning/project-manager`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));  
  }

  filter(data: any){
    const url = `api/${this.apiVersion}/new-learning/filter`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  detail(id:number){
    const url = `/api/${this.apiVersion}/new-learning/${id}/detail`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getHistory(id:number){
    const url = `/api/${this.apiVersion}/new-learning/${id}/history`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  changeStatus(data: any) {
    const url = `api/${this.apiVersion}/new-learning/status`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }


}
