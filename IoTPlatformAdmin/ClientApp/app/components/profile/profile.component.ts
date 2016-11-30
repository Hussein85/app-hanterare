import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AuthService } from '../../services/auth.service';
import { AuthHttp } from 'angular2-jwt';
import { Router } from '@angular/router';

import { UserPreferencesService } from '../../services/userPreferences.service';
import { UserPreferences } from '../../models/userPreferences';


@Component({
    selector: 'profile',
    template: require('./profile.component.html')
})
export class ProfileComponent implements OnInit {
    profile: any;
    userPreferences: any;
    specificUserPreferences: any;

    languages: string[] = ["eng", "fra"];
    themes: string[] = ["light", "dark"];
   
    constructor(private auth: AuthService, private authHttp: AuthHttp, private router: Router, private userPreferencesService: UserPreferencesService) {
          
    }


    ngOnInit(): void {
        this.getPreferences();
        this.getSpecificUserPreferences();
        this.profile = JSON.parse(localStorage.getItem('profile'));
    }

    getPreferences(): void {
        this.userPreferencesService.getAllUserPreferences()
            .subscribe(
            userPreferences => this.userPreferences = userPreferences,
            error => {
                console.log(error);
            });
    }

    getSpecificUserPreferences(): void {
        this.userPreferencesService.getSpecificUserPreference("1")
            .subscribe(
            specificUserPreferences => this.specificUserPreferences = specificUserPreferences,
            error => {
                console.log(error);
            });
    }

    saveProfile() {
        var headers: any = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        var data: any = JSON.stringify({
            user_metadata: {
                firstname: this.profile.user_metadata.firstname,
                lastname: this.profile.user_metadata.lastname,
            },
            //email : this.profile.email
        });
        
        // post updated data to auth0. Obs! authHttp adds token to header automatically
        this.authHttp
            .patch('https://' + 'iotplatformadmin.eu.auth0.com' + '/api/v2/users/' + this.profile.user_id, data, { headers: headers })
            .map(response => response.json())
            .subscribe(
            response => {
                this.profile = response;
                localStorage.setItem('profile', JSON.stringify(response));
                this.router.navigate(['/profile']);
                alert("Changes saved");
            },
            error => alert(error.json().message)
            );

    }

    savePreferences() {
        this.userPreferencesService.updateSpecificUserPreference(this.specificUserPreferences)
            .subscribe(
            specificUserPreferences => {
                this.specificUserPreferences = specificUserPreferences;
                alert("Preferences saved");
            },
            error => {
                console.log(error);
            });         
    }


    
}

