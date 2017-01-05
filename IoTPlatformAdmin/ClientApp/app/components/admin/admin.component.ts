import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { ThemeService } from '../../services/theme.service';


@Component({
    template: require('./admin.component.html')
})
export class AdminComponent implements OnInit {

    constructor(
        private translateService: TranslateService,
        private themeService: ThemeService
    ) { }

    ngOnInit(): void {
        // Read user preferences from localstorage and apply them in the component.
        var userPreferences = JSON.parse(localStorage.getItem('userPref'));
        this.themeService.changeTheme(userPreferences.theme);
        this.translateService.use(userPreferences.language);
    }


}
