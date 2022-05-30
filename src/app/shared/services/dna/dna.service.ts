import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common/common.service';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class DnaService {
  public basePath = environment.baseUrl;
  public apiVersion = environment.apiVersion;
  public headers = new Headers({});

  constructor(private http: HttpService, private commmonService: CommonService) {
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  create(data: any) {
    const url = `/api/${this.apiVersion}/digital-learning/create`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  update(data: any) {
    const url = `/api/${this.apiVersion}/digital-learning/update`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  getDna() {
    const url = `/api/${this.apiVersion}/digital-learning`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getDnaDetails(id: number) {
    const url = `/api/${this.apiVersion}/digital-learning/${id}/detail`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  dnaHistory(data: any) {
    const url = `api/${this.apiVersion}/digital-learning/${data}/history`;
    return this.http.get(url, this.http.headers).pipe(catchError(this.commmonService.Errorhandling))
  }

  dnaChangeStatus(data: any) {
    const url = `api/${this.apiVersion}/digital-learning/status`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  dnaFilter(data:any){
    const url = `api/${this.apiVersion}/digital-learning/filter`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  delete(data:any){
    const url = `api/${this.apiVersion}/digital-learning/delete`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }
}
