import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Router } from '@angular/router';

import { UserPreferences } from '../../models/userPreferences';
import { UserPreferencesService } from '../../services/userPreferences.service';
import { TranslateService } from 'ng2-translate';
import { ThemeService } from '../../services/theme.service';


@Component({
    selector: 'profile',
    template: require('./profile.component.html')
})
export class ProfileComponent implements OnInit {
    profile: any;
    userPreferences: UserPreferences;
    themes: string[];
    languages: string[];


    constructor( 
        private authHttp: AuthHttp,
        private router: Router,
        private userPreferencesService: UserPreferencesService,
        private translateService: TranslateService,
        private themeService: ThemeService
    ) { }


    ngOnInit(): void {
        this.profile = JSON.parse(localStorage.getItem('profile'));
        this.languages = this.translateService.getLangs();
        this.themes = this.themeService.getThemes();

        // Read user preferences from localstorage
        this.userPreferences = JSON.parse(localStorage.getItem('userPref'));
        this.themeService.changeTheme(this.userPreferences.theme);
        this.translateService.use(this.userPreferences.language);
    }

    //OBS!!! Uncomment code below when API works
    getUserPreferences(): void {
        // Uncomment when API works
        /*
        this.userPreferencesService.getUserPreferences().subscribe(
            userPreferences => {
                this.userPreferences = userPreferences;
                this.translateService.use(userPreferences.language);
                this.themeService.changeTheme(this.userPreferences.theme);
            },
            error => {
                console.log(error);
            });
        */

        // Remove these of lines code when API works
        let userPreferences = this.userPreferencesService.getUserPreferences();
        this.userPreferences = userPreferences;
        this.translateService.use(userPreferences.language);
        this.themeService.changeTheme(userPreferences.theme);
        
    }


    saveProfile(): void {
        var headers: any = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        var data: any = JSON.stringify({
            user_metadata: {
                firstname: this.profile.user_metadata.firstname,
                lastname: this.profile.user_metadata.lastname,
            }

        });

        // post updated data to auth0. Obs! authHttp adds token to header automatically
        this.authHttp
            .patch('https://' + 'iotplatformadmin.eu.auth0.com' + '/api/v2/users/' + this.profile.user_id, data, { headers: headers })
            .map(response => response.json()).subscribe(
            response => {
                this.profile = response;
                localStorage.setItem('profile', JSON.stringify(response));
                this.router.navigate(['/profile']);
                alert("Changes saved");
            },
            error => alert(error.json().message)
            );

    }

    //OBS!!! Uncomment code below when API works
    savePreferences(): void {
        // Uncomment when API is working
        /*
        this.userPreferencesService.updateUserPreferences(this.userPreferences).subscribe(
            userPreferences => {
                this.userPreferences = userPreferences;

                //Update user preferences in localstorage
                localStorage.setItem('userPref', JSON.stringify(userPreferences));

                // Use selected preferences
                this.translateService.use(userPreferences.language);
                this.themeService.changeTheme(userPreferences.theme);

                alert("Preferences saved!");

            },
            error => {
                console.log(error);
            });
        */
    }

    changeTheme(): void {
        this.themeService.changeTheme(this.userPreferences.theme);

        //Update user preferences in localstorage
        localStorage.setItem('userPref', JSON.stringify(this.userPreferences));
    }

    resetUserSettings() {
        this.userPreferences.language = this.translateService.getBrowserLang();
        this.userPreferences.theme = 'default';
        this.themeService.changeTheme(this.userPreferences.theme);
        this.translateService.use(this.userPreferences.language);
    }

}

