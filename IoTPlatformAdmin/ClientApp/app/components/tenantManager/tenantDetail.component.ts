import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from 'ng2-translate';
import { ThemeService } from '../../services/theme.service';
import { TenantsService } from '../../services/tenants.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
    template: require('./tenantDetail.component.html'),
    styles: [require('./tenantDetail.component.css')]
})
export class TenantDetailComponent implements OnInit {

    tenant: any;

    constructor(
        private auth: AuthService,
        private translateService: TranslateService,
        private themeService: ThemeService,
        private tenantsService: TenantsService,
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    ngOnInit(): void {
        // Read user preferences from localstorage 
        var specificUserPreference = JSON.parse(localStorage.getItem('userPref'));
        this.themeService.changeTheme(specificUserPreference.theme);
        this.translateService.use(specificUserPreference.language);

        this.route.params.subscribe(params => {
            let id = params['id'];
            //this.getTenant(id);     
        });
    }

    getTenant(id) {
        this.tenantsService.getTenantById(id).subscribe(
            tenant => this.tenant = tenant);
    }

    onBack(): void {     
        this.router.navigate(['/tenantManager']);
    }


  



}


