import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/auth/authentication.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const loginDetails: any = this.authService.getLoginDetails();
    let token = '';
    let tokenType = '';
    if (loginDetails && loginDetails.access_token) {
      token = loginDetails.access_token;
      tokenType = loginDetails.token_type;
    }
    let setHeader = {};
    if (
      !request.url.includes('/oauth/token') &&
      !request.url.includes('/register')
    ) {
      setHeader = {
        Authorization: `${tokenType} ${token}`,
      };
    }
    const modified = request.clone({
      headers: new HttpHeaders(setHeader),
    });

    return next.handle(modified).pipe(
      catchError((error) => {
        if (error) {
          if (error.status == 200) {
            if (error.error && error.error.text) {
            }
          } else {
            //this.authService.logOut();
           
          }
        }
        // if (error.error && error.error.text) {
        //     this.toastr.error(error.error.text);
        //     this.authService.loginSub.next(error.error.text);
        // }
        else {
          console.log(error);
        }
        return of(error);
      })
    );
  }
}
