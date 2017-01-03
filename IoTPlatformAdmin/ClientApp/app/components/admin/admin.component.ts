import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from 'ng2-translate';
import { ThemeService } from '../../services/theme.service';


@Component({
    template: require('./admin.component.html')
})
export class AdminComponent implements OnInit {

    constructor(
        private auth: AuthService,
        private translateService: TranslateService,
        private themeService: ThemeService
    ) { }

    ngOnInit(): void {
        // Read user preferences from localstorage and apply them in the component.
        var specificUserPreference = JSON.parse(localStorage.getItem('userPref'));
        this.themeService.changeTheme(specificUserPreference.theme);
        this.translateService.use(specificUserPreference.language);
    }


}
