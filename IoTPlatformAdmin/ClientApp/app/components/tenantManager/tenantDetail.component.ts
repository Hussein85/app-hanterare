import { Component, OnInit, ViewContainerRef, ViewEncapsulation  } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from 'ng2-translate';
import { ThemeService } from '../../services/theme.service';
import { TenantsService } from '../../services/tenants.service';
import { ActivatedRoute, Router } from '@angular/router';

import { matchingPasswords } from '../../validators/matchingPasswords';
import { targetReplicaSetSizeValidator } from '../../validators/targetReplicaSetSizeValidator';

import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';



@Component({
    template: require('./tenantDetail.component.html'),
    styles: [require('./tenantDetail.component.css')]
})
export class TenantDetailComponent implements OnInit {
    myForm: FormGroup;
    tenant: any;

    version = "v1.1";
    // TODO: Get update versions from API
    versions = ["v0.9", "v1.1", "v1.2", "v1.3", "v1.4"];

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

        // Get tenant by id 
        this.route.params.subscribe(params => {
            let id = params['id'];
            this.getTenant(id);            
        });

        this.version = "v1.2";
   
    }

    // TODO: uncomment code below to get a tenant by id
    getTenant(id) {
        // Uncomment to get tenant from API
        /*this.tenantsService.getTenantById(id).subscribe(
            tenant => {
                this.tenant = tenant
                this.fillValuesInForm()
            });
        */

        // Fake tenant. Remove later when API works
        this.tenant = {
            displayName: "name1",
            resources: [
                {
                    type: "mqttBroker",
                    configuration: {
                        username: "testuser",
                        password: "secretpassword"
                    }
                },
                {
                    type: "tenantApp",
                    configuration: {
                        "version": "",
                        parameters: [
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
                        ],
                        services: [
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
                                targetReplicaSetSize: 2,
                                name: "service-b"
                            },
                            {
                                type: "stateless",
                                typename: "MockServiceCType",
                                instanceCount: 3,
                                name: "service-c"
                            }
                        ]
                    }
                }
            ]
        }
        // Remove later when API works
        this.fillValuesInForm();
      
    }

    fillValuesInForm() {
        this.myForm = this.fb.group({
            displayName: [this.tenant.displayName, [Validators.required]],
            username: [this.getMQTTUserName(), Validators.required],
            password: [this.getMQTTPassword(), Validators.required],
            confirmPassword: [this.getMQTTPassword(), Validators.required],
            parameters: this.fb.array([]),
            services: this.fb.array([])
        }, { validator: matchingPasswords('password', 'confirmPassword') });


        let parameters = this.getParameters();
        const controlParameters = <FormArray>this.myForm.controls['parameters'];
        for (let idx in parameters) {
            controlParameters.push(this.fb.group({          
                name: [parameters[idx].name, Validators.required],
                value: [parameters[idx].value, Validators.required],
                secret: [parameters[idx].secret]
            }));      
        }
   
        let services = this.getServices();
        const controlServices = <FormArray>this.myForm.controls['services'];
        for (let idx in services) {
            if (services[idx].type === 'stateless') {
                controlServices.push(this.fb.group({
                    type: [services[idx].type],
                    typename: [services[idx].typename, Validators.required],
                    instanceCount: [services[idx].instanceCount, Validators.pattern('[1-9][0-9]{0,4}')], 
                    minReplicaSetSize: [1, Validators.pattern('[1-9][0-9]{0,4}')],
                    targetReplicaSetSize: [2, Validators.pattern('[1-9][0-9]{0,4}')],                
                    name: [services[idx].name, Validators.required]
                }));
            } else {
                controlServices.push(this.fb.group({
                    type: [services[idx].type],
                    typename: [services[idx].typename, Validators.required],
                    instanceCount: [1, Validators.pattern('[1-9][0-9]{0,4}')],                   
                    minReplicaSetSize: [services[idx].minReplicaSetSize, Validators.pattern('[1-9][0-9]{0,4}')],
                    targetReplicaSetSize: [services[idx].targetReplicaSetSize, Validators.pattern('[1-9][0-9]{0,4}')],
                    name: [services[idx].name, Validators.required]
                }, { validator: targetReplicaSetSizeValidator('minReplicaSetSize', 'targetReplicaSetSize') }));

            }         
        }

    }

    getMQTTConfiguration() {
        for (let idx in this.tenant.resources) {
            if (this.tenant.resources[idx].type == "mqttBroker") {
                return this.tenant.resources[idx].configuration;
            }
        }
        return {};
    }

    getMQTTUserName() {       
        if (Object.keys(this.getMQTTConfiguration()).length !== 0) { 
            return this.getMQTTConfiguration().username;    
        }
        return "";     
    }

    getMQTTPassword() {
        if (Object.keys(this.getMQTTConfiguration()).length !== 0) {
            return this.getMQTTConfiguration().password;
        }
        return "";  
    }

    getParameters() {
        for (let idx in this.tenant.resources) {
            if (this.tenant.resources[idx].type === "tenantApp") {
                return this.tenant.resources[idx].configuration['parameters']                
            }
        }
        return [];
    }

    getServices() {
        for (let idx in this.tenant.resources) {
            if (this.tenant.resources[idx].type === "tenantApp") {
                return this.tenant.resources[idx].configuration['services']
            }
        }
        return [];
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
        }, { validator: targetReplicaSetSizeValidator('minReplicaSetSize', 'targetReplicaSetSize') });

    }

    // TODO: uncomment code below to delete a tenant
    delete() {
    }

    removeParameter(i: number) {
        const control = <FormArray>this.myForm.controls['parameters'];
        control.removeAt(i);
    }

    removeService(i: number) {      
        const control = <FormArray>this.myForm.controls['services'];
        control.removeAt(i);
    }

    addParameter() {     
        const control = <FormArray>this.myForm.controls['parameters'];
        control.push(this.initParameter());
    }

    addService() {
        const control = <FormArray>this.myForm.controls['services'];
        control.push(this.initService());
    }


    changeType() {
    }

    // TODO: uncomment code below to create a tenant
    save() {
       
        this.tenant.displayName = this.myForm.value.displayName;

        for (let idx in this.tenant.resources) {

            // Add parameters and services configuration
            if (this.tenant.resources[idx].type === "tenantApp") {
                this.tenant.resources[idx].configuration['parameters'] = [];
                if (this.myForm.value.parameters.length > 0)
                    this.tenant.resources[idx].configuration['parameters'].push(this.myForm.value.parameters)

                this.tenant.resources[idx].configuration['services'] = [];
                if (this.myForm.value.services.length > 0)
                    this.tenant.resources[idx].configuration['services'].push(this.cleanFields(this.myForm.value.services))

            }

            // Add mqtt configuration
            let mqttBroker = {
                username: this.myForm.value.username,
                password: this.myForm.value.password
            }

            if (this.tenant.resources[idx].type == "mqttBroker") {
                this.tenant.resources[idx].configuration = mqttBroker;
            }
        }

        // TODO: uncomment to call API to create a new tenant
        //this.tenantsService.createTenant(this.tenant);

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


