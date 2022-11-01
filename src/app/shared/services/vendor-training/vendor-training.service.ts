import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common/common.service';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class VendorTrainingService {

  basePath: any = environment.baseUrl;
  apiVersion: any = environment.apiVersion;
  public headers = new Headers({});
  constructor(private http: HttpService, private commmonService: CommonService) {
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  create(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/external-vendor/create';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  update(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/external-vendor/update';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  getTrainingList() {
    const url = this.basePath + 'api/' + this.apiVersion + '/external-vendor';
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getDetails(id:any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/external-vendor/' + id + '/detail';
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  delete(data:any){
    const url = this.basePath + 'api/' + this.apiVersion + '/external-vendor/delete';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  history(data:any){
    const url = this.basePath + 'api/' + this.apiVersion + '/external-vendor/' + data + '/history';
    return this.http.get(url, this.http.headers).pipe(catchError(this.commmonService.Errorhandling))
  }

}
