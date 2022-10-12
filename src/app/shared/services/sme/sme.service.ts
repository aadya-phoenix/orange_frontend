import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common/common.service';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class SMEService {

  public basePath = environment.baseUrl;
  public apiVersion = environment.apiVersion;
  public headers = new Headers({});
  constructor(private http: HttpService, private commmonService: CommonService) {
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  getCCTDomainExpert(){
    const url = `${this.basePath}api/${this.apiVersion}/cct-domain-expert`;
    return this.http.get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getContcatPersion(){
    const url = `${this.basePath}api/${this.apiVersion}/role-wise-users`;
    return this.http.get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getCCTDomainSkills(){
    const url = `${this.basePath}api/${this.apiVersion}/cct-domain-skills`;
    return this.http.get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getCCTDeliveryExperience(){
    const url = `${this.basePath}api/${this.apiVersion}/cct-delivery-experience`;
    return this.http.get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  create(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/sme-database/create`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  update(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/sme-database/update`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  getSMEDatabase() {
    const url = `${this.basePath}api/${this.apiVersion}/sme-database`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getSMEDatabaseReport(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/sme-database`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getSMEDatabasePublisher() {
    const url = `${this.basePath}api/${this.apiVersion}/sme-database/publisher-list`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }


  getSMEDatabaseDetails(id: number) {
    const url = `${this.basePath}api/${this.apiVersion}/sme-database/${id}/detail`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  SMEDatabaseHistory(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/sme-database/${data}/history`;
    return this.http.get(url, this.http.headers).pipe(catchError(this.commmonService.Errorhandling))
  }

  SMEDatabaseDelete(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/sme-database/delete`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  SMEDatabaseCopy(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/sme-database/copy`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  SMEDatabaseStatus(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/sme-database/status`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  SMEStatus(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/sme-database/sme-status`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }


  SMEDatabaseTransfer(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/sme-database/transfer`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  SMERatingList(sme_id: any) {
    const url = `${this.basePath}api/${this.apiVersion}/sme-database/${sme_id}/rating`;
    return this.http.get(url,this.http.headers).pipe(catchError(this.commmonService.Errorhandling));
  }

  SMEContactPerson() {
    const url = `${this.basePath}api/${this.apiVersion}/sme-database/contact-person`;
    return this.http.get(url,this.http.headers).pipe(catchError(this.commmonService.Errorhandling));
  }

  SMERatings(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/sme-database/${data.sme_id}/rating`;
    delete data.sme_id;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

}
