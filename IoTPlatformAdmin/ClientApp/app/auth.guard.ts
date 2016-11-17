import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthGuardUser implements CanActivate {
    constructor(private auth: AuthService, private router: Router) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.auth.authenticated()) {
            console.log('AUTH GUARD USER  PASSED');
            return true;
        } else {
            console.log('BLOCKED BY AUTH GUARD USER ');
            this.router.navigate(['/login']);
            return false;
        }
    }
}

@Injectable()
export class AuthGuardAdmin implements CanActivate {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.auth.authenticated() && this.auth.isAdmin()) {
            console.log('AUTH GUARD ADMIN PASSED');
            return true;
        } else {
            console.log('BLOCKED BY AUTH GUARD ADMIN');
            this.router.navigate(['/login']);
            return false;
        }
    }
}