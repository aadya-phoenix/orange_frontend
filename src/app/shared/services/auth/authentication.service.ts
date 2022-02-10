import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public basePath = environment.baseUrl;
  public apiVersion = environment.apiVersion;
  public clientId = environment.clientId;
  public clientSecret = environment.clientSecret;
  constructor(private http: HttpService) {}

  register(data: any) {
    const url = `${this.basePath}api/${this.apiVersion}/register`;
    console.log(data);
    return this.http.post(url, data);
  }

  login(data: any) {
    let clienSecret = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
    };
    let grantObj = { grant_type: 'password' };
    let totalObj = { ...grantObj, ...clienSecret, ...data };
    const url = `${this.basePath}oauth/token`;
    console.log(data);
    return this.http.post(url, totalObj);
  }

  getLoginDetails() {
    return { access_token: 'dfdfdff', token_type: 'Bearer' };
  }

  logOut() {}
}
