import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../auth/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationServiceGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const loginDetails: any = this.authService.getLoginDetails();

    if (
      loginDetails &&
      loginDetails.access_token 
    ) {
      return true;
    } else {
      this.router.navigate(['/login'],{queryParams:{'redirectURL':state.url}});
      return false;
    }
  }
}
