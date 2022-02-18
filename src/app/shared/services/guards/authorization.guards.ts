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
export class AuthorizationServiceGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const loginDetails: any = this.authService.getLoginDetails();
    const role: any = this.authService.getRolefromlocal();

    if (
      loginDetails &&
      loginDetails.access_token &&
      (role.id == 3 || role.id == 4 || role.id == 5)
    ) {
      return true;
    } else {
      this.router.navigate(['/dashboard/cources']);
      return false;
    }
  }
}
