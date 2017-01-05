import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router';

import { LoginService } from './services/login.service';



@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private loginService: LoginService,
        private router: Router)
    { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.loginService.authenticated()) {
            console.log('AUTH GUARD PASSED');
            return true;
        } else {
            console.log('BLOCKED BY AUTH GUARD');
            this.router.navigate(['/login']);
            return false;
        }
    }
}

