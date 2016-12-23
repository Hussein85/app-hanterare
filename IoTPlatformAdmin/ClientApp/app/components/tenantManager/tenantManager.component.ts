import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from 'ng2-translate';
import { ThemeService } from '../../services/theme.service';
import { TenantsService } from '../../services/tenants.service';

import { matchingPasswords } from '../../validators/matchingPasswords';
import { targetReplicaSetSizeValidator } from '../../validators/targetReplicaSetSizeValidator';

import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
    template: require('./tenantManager.component.html'),
    styles: [require('./tenantManager.component.css')]
})
export class TenantManagerComponent implements OnInit {
    addTenantForm: FormGroup;


    // TODO: get tenants from API
    tenants = [
        {
            id: "1",
            name: "name1",
            version: "1.0",
            healthState: "OK",
            status: "Running"
        },
        {
            id: "2",
            name: "name2",
            version: "1.0",
            healthState: "OK",
            status: "Running"
        },
        {
            id: "3",
            name: "name3",
            version: "1.1",
            healthState: "Error",
            status: "Stopped"
        },
        {
            id: "4",
            name: "name4",
            version: "1.1",
            healthState: "OK",
            status: "Running"
        },
        {
            id: "5",
            name: "name5",
            version: "1.1",
            healthState: "OK",
            status: "Running"
        }
    ];


    filterText = "";
    healthState = "";
    status = "";
    update = false;
    displayName = "";

    mqttBroker = {
        defaultListener: false,
        sslTlsListener: false,
        username: "",
        password: ""
    }

    services = [];

    parameters = [];

    serviceTypes = [
        "stateless",
        "stateful"
    ]

    tenant = {
        displayName: "",
        resources: [
            {
                type: "mqttBroker",
                configuration: {                 
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

    showJSON = false;        // Remove when finished debugging


    // Remove
    user = {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    }

    constructor(
        private auth: AuthService,
        private translateService: TranslateService,
        private themeService: ThemeService,
        private tenantsService: TenantsService,
        private fb: FormBuilder

    ) { }

    ngOnInit(): void {
        var specificUserPreference = JSON.parse(localStorage.getItem('userPref'));
        this.themeService.changeTheme(specificUserPreference.theme);
        this.translateService.use(specificUserPreference.language);
        //this.getTenants();    // TODO: uncomment to get Tenants from API

        this.addTenantForm = this.fb.group({
            displayName: ['', [Validators.required]],  
            username: ['', Validators.required],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required], 
            parameters: this.fb.array([]),
            services: this.fb.array([])
                   
        }, { validator: matchingPasswords('password', 'confirmPassword') });

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

   
    getTenants(): void {
        this.tenantsService.getTenants().subscribe(
            tenants => this.tenants = tenants,
            error => {
                console.log(error);
            });
    }

    addParameter() {
        //let parameter = {
        //    name: "",
        //    value: "",
        //    secret: false     
        //}
        //this.parameters.push(parameter);  
        const control = <FormArray>this.addTenantForm.controls['parameters'];
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


        const control = <FormArray>this.addTenantForm.controls['services'];
        control.push(this.initService());
    }

    removeParameter(i: number) { 
        const control = <FormArray>this.addTenantForm.controls['parameters'];
        control.removeAt(i);
    }

    removeService(i: number) {
        const control = <FormArray>this.addTenantForm.controls['services'];
        control.removeAt(i);
    }

    // TODO: call API to save tenant
    save(formValid) {
        
        this.tenant.displayName = this.addTenantForm.value.displayName;

        for (let idx in this.tenant.resources) {

            // Add parameters and services configuration to tenant
            if (this.tenant.resources[idx].type === "tenantApp") {
                this.tenant.resources[idx].configuration['parameters'] = [];
                if(this.addTenantForm.value.parameters.length > 0)
                    this.tenant.resources[idx].configuration['parameters'].push(this.addTenantForm.value.parameters)

                this.tenant.resources[idx].configuration['services'] = [];
                if (this.addTenantForm.value.services.length > 0)
                    this.tenant.resources[idx].configuration['services'].push(this.cleanFields(this.addTenantForm.value.services))
                
            }

            // Add mqtt configuration to tenant
            let mqttBroker = {           
                username: this.addTenantForm.value.username,
                password: this.addTenantForm.value.password
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
    

    healthStatus(r) {
        this.healthState = r.value;
    }

    statusRunning(r) {
        this.status = r.value;
    }

    changeType() {
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

    onSubmit() {
        alert("form submitted");
    }
}


