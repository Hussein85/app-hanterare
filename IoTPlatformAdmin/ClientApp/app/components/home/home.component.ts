import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';


import { UserPreferencesService } from '../../services/userPreferences.service';
import { UserPreferences } from '../../models/userPreferences';

// ng2-translate
import { TranslateService } from 'ng2-translate';

import { ThemeService } from '../../services/theme.service';


@Component({
    selector: 'home',
    template: require('./home.component.html')
})
export class HomeComponent implements OnInit {

    public userPreferences: UserPreferences;
    public specificUserPreference: UserPreferences;

   
    constructor(private authService: AuthService,
        private translateService: TranslateService,
        private userPreferencesService: UserPreferencesService,
        private themeService: ThemeService
    ){}


    ngOnInit(): void {
        this.getSpecificUserPreference("1");
        this.getAllPreferences();
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
            specificUserPreference => {
                this.specificUserPreference = specificUserPreference;
                this.translateService.use(specificUserPreference.language);
                this.themeService.changeTheme(this.specificUserPreference.theme);

            },
            error => {
                console.log(error);
            });
    }
 
    
}
