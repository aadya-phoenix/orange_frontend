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
    const url = `/api/${this.apiVersion}/course-session/create`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  getSessions(){
   const url = `/api/${this.apiVersion}/course-session`;
   return this.http
     .get(url, this.http.headers)
     .pipe(catchError(this.commmonService.Errorhandling));
  }

  getSessionDetails(id:number) {
   const url = `/api/${this.apiVersion}/course-session/${id}/detail`;
   return this.http
     .get(url, this.http.headers)
     .pipe(catchError(this.commmonService.Errorhandling));
  }

  deleteSession(session_id:any){
    const url = `/api/${this.apiVersion}/course-session/delete`;
    return this.http.post(url, session_id).pipe(catchError(this.commmonService.Errorhandling));
  }

  getSessionHistory(data:any){
    const url = `/api/${this.apiVersion}/course-session/${data}/history`;
   return this.http
     .get(url, this.http.headers)
     .pipe(catchError(this.commmonService.Errorhandling));
  }
}
