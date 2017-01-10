import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

import { TranslateService } from 'ng2-translate';
import { ThemeService } from '../../services/theme.service';
import { TenantsService } from '../../services/tenants.service';

import { matchingPasswordsValidator } from '../../validators/matchingPasswordsValidator';
import { targetReplicaSetSizeValidator } from '../../validators/targetReplicaSetSizeValidator';
import { TenantFilterPipe } from '../../pipes/tenant-filter.pipe';


import { Tenant } from '../../models/tenant';


@Component({
    template: require('./tenant-list.component.html'),
    styles: [require('./tenant-list.component.css')]
})
export class TenantListComponent implements OnInit {

    addTenantForm: FormGroup;
    tenantFilterPipe: any;

    tenants: any;

    selectedTenants = [];
    tenant: any;

    nameCheckBox = false;
    filterText = "";
    healthState = "";
    status = "";
    serviceTypes = [
        "stateless",
        "stateful"
    ]
    isNameSelected = false;


    showJSON = false;        // Remove when finished debugging


    // TODO: Get update versions from API
    version = "v1.1";
    versions = ["v0.9", "v1.1", "v1.2", "v1.3", "v1.4"];

    constructor(
        private translateService: TranslateService,
        private themeService: ThemeService,
        private tenantsService: TenantsService,
        private fb: FormBuilder
    ) {
        this.tenantFilterPipe = new TenantFilterPipe();
     }

    ngOnInit(): void {
        var specificUserPreference = JSON.parse(localStorage.getItem('userPref'));
        this.themeService.changeTheme(specificUserPreference.theme);
        this.translateService.use(specificUserPreference.language);
        this.getTenants();   

        this.addTenantForm = this.fb.group({
            displayName: ['', [Validators.required]],  
            username: ['', Validators.required],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required], 
            parameters: this.fb.array([]),
            services: this.fb.array([])          
        }, { validator: matchingPasswordsValidator('password', 'confirmPassword') });
        this.selectedTenants = this.tenants;
    }


 


    getTenants() {
         
        this.tenantsService.getTenants().subscribe(
            response => {
                this.tenants = response.tenants;
                
                // For each tenant, get version and state
                for (let i = 0; i < this.tenants.length; i++) {

                    this.tenantsService.getTenantConfiguration(this.tenants[i].id).subscribe(
                        response => {
                            let resources = response.resources;
                            this.tenants[i].version = resources[0].configuration.version;
                        },
                        error => {
                            console.log(error);
                        }
                    )

                    this.tenantsService.getTenantState(this.tenants[i].id).subscribe(
                        response => {
                            this.tenants[i].state = response.currentState;
                        },
                        error => {
                            console.log(error);
                        }
                    )
                }
                                           
            }, 
            error => {
                console.log(error);
            }
        )
    }

    addTenant() {

        this.tenant = {
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

        this.tenant.displayName = this.addTenantForm.value.displayName;

        for (let idx in this.tenant.resources) {

            // Add parameters and services configuration to tenant
            if (this.tenant.resources[idx].type === "tenantApp") {
                this.tenant.resources[idx].configuration['parameters'] = [];
                if (this.addTenantForm.value.parameters.length > 0) {
                    this.addTenantForm.value.parameters.forEach(parameter => {
                        this.tenant.resources[idx].configuration['parameters'].push(parameter);
                    })
                }

                this.tenant.resources[idx].configuration['services'] = [];
                if (this.addTenantForm.value.services.length > 0) {
                    this.addTenantForm.value.services.forEach(service => {
                        this.tenant.resources[idx].configuration['services'].push(service);
                    })

                    this.cleanFields(this.tenant.resources[idx].configuration['services']);
                }
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

        // Create a new tenant
        this.tenantsService.createTenant(this.tenant).subscribe(
            response => alert("Tenant added!")
        );


        // For debugging. Remove later
        this.showJSON = true;

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


    addParameter() {       
        const control = <FormArray>this.addTenantForm.controls['parameters'];
        control.push(this.initParameter());
    }

    addService() {     
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

    removeSelectedTenant(i) {
        this.selectedTenants[i].selected = false;
    }

    healthStatus(r) {
        this.healthState = r.value;
        this.selectedTenants = this.tenantFilterPipe.transform(this.tenants, 'name', this.filterText);
        this.selectedTenants = this.tenantFilterPipe.transform(this.selectedTenants, 'healthState', this.healthState)
        this.selectedTenants = this.tenantFilterPipe.transform(this.selectedTenants, 'status', this.status)

    }

    statusRunning(r) {
        this.status = r.value;
        this.selectedTenants = this.tenantFilterPipe.transform(this.tenants, 'name', this.filterText);
        this.selectedTenants = this.tenantFilterPipe.transform(this.selectedTenants, 'healthState', this.healthState)
        this.selectedTenants = this.tenantFilterPipe.transform(this.selectedTenants, 'status', this.status)
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


    selectAll() {
        this.isNameSelected = !this.isNameSelected;
      
        this.selectedTenants = this.tenantFilterPipe.transform(this.tenants, 'name', this.filterText);
        this.selectedTenants = this.tenantFilterPipe.transform(this.selectedTenants, 'healthState', this.healthState)
        this.selectedTenants = this.tenantFilterPipe.transform(this.selectedTenants, 'status', this.status)

        this.selectedTenants.forEach(tenant => { tenant.selected = this.isNameSelected; })
    }

    getNbrItemSelected() {
        var nbrITems = 0;
        //if (this.selectedTenants.length > 0) {
        //    this.selectedTenants.forEach(tenant => {
        //        if (tenant.selected === true)
        //            nbrITems++;
        //    })
        //}
        return nbrITems;
    }

    checkboxClicked() {
        //alert(this.getNbrItemSelected() + '\n' + this.tenants.length);

        //if ((this.getNbrItemSelected() <= this.tenants.length) && this.nameCheckBox == true) {
        //    this.nameCheckBox = false;
        //} 
    }


}


