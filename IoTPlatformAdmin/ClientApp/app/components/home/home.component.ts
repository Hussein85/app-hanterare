import { Component, OnInit } from '@angular/core';
import { UserPreferences } from '../../models/userPreferences';
import { TranslateService } from 'ng2-translate';
import { ThemeService } from '../../services/theme.service';
import { UserPreferencesService } from '../../services/userPreferences.service';

import { TenantsService } from '../../services/tenants.service';  // Remove

@Component({
    selector: 'home',
    template: require('./home.component.html')
})
export class HomeComponent implements OnInit {

    //userPreferences: UserPreferences;
    userPreferences: any;

    // Remove
    tenants: any;
    tenant: any;
    tenantState: any;
    tenantConf: any;

    constructor(
        private translateService: TranslateService,
        private userPreferencesService: UserPreferencesService,
        private themeService: ThemeService,
        private tenantsService: TenantsService // Remove
    ) { }


    ngOnInit(): void {
        this.getUserPreferences(); 

        this.getTenants();  // Remove
        this.getTenant("5c6dce5d-52ed-451f-8d21-817657b6bfb2");  // Remove
        this.getTenantState("5c6dce5d-52ed-451f-8d21-817657b6bfb2");  // Remove
        this.getTenantConf("5c6dce5d-52ed-451f-8d21-817657b6bfb2"); // Remove
    }


    // Remove
    getTenants() {
        this.tenantsService.testGetTenant().subscribe(
            data => {
                this.tenants = data;
            }
        )
    }

    // Remove
    getTenant(id) {
        this.tenantsService.testGetTenantById(id).subscribe(
            data => {
                this.tenant = data;
            }
        )
    }

    // Remove
    getTenantState(id) {
        this.tenantsService.testGetTenantState(id).subscribe(
            data => {
                this.tenantState = data;
            }
        )
    }

    // Remove
    getTenantConf(id) {
        this.tenantsService.testGetTenantConf(id).subscribe(
            data => {
                this.tenantConf = data;
            }
        )
    }


    //OBS!!! Uncomment code below when API works
    getUserPreferences(): void {
        // If no user preferences exists in local storage, then call API to get user preferences.
        if (localStorage.getItem('userPref') === null) {

            //Uncomment code when API works
            /*
            this.userPreferencesService.getUserPreferences().subscribe(
                userPreferences => {
                    this.userPreferences = userPreferences;
                    this.translateService.use(userPreferences.language);
                    this.themeService.changeTheme(userPreferences.theme);
                    localStorage.setItem('userPref', JSON.stringify(userPreferences));
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
            localStorage.setItem('userPref', JSON.stringify(userPreferences));


        } else {
            // Otherwise read user preferences from local storage 
            this.userPreferences = JSON.parse(localStorage.getItem('userPref'));
            this.themeService.changeTheme(this.userPreferences.theme);
            this.translateService.use(this.userPreferences.language);
        }

    }




    
}
