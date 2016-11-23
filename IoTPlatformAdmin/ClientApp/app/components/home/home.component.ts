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

    constructor(private authService: AuthService, private translateService: TranslateService, private userPreferencesService: UserPreferencesService) { }


    ngOnInit(): void {
        this.getPreferences();
    }

    getPreferences(): void {
        this.userPreferencesService.getUserPreferences()
            .subscribe(
            userPreferences => this.userPreferences = userPreferences,
            error => {
                console.log(error);
                console.log("hello");
            });
    }


}
