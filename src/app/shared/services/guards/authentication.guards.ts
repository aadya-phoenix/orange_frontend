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

  canActivate(): boolean {
    const loginDetails: any = this.authService.getLoginDetails();
    const role: any = this.authService.getRolefromlocal();

    if (
      loginDetails &&
      loginDetails.access_token 
    ) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
