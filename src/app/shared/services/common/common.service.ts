import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  constructor(private http: HttpService) {
    this.headers.append('Access-Control-Allow-Origin', '*');
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

}
