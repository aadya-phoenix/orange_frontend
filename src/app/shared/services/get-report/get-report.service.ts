import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common/common.service';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class GetReportService {

  public basePath = environment.baseUrl;
  public apiVersion = environment.apiVersion;
  public headers = new Headers({});
  constructor(private http: HttpService, private commmonService: CommonService) {
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  createReport(data:any){
    const url = `api/${this.apiVersion}/get-report/create`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling)); 
  }

  updateReport(data:any){
    const url = `api/${this.apiVersion}/get-report/update`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling)); 
  }

  getReportList() {
    const url = `/api/${this.apiVersion}/get-report`;
    return this.http
    .get(url, this.http.headers)
    .pipe(catchError(this.commmonService.Errorhandling));
  }

  getReportDetails(id:number){
    const url = `/api/${this.apiVersion}/get-report/${id}/detail`;
    return this.http
    .get(url, this.http.headers)
    .pipe(catchError(this.commmonService.Errorhandling));
  }

  getReportHistory(data:any){
    const url = `/api/${this.apiVersion}/get-report/${data}/history`;
    return this.http
    .get(url, this.http.headers)
    .pipe(catchError(this.commmonService.Errorhandling));
  }

  reportDelete(data:any){
    const url = `api/${this.apiVersion}/get-report/delete`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  reportCopy(data:any){
    const url = `api/${this.apiVersion}/get-report/copy`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  changeReportStatus(data:any){
    const url = `api/${this.apiVersion}/get-report/status`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  transferReport(data:any){
    const url = `api/${this.apiVersion}/get-report/transfer`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  getCertificationStatus(){
    const url = `/api/${this.apiVersion}/cct-certification-status`;
    return this.http
    .get(url, this.http.headers)
    .pipe(catchError(this.commmonService.Errorhandling));
  }

  getRegions(){
    const url = `/api/${this.apiVersion}/cct-regions`;
    return this.http
    .get(url, this.http.headers)
    .pipe(catchError(this.commmonService.Errorhandling));
  }

  getTranscriptStatus(){
    const url = `/api/${this.apiVersion}/cct-transcript-status`;
    return this.http
    .get(url, this.http.headers)
    .pipe(catchError(this.commmonService.Errorhandling));
  }

  getReportType(){
    const url = `/api/${this.apiVersion}/cct-report-type`;
    return this.http
    .get(url, this.http.headers)
    .pipe(catchError(this.commmonService.Errorhandling));
  }

  getReportTransfer(data:any){
    const url = `/api/${this.apiVersion}/get-report/transfer`;
    return this.http
    .post(url, data)
    .pipe(catchError(this.commmonService.Errorhandling));
  }

  getReportFilter(data:any){
    const url = `/api/${this.apiVersion}/get-report/filter`;
    return this.http
    .post(url, data)
    .pipe(catchError(this.commmonService.Errorhandling));
  }
  
  
}
