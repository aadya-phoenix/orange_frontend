import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common/common.service';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {

  public basePath = environment.baseUrl;
  public apiVersion = environment.apiVersion;
  public headers = new Headers({});
  constructor(private http: HttpService, private commmonService: CommonService) {
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  create(data: any) {
    const url = `/api/${this.apiVersion}/carousel/create`;
    //const urllive = `${this.basePath}api/${this.apiVersion}/carousel/create`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  getCarousel() {
    const url = `/api/${this.apiVersion}/carousel`;
    //const urllive = `${this.basePath}api/${this.apiVersion}/carousel`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getCarouselDetails(id:number) {
    const url = `/api/${this.apiVersion}/carousel/${id}/detail`;
    //const urllive = `${this.basePath}api/${this.apiVersion}/carousel/${id}/detail`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  carouselHistory(data:any){
    const url =`api/${this.apiVersion}/carousel/${data}/history`;
    return this.http.get(url,this.http.headers).pipe(catchError(this.commmonService.Errorhandling))
  }
}