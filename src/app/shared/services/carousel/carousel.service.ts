import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common/common.service';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {

  basePath: any = environment.baseUrl;
  apiVersion: any = environment.apiVersion;
  public headers = new Headers({});
  constructor(private http: HttpService, private commmonService: CommonService) {
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  create(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/carousel/create';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  update(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/carousel/update';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  getCarousel() {
    const url = this.basePath + 'api/' + this.apiVersion + '/carousel';
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getCarouselReport(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/carousel/filter';
    return this.http
      .post(url, data)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getCarouselPublisher() {
    const url = this.basePath + 'api/' + this.apiVersion + '/carousel/publisher-list';
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }


  getCarouselDetails(id: number) {
    const url = this.basePath + 'api/' + this.apiVersion + '/carousel/'+id+'/detail';
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  carouselHistory(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/carousel/'+data+'/history';
    return this.http.get(url, this.http.headers).pipe(catchError(this.commmonService.Errorhandling))
  }

  carouselDelete(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/carousel/delete';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  carouselCopy(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/carousel/copy';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  carouselStatus(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/carousel/status';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  carouselTransfer(data: any) {
    const url = this.basePath + 'api/' + this.apiVersion + '/carousel/transfer';
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

}
