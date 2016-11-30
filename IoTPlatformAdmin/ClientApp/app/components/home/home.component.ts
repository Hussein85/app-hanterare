import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from 'ng2-translate';

import { UserPreferencesService } from '../../services/userPreferences.service';
import { UserPreferences } from '../../models/userPreferences';



@Component({
    selector: 'home',
    template: require('./home.component.html')
})
export class HomeComponent implements OnInit {

    public userPreferences: UserPreferences;
    public specificUserPreference: UserPreferences;

    

    constructor(private authService: AuthService, private translateService: TranslateService, private userPreferencesService: UserPreferencesService) { }


    ngOnInit(): void {
        this.getSpecificUserPreference("1");
        this.getAllPreferences();
        //this.getSpecificUserPreference();
    }

    getAllPreferences(): void {
        this.userPreferencesService.getAllUserPreferences()
            .subscribe(
            userPreferences => this.userPreferences = userPreferences,
            error => {
                console.log(error);
            });
    }

    getSpecificUserPreference(id): void {
        this.userPreferencesService.getSpecificUserPreference(id)
            .subscribe(
            specificUserPreference => this.specificUserPreference = specificUserPreference,
            error => {
                console.log(error);
            });
    }

    /*
    updateSpecificUserPreference(userPref): void {
        this.userPreferencesService.updateSpecificUserPreference(userPref)
            .subscribe(
            specificUserPreference => this.specificUserPreference = specificUserPreference,
            error => {
                console.log(error);
            });
    }
    */
    
    
    



}
