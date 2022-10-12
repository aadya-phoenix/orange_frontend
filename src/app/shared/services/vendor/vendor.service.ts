import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common/common.service';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  public basePath = environment.baseUrl;
  public apiVersion = environment.apiVersion;
  public headers = new Headers({});
  constructor(private http: HttpService, private commmonService: CommonService) {
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  create(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/vendor/create`;
    //const urllive = `${this.basePath}api/${this.apiVersion}/vendor/create`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  update(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/vendor/update`;
    //const urllive = `${this.basePath}api/${this.apiVersion}/vendor/create`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  getCCTLearningRole(){
    const url = `${this.basePath}api/${this.apiVersion}/cct-learning-role`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getCCTDeliveryPerimeter(){
    const url = `${this.basePath}api/${this.apiVersion}/cct-delivery-perimeter`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getVendor() {
    const url = `${this.basePath}api/${this.apiVersion}/vendor`;
    //const urllive = `${this.basePath}api/${this.apiVersion}/vendor`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getVendorReport(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/vendor/filter`;
    return this.http
      .post(url, data)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getVendorRatingReport(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/vendor/filter-rating`;
    return this.http
      .post(url, data)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getCCTLearningLocation() {
    const url = `${this.basePath}api/${this.apiVersion}/cct-learning-location`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getCCTContactPoint() {
    const url = `${this.basePath}api/${this.apiVersion}/cct-contact-point`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getCCTNfpsEntity() {
    const url = `${this.basePath}api/${this.apiVersion}/cct-nfps-entity`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getCCTOfferTraining() {
    const url = `${this.basePath}api/${this.apiVersion}/cct-offer-training`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getCCTRating() {
    const url = `${this.basePath}api/${this.apiVersion}/cct-rating`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }


  getVendorDetails(id: number) {
    const url = `${this.basePath}api/${this.apiVersion}/vendor/${id}/detail`;
    //const urllive = `${this.basePath}api/${this.apiVersion}/vendor/${id}/detail`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  VendorHistory(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/vendor/${data}/history`;
    return this.http.get(url, this.http.headers).pipe(catchError(this.commmonService.Errorhandling))
  }

  VendorDelete(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/vendor/delete`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  VendorCopy(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/vendor/copy`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  VendorStatus(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/vendor/status`;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

  VendorRatingList(vendor_id: any) {
    const url = `${this.basePath}api/${this.apiVersion}/vendor/${vendor_id}/rating`;
    return this.http.get(url,this.http.headers).pipe(catchError(this.commmonService.Errorhandling));
  }

  VendorRatings(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/vendor/${data.vendor_id}/rating`;
    delete data.vendor_id;
    return this.http.post(url, data).pipe(catchError(this.commmonService.Errorhandling));
  }

}
