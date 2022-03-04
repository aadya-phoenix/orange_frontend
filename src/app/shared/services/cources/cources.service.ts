import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class CourcesService {
  public basePath = environment.baseUrl;
  public apiVersion = environment.apiVersion;
  public clientId = environment.clientId;
  public clientSecret = environment.clientSecret;
  public headers = new Headers({});
  constructor(private http: HttpService) {
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  getCources() {
    const url = `/api/${this.apiVersion}/course`;
    const urllive = `${this.basePath}api/${this.apiVersion}/course`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  createCource(data: any) {
    const url = `/api/${this.apiVersion}/course/create`;
    const urllive = `${this.basePath}api/${this.apiVersion}/course/create`;
    return this.http.post(url, data).pipe(catchError(this.Errorhandling));
  }

  updateCourse(data: any) {
    const url = `api/${this.apiVersion}/course/update`;
    return this.http.post(url, data).pipe(catchError(this.Errorhandling));
  }

  changeStatus(data: any) {
    const url = `api/${this.apiVersion}/course/status`;
    return this.http.post(url, data).pipe(catchError(this.Errorhandling));
  }

  courseTransfer(data: any) {
    const url = `api/${this.apiVersion}/course/transfer`;
    return this.http.post(url, data).pipe(catchError(this.Errorhandling));
  }

  deleteCourse(data:any){
    const url =`api/${this.apiVersion}/course/delete`;
    return this.http.post(url, data).pipe(catchError(this.Errorhandling));
  }

  copyCourse(data:any){
    const url =`api/${this.apiVersion}/course/copy`;
    return this.http.post(url, data).pipe(catchError(this.Errorhandling));
  }

  // /api/v4/cct-level
  // /api/v4/cct-validity-period
  // /api/v4/cct-vendor-type
  // /api/v4/cct-subject
  // /api/v4/cct-template
  // /api/v4/cct-entity-list

  getcctLevel() {
    const url = `/api/${this.apiVersion}/cct-level`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  getVendortype() {
    const url = `/api/${this.apiVersion}/cct-vendor-type`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  getSubjects() {
    const url = `/api/${this.apiVersion}/cct-subject`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  getTemplate() {
    const url = `/api/${this.apiVersion}/cct-template`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  getEntitylist() {
    const url = `/api/${this.apiVersion}/cct-entity-list`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  getValidityperiod() {
    const url = `/api/${this.apiVersion}/cct-validity-period`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  //who can see course
  whoSeeCourse() {
    const url = `api/${this.apiVersion}/cct-see-course`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  //learningType
  getLearningType() {
    const url = `api/${this.apiVersion}/cct-learning-type`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  //languages
  getLanguages() {
    const url = `api/${this.apiVersion}/cct-language`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  //prefered instructor
  getpreferedInstructor() {
    const url = `api/${this.apiVersion}/cct-prefered-instructor`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  //delivery method
  getDeliveryMethod() {
    const url = `api/${this.apiVersion}/cct-delivery-method`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  //get expiry
  getExpiryType() {
    const url = `api/${this.apiVersion}/cct-expiry-type`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  //regional cordinator
  getregionalCordinator() {
    const url = `/api/${this.apiVersion}/cct-regional-cordinator`;
    const urllive = `${this.basePath}api/${this.apiVersion}/cct-regional-cordinator`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  Errorhandling(err: HttpErrorResponse) {
    if (err.error instanceof ErrorEvent) {
      console.error(err.error.message);
    } else {
      console.error(`Backend returned code ${err.status}`);
    }
    return throwError('Please try again later.');
  }
}
