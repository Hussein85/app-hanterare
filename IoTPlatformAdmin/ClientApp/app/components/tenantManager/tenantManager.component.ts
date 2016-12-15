import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from 'ng2-translate';
import { ThemeService } from '../../services/theme.service';
import { TenantsService } from '../../services/tenants.service';

import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
    template: require('./tenantManager.component.html'),
    styles: [require('./tenantManager.component.css')]
})
export class TenantManagerComponent implements OnInit {

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

    public myForm: FormGroup;

    update = false;

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

    services = [];
    parameters = [];

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
        //this.getTenants();    // TODO: get Tenants from API


        this.myForm = this.fb.group({
            //displayName: ['', [Validators.required, Validators.minLength(1)]],
            displayName: ['', [Validators.required]],
            serviceName: ['', [Validators.required]],
            serviceTypeName: ['', [Validators.required]],
            serviceType: ['Stateless'],
            instanceCount: [1, [Validators.required]],
            minReplicaSetSize: [1, [Validators.required]],
            targetReplicaSetSize: [1, [Validators.required]],
            parameterName: ['', [Validators.required]],
            parameterValue: ['', [Validators.required]],
            parameterSecret: [false],      
        });
    }


    getTenants(): void {
        // TODO: get tenants from API
        this.tenantsService.getTenants().subscribe(
            tenants => this.tenants = tenants,
            error => {
                console.log(error);         
            });
    }


    initParameter() { 
        this.myForm.patchValue({ parameterName: '' });
        this.myForm.patchValue({ parameterValue: '' });
        this.myForm.patchValue({ parameterSecret: false });    
    }

    initServiceStateless() {
        this.myForm.patchValue({ serviceType: 'Stateless' });
        this.myForm.patchValue({ serviceTypeName: '' });
        this.myForm.patchValue({ serviceName: '' });
        this.myForm.patchValue({ instanceCount: 1 });
    }

    initServiceStateful() {
        this.myForm.patchValue({ serviceType: 'Stateless' });
        this.myForm.patchValue({ serviceTypeName: '' });
        this.myForm.patchValue({ serviceName: '' });
        this.myForm.patchValue({ minReplicaSetSize: 1 });
        this.myForm.patchValue({ targetReplicaSetSize: 1 });
    }


    addParameter() {
        let parameter = {
            name: this.myForm.controls['parameterName'].value,
            value: this.myForm.controls['parameterValue'].value,
            secret: this.myForm.controls['parameterSecret'].value      
        } 
        this.parameters.push(parameter);
        this.initParameter();
    }

    addService() {      
        if (this.myForm.controls['serviceType'].value === 'Stateless') {
            let statelessService = {
                type: "stateless",
                typename: this.myForm.controls['serviceTypeName'].value,
                instanceCount: this.myForm.controls['instanceCount'].value,
                name: this.myForm.controls['serviceName'].value
            }
            this.services.push(statelessService);
            this.initServiceStateless();
        } else {
            let statefulService = {
                type: "stateful",
                typename: this.myForm.controls['serviceTypeName'].value,
                minReplicaSetSize: this.myForm.controls['minReplicaSetSize'].value,
                targetReplicaSetSize: this.myForm.controls['targetReplicaSetSize'].value,
                name: this.myForm.controls['serviceName'].value
            }
            this.services.push(statefulService);
            this.initServiceStateful();
        }
    }

    removeParameter(i: number) {   
        this.parameters.splice(i, 1);
    }

    removeService(i: number) {
        this.services.splice(i, 1);
    }

    save(model) {
        // TODO: call API to save
        
        let displayName = this.myForm.controls['displayName'].value;
        this.tenant.displayName = displayName;

        // Add parameters and services
        for (let idx in this.tenant.resources) {
            if (this.tenant.resources[idx].type === 'tenantApp') {
                this.tenant.resources[idx].configuration.parameters = [];
                this.tenant.resources[idx].configuration.parameters.push(this.parameters)
                this.tenant.resources[idx].configuration.services = [];
                this.tenant.resources[idx].configuration.services.push(this.services)
            }
        }

        console.log(model);
    }

    parameterValid() {
        return this.myForm.controls['parameterName'].valid && this.myForm.controls['parameterValue'].valid 
    }

    serviceValid() {
        return this.myForm.controls['serviceName'].valid && this.myForm.controls['serviceTypeName'].valid &&
            this.myForm.controls['instanceCount'].valid && this.myForm.controls['minReplicaSetSize'].valid &&
            this.myForm.controls['targetReplicaSetSize'].valid;
    }

    formValid() {
        if (this.parameters.length > 0 || this.services.length > 0) {
            return true;
        } else {
            return false;
        }
    }


}


 