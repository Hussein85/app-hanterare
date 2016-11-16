/*

import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';
import { myConfig } from '../auth.config';

// Avoid name not found warnings
declare var Auth0: any;

@Injectable()
export class AuthService {
    // Configure Auth0
    auth0 = new Auth0({
        domain: myConfig.domain,
        clientID: myConfig.clientID,
        callbackOnLocationHash: true,
        callbackURL: myConfig.callbackURL,
    });

    constructor(private router: Router) {
        var result = this.auth0.parseHash(window.location.hash);

        if (result && result.idToken) {
            localStorage.setItem('id_token', result.idToken);
            this.router.navigate(['/home']);
        } else if (result && result.error) {
            alert('error: ' + result.error);
        }
    }

    public login(username, password) {
        this.auth0.login({
            connection: 'Username-Password-Authentication',
            responseType: 'token',
            email: username,
            password: password,
        }, function (err) {
            if (err) alert("something went wrong: " + err.message);
        });
    };

 
    public authenticated() {
        // Check if there's an unexpired JWT
        // It searches for an item in localStorage with key == 'id_token'
        return tokenNotExpired();
    };

    public logout() {
        // Remove token from localStorage
        localStorage.removeItem('id_token');
        localStorage.removeItem('profile');
    };
}

*/


import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';
import { myConfig } from '../auth.config';

// Avoid name not found warnings
declare var Auth0Lock: any;

var options = {
    theme: {
        logo: '',
        primaryColor: 'gray'
    },
    languageDictionary: {
        emailInputPlaceholder: "something@youremail.com",
        title: "Login"
    },
};

@Injectable()
export class AuthService {
    // Configure Auth0 
    lock = new Auth0Lock(myConfig.clientID, myConfig.domain, options);

    constructor() {
        // Add callback for lock `authenticated` event
        this.lock.on("authenticated", (authResult: any) => {
            this.lock.getProfile(authResult.idToken, function (error: any, profile: any) {
                if (error) {
                    throw new Error(error);
                }
                localStorage.setItem('id_token', authResult.idToken);
                localStorage.setItem('profile', JSON.stringify(profile));
                //console.log(authResult.idToken);
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

