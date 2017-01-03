import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';
import { myConfig } from '../auth.config';

// Avoid name not found warnings
declare var Auth0: any;

@Injectable()
export class AuthService {

    wrongEmailOrPassword = false;

    // Configure Auth0
    auth0 = new Auth0({
        domain: myConfig.domain,
        clientID: myConfig.clientID,
        responseType: 'token',
        callbackURL: myConfig.callbackURL,
    });

    constructor(private router: Router) {
        var result = this.auth0.parseHash(window.location.hash);

        if (result && result.idToken) {
            localStorage.setItem('id_token', result.idToken);

            // fetch user profile
            this.auth0.getProfile(result.idToken, function (err, profile) {
                localStorage.setItem('profile', JSON.stringify(profile));
            });

        } else if (result && result.error) {
            alert('error: ' + result.error);

        }
    };


    public login(username, password) {

        this.auth0.login({
            connection: 'Username-Password-Authentication',
            responseType: 'token',
            email: username,
            password: password,
        }, (err) => {
            if (err) {

                if (username || password)
                    this.wrongEmailOrPassword = true;
                else
                    this.wrongEmailOrPassword = false;
            }
        });

    };


    public authenticated() {
        // Check if there's an unexpired JWT
        // This searches for an item in localStorage with key == 'id_token'
        return tokenNotExpired();
    };


    public logout() {
        localStorage.removeItem('id_token');
        localStorage.removeItem('profile');
        localStorage.removeItem('userPref');
        location.reload();
    };



    public isAdmin() {
        let profile = JSON.parse(localStorage.getItem('profile'));

        return tokenNotExpired() && profile && profile.app_metadata
            && profile.app_metadata.roles
            && profile.app_metadata.roles.indexOf('admin') > -1;
    };

}

