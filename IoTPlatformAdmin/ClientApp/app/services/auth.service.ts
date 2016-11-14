import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';


// Avoid name not found warnings
declare var Auth0Lock: any;


@Injectable()
export class AuthService {
    // Configure Auth0 - enter client ID and domain name
    lock = new Auth0Lock('v3rhkWFDzsIYEIDsmYQMUh5wI0TdOMrz', 'iotplatformadmin.eu.auth0.com', {});

    constructor() {
        // Add callback for lock `authenticated` event
        this.lock.on("authenticated", (authResult: any) => {
            this.lock.getProfile(authResult.idToken, function (error: any, profile: any) {
                if (error) {
                    throw new Error(error);
                }
                localStorage.setItem('id_token', authResult.idToken);
                localStorage.setItem('profile', JSON.stringify(profile));
                console.log(authResult.idToken);
            });
        });
    }

    public login() {
        // Call the show method to display the widget.
        this.lock.show();
    };

    public authenticated() {
        // Check if there's an unexpired JWT
        // This searches for an item in localStorage with key == 'id_token'
        return tokenNotExpired();
    };

    public logout() {
        // Remove token from localStorage
        localStorage.removeItem('id_token');
        localStorage.removeItem('profile');
    };
}