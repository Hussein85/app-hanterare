import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from 'ng2-translate';
import { ThemeService } from '../../services/theme.service';
import { TenantsService } from '../../services/tenants.service';

@Component({
    template: require('./tenantManager.component.html'),
    styles: [require('./tenantManager.component.css')]
})
export class TenantManagerComponent implements OnInit {

    tenants = [
        {
            id: "1",
            name: "name1",
            version: "1.0",
            healthState: "OK",
            status: "running"
        },
        {
            id: "2",
            name: "name2",
            version: "1.0",
            healthState: "OK",
            status: "running"
        },
        {
            id: "3",
            name: "name3",
            version: "1.1",
            healthState: "OK",
            status: "running"
        }
                ];

    constructor(
        private auth: AuthService,
        private translateService: TranslateService,
        private themeService: ThemeService,
        private tenantsService: TenantsService
    ) { }

    ngOnInit(): void {
        // Read user preferences from localstorage 
        var specificUserPreference = JSON.parse(localStorage.getItem('userPref'));
        this.themeService.changeTheme(specificUserPreference.theme);
        this.translateService.use(specificUserPreference.language);
        //this.getTenants();
    }


    getTenants(): void {
        this.tenantsService.getTenants().subscribe(
            tenants => this.tenants = tenants,
            error => {
                console.log(error);         
            });
    }



}


 