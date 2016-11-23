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
                //alert(err.message);
                this.wrongEmailOrPassword = true;
            }
        });

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
        location.reload();
    };



    public isAdmin() {
        let profile = JSON.parse(localStorage.getItem('profile'));

        return profile && profile.app_metadata
            && profile.app_metadata.roles
            && profile.app_metadata.roles.indexOf('admin') > -1;
    };

}







//import { Injectable } from '@angular/core';
//import { tokenNotExpired } from 'angular2-jwt';
//import { Router } from '@angular/router';
//import { myConfig } from '../auth.config';

//// Avoid name not found warnings
//declare var Auth0Lock: any;

//// Options for autolock widget
//var options = {
//    theme: {
//        logo: '',
//        primaryColor: 'gray'
//    },
//    languageDictionary: {
//        emailInputPlaceholder: "something@youremail.com",
//        title: "Login"
//    },
//};

//@Injectable()
//export class AuthService {

//    // Configure Auth0
//    lock = new Auth0Lock(myConfig.clientID, myConfig.domain, options);

    
//    constructor(private router: Router) {

//        // Add callback for lock `authenticated` event
//        this.lock.on("authenticated", (authResult: any) => {

//            // Fetch profile information
//            this.lock.getProfile(authResult.idToken, function (error: any, profile: any) {
//                if (error) {
//                    throw new Error(error);
//                }
//                localStorage.setItem('id_token', authResult.idToken);
//                localStorage.setItem('profile', JSON.stringify(profile));
                   
//            });
//        });
//    }

//    public login() {
//        // Call the show method to display the widget.
//        //this.lock.show();   
//    };

//    public authenticated() {
//        // Check if there's an unexpired JWT
//        // This searches for an item in localStorage with key == 'id_token'
//        return tokenNotExpired();
//    };

//    public logout() {
//        // Remove token from localStorage
//        localStorage.removeItem('id_token');
//        localStorage.removeItem('profile');
//        this.router.navigate(['']);
//    };

//    public isAdmin() {
//        let profile = JSON.parse(localStorage.getItem('profile'));
        
//        return profile && profile.app_metadata
//            && profile.app_metadata.roles
//            && profile.app_metadata.roles.indexOf('admin') > -1;
//    }
//}

