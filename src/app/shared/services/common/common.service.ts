import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http/http.service';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public apiVersion = environment.apiVersion;
  public headers = new Headers({});
  public laungaugesData = {french: {},english: {} };

  constructor(private http: HttpService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
    this.headers.append('Access-Control-Allow-Origin', '*');
  }

  public toastSuccessMsg(title: any, message: any, timeOut?: object) {
    this.toastr.success(message, title, timeOut);
  }

  public toastErrorMsg(title: any, message: any, timeOut?: object) {
    this.toastr.error(message, title, timeOut);
  }

  public toastWarningMsg(title: any, message: any, timeOut?: object) {
    this.toastr.warning(message, title, timeOut);
  }

  public errorHandling(error:any){
    if(error?.error){
    this.toastErrorMsg(error?.error?.error, error?.error?.message);
    }else{
      this.toastErrorMsg(error,'');
    }
  }

  public LastFewYearsList(){
    let yearsList = [];
    var date = new Date();
    date.getFullYear();
    for (let index = 0; index < 20; index++) {
        const year = date.getFullYear()-index
        yearsList.push({name:year, id : year});      
    }
    return yearsList;
  }

  //show loader
  public showLoading() {
    this.spinner.show();
  }

  //Hide loader
  public hideLoading() {
    setTimeout(() => {
      this.spinner.hide();
    }, 100);
  }

  Errorhandling(err: HttpErrorResponse) {
    if (err.error instanceof ErrorEvent) {
      console.error(err.error.message);
    } else {
      console.error(`Backend returned code ${err.status}`);
    }
    return throwError('Please try again later.');
  }

  byteArrayTobase64(arr: any[]) {
    let base64: string = "";
    for (var i = 0; i < arr.length; i++) {
      base64 += String.fromCharCode(arr[i]);
    }
    return window.btoa(base64);
  }

  FileConvertintoBytearray(file: any, cb: (arg0: any) => void) { // making File to Array Bytes    
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onloadend = function () {
      const arrayBuffer: any = fileReader.result;
      const bytes = new Uint8Array(arrayBuffer);
      const array_bytes = Array.from(bytes);
      file.bytes = array_bytes;
      cb(file);
    };
  }

  //languages
  getLanguages() {
    const url = `api/${this.apiVersion}/cct-language`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

    //language Translation
    getLanguageTranslation() {
      const url = `api/${this.apiVersion}/cct-language-translation`;
      return this.http
        .get(url, this.http.headers)
        .pipe(catchError(this.Errorhandling));
    }
  

  //ExpiryDateType
  getExpiryDateType() {
    const url = `api/${this.apiVersion}/cct-expiry-date-type`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  dashboardCount() {
    const url = `api/${this.apiVersion}/dashboard`;
    return this.http
      .get(url, this.http.headers)
      .pipe(catchError(this.Errorhandling));
  }

  exportAPI(data:any) {
    const url = `api/${this.apiVersion}/export`;
    return this.http
      .post(url, data)
      .pipe(catchError(this.Errorhandling));
  }

  showPaginationCount(pageStart:any, pageEnd:any, total:any, lableString:any){
    return lableString.replace('<number>', pageStart).replace('<number>', pageEnd).replace('<number>', total).replace('<nombre>', pageStart).replace('<nombre>', pageEnd).replace('<nombre>', total);
  }

}
