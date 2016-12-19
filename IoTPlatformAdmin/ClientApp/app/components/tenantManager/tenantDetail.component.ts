import { Component, OnInit, ViewContainerRef, ViewEncapsulation  } from '@angular/core';
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

    
    version = "v1.1";
    // TODO: Get update versions from API
    versions = ["v0.9", "v1.1", "v1.2", "v1.3", "v1.4"];

    // TODO: get parameters from API
    parameters = [
        {
            name: "param1",
            value: "value1",
            secret: true
        },
        {
            name: "param2",
            value: "value2",
            secret: false
        },
        {
            name: "param3",
            value: "value3",
            secret: true
        }
    ]

    // TODO: get services from API
    services = [
        {
            type: "stateless",
            typename: "MockServiceAType",
            instanceCount: 1,
            name: "service-a"
        },
        {
            type: "stateful",
            typename: "MockServiceBType",
            minReplicaSetSize: 1,
            targetReplicaSetSize: 1,
            name: "service-b"
        },
        {
            type: "stateless",
            typename: "MockServiceCType",
            instanceCount: 3,
            name: "service-c"
        }
    ]

    tenant = {
        displayName: "",
        resources: [
            {
                type: "tenantApp",
                configuration: {
                    "version": "",
                    parameters: [],
                    services: []
                }
            }
        ]
    }


    serviceTypes = [
        "stateless",
        "stateful"
    ]

    displayName = "";

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
            //this.getTenant(id);       // TODO: get tenant from aPI     
        });

        this.version = "v1.2";
    }

    getTenant(id) {
        this.tenantsService.getTenantById(id).subscribe(
            tenant => this.tenant = tenant);
    }

    onBack(): void {     
        this.router.navigate(['/tenantManager']);
    }


    delete() {
  
    }

    removeParameter(i: number) {
        this.parameters.splice(i, 1);
    }

    removeService(i: number) {
        this.services.splice(i, 1);
    }

    addParameter() {
        let parameter = {
            name: "",
            value: "",
            secret: false
        }
        this.parameters.push(parameter);
    }

    addService() {
       let service = {
            type: "stateless",
            typename: "",
            instanceCount: 1,
            minReplicaSetSize: 1,
            targetReplicaSetSize: 1,
            name: ""
        }
        this.services.push(service);
    }


    changeType() {
    }

    // TODO: call API to save tenant
    save() {
       
        this.tenant.displayName = this.displayName;

        // Add parameters and services to tenant
        for (let idx in this.tenant.resources) {
            if (this.tenant.resources[idx].type === 'tenantApp') {
                this.tenant.resources[idx].configuration.parameters = [];
                this.tenant.resources[idx].configuration.parameters.push(this.parameters)
                this.tenant.resources[idx].configuration.services = [];
                this.tenant.resources[idx].configuration.services.push(this.cleanFields(this.services))
            }
        }

    }

    cleanFields(services) {
        for (let idx in services) {
            if (services[idx].type === 'stateless') {
                delete services[idx]["minReplicaSetSize"];
                delete services[idx]["targetReplicaSetSize"];
            } else {
                delete services[idx]["instanceCount"];
            }
        }

        return services;
    }


}


