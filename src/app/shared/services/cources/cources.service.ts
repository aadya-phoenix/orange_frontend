import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class CourcesService {
  public basePath = environment.baseUrl;
  public apiVersion = environment.apiVersion;
  public clientId = environment.clientId;
  public clientSecret = environment.clientSecret;
  constructor(private http: HttpService) {}

  getCources() {
    const url = `/api/${this.apiVersion}/course`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  createCource(data: any) {
    const url = `/api/${this.apiVersion}/course/create`;
    return this.http.post(url, data).pipe(catchError(this.Errorhandling));
  }

  Errorhandling(err: HttpErrorResponse) {
    if (err.error instanceof ErrorEvent) {
      console.error(err.error.message);
    } else {
      console.error(`Backend returned code ${err.status}`);
    }
    return throwError('Please try again later.');
  }
}
