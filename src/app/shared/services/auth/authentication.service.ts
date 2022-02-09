import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http/http.service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public basePath = environment.baseUrl;
  constructor(private http:HttpService) { }

  register(data:any){
      const url = `${this.basePath}`;
      console.log(data);
      return this.http.post(url,data)
  }

  login(data:any){
    const url =`${this.basePath}`;
    console.log(data);
    return this.http.post(url,data)
  }

}
