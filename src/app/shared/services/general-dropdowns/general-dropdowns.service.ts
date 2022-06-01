import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonService } from '../common/common.service';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralDropdownsService {
  public basePath = environment.baseUrl;
  public apiVersion = environment.apiVersion;
  public headers = new Headers({});

  constructor(private http: HttpService, private commmonService: CommonService) {
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  getBpStatus() {
    const url = `/api/${this.apiVersion}/cct-learning-tracker-bp-status`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getCountries() {
    const url = `/api/${this.apiVersion}/cct-learning-tracker-countries
    `;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getDomain() {
    const url = `/api/${this.apiVersion}/cct-learning-tracker-fr-domain`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getLocations() {
    const url = `/api/${this.apiVersion}/cct-learning-tracker-locations`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getPriority() {
    const url = `/api/${this.apiVersion}/cct-learning-tracker-priority`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getRegions() {
    const url = `/api/${this.apiVersion}/cct-learning-tracker-regions`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getDnaType(){
    const url = `/api/${this.apiVersion}/cct-dna-type`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }

  getTrainingData(){
    const url = `/api/${this.apiVersion}/cct-training-data`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.commmonService.Errorhandling));
  }
}
