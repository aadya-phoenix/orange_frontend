import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common/common.service';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class CourseSessionService {

  public basePath = environment.baseUrl;
  public apiVersion = environment.apiVersion;
  public headers = new Headers({});
  constructor(private http: HttpService, private commmonService: CommonService) {
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  createSession(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/course-session/create`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  getSessions(){
   const url = `${this.basePath}api/${this.apiVersion}/course-session`;
   return this.http
     .get(url, this.http.headers)
     .pipe(catchError(this.commmonService.Errorhandling));
  }

  getSessionDetails(id:number) {
   const url = `${this.basePath}api/${this.apiVersion}/course-session/${id}/detail`;
   return this.http
     .get(url, this.http.headers)
     .pipe(catchError(this.commmonService.Errorhandling));
  }

  deleteSession(session_id:any){
    const url = `${this.basePath}api/${this.apiVersion}/course-session/delete`;
    return this.http.post(url, session_id).pipe(catchError(this.commmonService.Errorhandling));
  }

  getSessionHistory(data:any){
    const url = `${this.basePath}api/${this.apiVersion}/course-session/${data}/history`;
   return this.http
     .get(url, this.http.headers)
     .pipe(catchError(this.commmonService.Errorhandling));
  }

  changeStatusSession(data:any){
    const url = `${this.basePath}api/${this.apiVersion}/course-session/status`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }
  updateSession(data:any){
    const url = `${this.basePath}api/${this.apiVersion}/course-session/update`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  copySession(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/course-session/copy`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  courseSessionTransfer(data:any){
    const url = `${this.basePath}api/${this.apiVersion}/course-session/transfer`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }
  //sessionPublsiher
  setSessionPublisherStatus(status:any) {
    const url = `${this.basePath}api/${this.apiVersion}/course-session/publisher-status`;
    return this.http.post(url, status).pipe(catchError(this.commmonService.Errorhandling));
  }

  getSessionPublisherStatus(){
    const url = `${this.basePath}api/${this.apiVersion}/course-session/publisher-list`;
   return this.http
     .get(url, this.http.headers)
     .pipe(catchError(this.commmonService.Errorhandling));
  }

  getsessionReport(data:any){
    const url = `${this.basePath}api/${this.apiVersion}/course-session/filter`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }



}
