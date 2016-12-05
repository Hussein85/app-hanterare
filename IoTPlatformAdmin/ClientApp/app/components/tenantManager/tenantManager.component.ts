import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from 'ng2-translate';
import { ThemeService } from '../../services/theme.service';


@Component({
    template: require('./tenantManager.component.html')
})
export class TenantManagerComponent implements OnInit {

    constructor(
        private auth: AuthService,
        private translateService: TranslateService,
        private themeService: ThemeService
    ) { }

    ngOnInit(): void {
        // Read user preferences from localstorage 
        var specificUserPreference = JSON.parse(localStorage.getItem('userPref'));
        this.themeService.changeTheme(specificUserPreference.theme);
        this.translateService.use(specificUserPreference.language);
    }


}
