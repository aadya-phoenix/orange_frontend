import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common/common.service';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class OlTestService {

  public basePath = environment.baseUrl;
  public apiVersion = environment.apiVersion;
  public headers = new Headers({});
  constructor(private http: HttpService, private commmonService: CommonService) {
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  create(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/ol-test/create`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  update(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/ol-test/update`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  getOlTest() {
    const url = `${this.basePath}api/${this.apiVersion}/ol-test`; 
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getOlTestDetails(id: number) {
    const url = `${this.basePath}api/${this.apiVersion}/ol-test/${id}/detail`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  OlTestHistory(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/ol-test/${data}/history`;
    return this.http.get(url, this.http.headers).pipe(catchError(this.commmonService.Errorhandling))
  }

  OlTestDelete(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/ol-test/delete`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  OlTestStatus(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/ol-test/status`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

}
