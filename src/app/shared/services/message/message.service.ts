import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common/common.service';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  public basePath = environment.baseUrl;
  public apiVersion = environment.apiVersion;
  public headers = new Headers({});
  constructor(private http: HttpService, private commmonService: CommonService) {
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  createMessage(data:any){
    const url = `api/${this.apiVersion}/message/create`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling)); 
  }

  getMessage(){
    const url = `/api/${this.apiVersion}/message`;
    return this.http
    .get(url, this.http.headers)
    .pipe(catchError(this.commmonService.Errorhandling));
  }

  updateMessage(data:any,id:number){
    const url = `api/${this.apiVersion}/message/${id}/update`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling)); 
  }

  getMessageDetails(id:number){
    const url = `/api/${this.apiVersion}/message/${id}/detail`;
    return this.http
    .get(url, this.http.headers)
    .pipe(catchError(this.commmonService.Errorhandling));
  }

  messageDelete(data: any) {
    const url = `api/${this.apiVersion}/message/delete`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

}
