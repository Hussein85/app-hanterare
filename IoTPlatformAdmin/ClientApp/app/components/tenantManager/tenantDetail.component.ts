import { Component, OnInit, ViewContainerRef, ViewEncapsulation  } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from 'ng2-translate';
import { ThemeService } from '../../services/theme.service';
import { TenantsService } from '../../services/tenants.service';
import { ActivatedRoute, Router } from '@angular/router';


import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';


@Component({
    template: require('./tenantDetail.component.html'),
    styles: [require('./tenantDetail.component.css')]
})
export class TenantDetailComponent implements OnInit {
    myForm: FormGroup;
    
    version = "v1.1";
    // TODO: Get update versions from API
    versions = ["v0.9", "v1.1", "v1.2", "v1.3", "v1.4"];

    // TODO: get parameters from tenant
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

    // TODO: get services from tenant
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

    // TODO: get mqttBroker from tenant
    mqttBroker = {
        defaultListener: true,
        sslTlsListener: true,
        username: "testuser",
        password: "secretpassword"
    }

    // TODO: get tenant from API
    tenant = {
        displayName: "name1",
        resources: [
            {
                type: "mqttBroker",
                configuration: {
                    defaultListener: false,
                    sslTlsListener: false,
                    username: "",
                    password: ""
                }
            },
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

    showJSON = false;

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
        private fb: FormBuilder             
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

        this.version = "v1.2";

        this.myForm = this.fb.group({
            displayName: ['', [Validators.required]],
            parameters: this.fb.array([]),
            services: this.fb.array([])
        });
    }

    // TODO: get tenant from API
    getTenant(id) {
        //this.tenantsService.getTenantById(id).subscribe(
        //    tenant => this.tenant = tenant);

    }

    onBack(): void {     
        this.router.navigate(['/tenantManager']);
    }

    initParameter() {
        return this.fb.group({
            name: ['', Validators.required],
            value: ['', Validators.required],
            secret: [false]
        });
    }

    initService() {
        return this.fb.group({
            type: ['stateless'],
            typename: ['', Validators.required],
            instanceCount: [1, Validators.pattern('[1-9][0-9]{0,4}')],
            minReplicaSetSize: [1, Validators.pattern('[1-9][0-9]{0,4}')],
            targetReplicaSetSize: [2, Validators.pattern('[1-9][0-9]{0,4}')],
            name: ['', Validators.required]
        });
    }

    // TODO: call api to delete tenant
    delete() {
    }

    removeParameter(i: number) {
        //this.parameters.splice(i, 1);

        const control = <FormArray>this.myForm.controls['parameters'];
        control.removeAt(i);
    }

    removeService(i: number) {
        //this.services.splice(i, 1);

        const control = <FormArray>this.myForm.controls['services'];
        control.removeAt(i);
    }

    addParameter() {
        //let parameter = {
        //    name: "",
        //    value: "",
        //    secret: false     
        //}
        //this.parameters.push(parameter);  
        const control = <FormArray>this.myForm.controls['parameters'];
        control.push(this.initParameter());
    }

    addService() {
        //let service = {
        //    type: "stateless",
        //    typename: "",
        //    instanceCount: 1,
        //    minReplicaSetSize: 1,
        //    targetReplicaSetSize: 2,
        //    name: ""
        //}
        //this.services.push(service);   


        const control = <FormArray>this.myForm.controls['services'];
        control.push(this.initService());
    }


    changeType() {
    }

    // TODO: call API to save tenant
    save() {
       
        this.tenant.displayName = this.myForm.value.displayName;


        for (let idx in this.tenant.resources) {

            // Add parameters and services configuration
            if (this.tenant.resources[idx].type === "tenantApp") {
                this.tenant.resources[idx].configuration['parameters'] = [];
                this.tenant.resources[idx].configuration['parameters'].push(this.myForm.value.parameters)
                this.tenant.resources[idx].configuration['services'] = [];
                this.tenant.resources[idx].configuration['services'].push(this.cleanFields(this.myForm.value.services))
            }

            // Add mqtt configuration
            if (this.tenant.resources[idx].type == "mqttBroker") {
                this.tenant.resources[idx].configuration = this.mqttBroker;
            }
        }

        // TODO: uncomment to edit tenant
        //this.tenantsService.updateTenant(this.tenant);

        // For debugging. Remove later
        this.showJSON = true;

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


