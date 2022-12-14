import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common/common.service';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class PldtoolsService {

  basePath: any = environment.baseUrl;
  apiVersion: any = environment.apiVersion;
  public headers = new Headers({});
  constructor(private http: HttpService, private commmonService: CommonService) {
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  getCourceData(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/dashboard-report/course';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  getSessionData(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/dashboard-report/session';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  getReportData(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/dashboard-report/get-report';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  getCarouselData(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/dashboard-report/carousel';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  getBackOfficeRoleData(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/dashboard-report/back-office-role';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  getSMEDatabaseData(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/dashboard-report/sme-database';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }
  getLearningModuleData(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/dashboard-report/new-learning';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  getDNAModuleData(data: any, id: number) {
    const url = this.basePath + 'api/' + this.apiVersion + '/dashboard-report/' + id + '/digital-learning';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

}
