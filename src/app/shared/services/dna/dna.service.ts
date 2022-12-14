import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common/common.service';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class DnaService {
  basePath: any = environment.baseUrl;
  apiVersion: any = environment.apiVersion;
  public headers = new Headers({});
  public params = new HttpParams();

  constructor(private http: HttpService, private commmonService: CommonService) {
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  create(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/digital-learning/create';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  update(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/digital-learning/update';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  getDna() {
    const url = this.basePath + 'api/' + this.apiVersion + '/digital-learning';
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getUserDigitalLearning(id: any) {
    const params = new HttpParams().set('uid', id);
    const url = this.basePath + 'api/' + this.apiVersion + '/digital-learning';
    return this.http
      .getParams(url, this.http.headers, params)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getFormDetails(id: number) {
    const url = this.basePath + 'api/' + this.apiVersion + '/digital-learning/' + id + '/detail';
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getManagerData(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/user/' + data + '/manager-staff';
    return this.http.get(url, this.http.headers).pipe(catchError(this.commmonService.Errorhandling))
  }

  dnaHistory(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/digital-learning/' + data + '/history';
    return this.http.get(url, this.http.headers).pipe(catchError(this.commmonService.Errorhandling))
  }

  dnaChangeStatus(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/digital-learning/status';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  dnaFullReport(id: number) {
    const url = this.basePath + 'api/' + this.apiVersion + '/digital-learning/' + id + '/filter';
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  dnaFilter(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/digital-learning/filter';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  delete(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/digital-learning/delete';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  getTitleDropdown(type_id: number) {
    const url = this.basePath + 'api/' + this.apiVersion + '/cct-training-course/' + type_id;
    return this.http
  .get(url, this.http.headers)
  .pipe(catchError(this.commmonService.Errorhandling));
  }

createTracker(data: any) {
  const url = this.basePath + 'api/' + this.apiVersion + '/dna-tracker/create';
  return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
}

updateTracker(data: any) {
  const url = this.basePath + 'api/' + this.apiVersion + '/dna-tracker/update';
  return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
}

getTrackerList() {
  const url = this.basePath + 'api/' + this.apiVersion + '/dna-tracker';
  return this.http
    .get(url, this.http.headers)
    .pipe(catchError(this.commmonService.Errorhandling));
}

getTrackerDetail(id: number) {
  const url = this.basePath + 'api/' + this.apiVersion + '/dna-tracker/' + id + '/detail';
  return this.http
    .get(url, this.http.headers)
    .pipe(catchError(this.commmonService.Errorhandling));
}

getTrackerHistoty(id: number) {
  const url = this.basePath + 'api/' + this.apiVersion + '/dna-tracker/' + id + '/history';
  return this.http
    .get(url, this.http.headers)
    .pipe(catchError(this.commmonService.Errorhandling));
}

deleteTracker(data: any) {
  const url = this.basePath + 'api/' + this.apiVersion + '/dna-tracker/delete';
  return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
}

changeTrackerStatus(data: any) {
  const url = this.basePath + 'api/' + this.apiVersion + '/dna-tracker/status';
  return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
}
}
