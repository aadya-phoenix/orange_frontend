import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common/common.service';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class GoldToolService {

  public basePath = environment.baseUrl;
  public apiVersion = environment.apiVersion;
  public headers = new Headers({});
  constructor(private http: HttpService, private commmonService: CommonService) {
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  create(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/gold-tool/create`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  update(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/gold-tool/update`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  getGoldTool() {
    const url = `${this.basePath}api/${this.apiVersion}/gold-tool`; 
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getHRBPEmail() {
    const url = `${this.basePath}api/${this.apiVersion}/user/hrbp`; 
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getGoldToolDetails(id: number) {
    const url = `${this.basePath}api/${this.apiVersion}/gold-tool/${id}/detail`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  goldToolHistory(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/gold-tool/${data}/history`;
    return this.http.get(url, this.http.headers).pipe(catchError(this.commmonService.Errorhandling))
  }

  goldToolDelete(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/gold-tool/delete`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  goldToolStatus(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/gold-tool/status`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

}
