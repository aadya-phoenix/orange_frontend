import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common/common.service';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class OlTestService {

  basePath: any = environment.baseUrl;
  apiVersion: any = environment.apiVersion;
  public headers = new Headers({});
  constructor(private http: HttpService, private commmonService: CommonService) {
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  create(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/ol-test/create';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  update(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/ol-test/update';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  getOlTest() {
    const url = this.basePath + 'api/' + this.apiVersion + '/ol-test';
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getOlTestDetails(id: number) {
    const url = this.basePath + 'api/' + this.apiVersion + '/ol-test/'+id+'/detail';
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  OlTestHistory(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/ol-test/'+data+'/history';
    return this.http.get(url, this.http.headers).pipe(catchError(this.commmonService.Errorhandling))
  }

  OlTestDelete(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/ol-test/delete';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  OlTestStatus(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/ol-test/status';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  createSection(data: any, id:any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/ol-test/'+ id +'/section/create';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  updateSection(data: any, id:any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/ol-test/'+ id +'/section/update';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  getSection(id:any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/ol-test/'+ id +'/section';
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  deleteSection(data: any, id:any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/ol-test/'+ id +'/section/delete';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }


}
