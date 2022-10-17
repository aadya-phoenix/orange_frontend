import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common/common.service';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class BackOfficeService {

  basePath: any = environment.baseUrl;
  apiVersion: any = environment.apiVersion;
  public headers = new Headers({});
  constructor(private http: HttpService, private commmonService: CommonService) {
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  create(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/back_office_role/create';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  update(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/back_office_role/update';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  getCCTLearningRole() {
    const url = this.basePath + 'api/' + this.apiVersion + '/cct-learning-role';
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getCCTDeliveryPerimeter() {
    const url = this.basePath + 'api/' + this.apiVersion + '/cct-delivery-perimeter';
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getBackOffice() {
    const url = this.basePath + 'api/' + this.apiVersion + '/back_office_role';
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getBackOfficeReport(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/back_office_role/filter';
    return this.http
      .post(url, data)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getBackOfficePublisher() {
    const url = this.basePath + 'api/' + this.apiVersion + '/back_office_role/publisher-list';
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getCCTTermCondition() {
    const url = this.basePath + 'api/' + this.apiVersion + '/cct-term-condition';
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }


  getBackOfficeDetails(id: number) {
    const url = this.basePath + 'api/' + this.apiVersion + '/back_office_role/'+id+'/detail';
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  backOfficeHistory(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/back_office_role/'+data+'/history';
    return this.http.get(url, this.http.headers).pipe(catchError(this.commmonService.Errorhandling))
  }

  backOfficeDelete(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/back_office_role/delete';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  backOfficeCopy(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/back_office_role/copy';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  backOfficeStatus(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/back_office_role/status';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  backOfficeTransfer(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/back_office_role/transfer';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

}
