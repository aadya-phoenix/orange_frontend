import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common/common.service';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class GoldToolService {

  public basePath = environment.baseUrl;
  public apiVersion = environment.apiVersion;
  public headers = new Headers({});
  constructor(private http: HttpService, private commmonService: CommonService) {
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  create(data: any) {
    const url = `/api/${this.apiVersion}/goldTool/create`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  update(data: any) {
    const url = `/api/${this.apiVersion}/goldTool/update`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  getGoldTool() {
    const url = `/api/${this.apiVersion}/goldTool`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getGoldToolReport(data: any) {
    const url = `/api/${this.apiVersion}/goldTool/filter`;
    return this.http
      .post(url, data)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getGoldToolPublisher() {
    const url = `/api/${this.apiVersion}/goldTool/publisher-list`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }


  getGoldToolDetails(id: number) {
    const url = `/api/${this.apiVersion}/goldTool/${id}/detail`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  goldToolHistory(data: any) {
    const url = `api/${this.apiVersion}/goldTool/${data}/history`;
    return this.http.get(url, this.http.headers).pipe(catchError(this.commmonService.Errorhandling))
  }

  goldToolDelete(data: any) {
    const url = `api/${this.apiVersion}/goldTool/delete`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  goldToolCopy(data: any) {
    const url = `api/${this.apiVersion}/goldTool/copy`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }


}
