import { Component, OnInit, ViewContainerRef, ViewEncapsulation  } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from 'ng2-translate';
import { ThemeService } from '../../services/theme.service';
import { TenantsService } from '../../services/tenants.service';
import { ActivatedRoute, Router } from '@angular/router';
import { matchingPasswordsValidator } from '../../validators/matchingPasswordsValidator';
import { targetReplicaSetSizeValidator } from '../../validators/targetReplicaSetSizeValidator';
import { matchingDisplayNamesValidator } from '../../validators/matchingDisplayNamesValidator';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';


@Component({
    template: require('./tenantDetail.component.html'),
    styles: [require('./tenantDetail.component.css')]
})
export class TenantDetailComponent implements OnInit {

    editTenantForm: FormGroup;
    deleteTenantForm: FormGroup;

    tenant: any;

    deleteTenantInputText = "";
    
    version = "";
   
    versions: any;

    showJSON = false;

    serviceTypes = [
        "stateless",
        "stateful"
    ]

  
    status = "Running";

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

    //OBS!!! Uncomment code below when API works
    getTenant(id) {
        // Uncomment code to get tenant from API
        /*this.tenantsService.getTenantById(id).subscribe(
            tenant => {
                this.tenant = tenant
                this.fillValuesInForm()
            });
        */

        // Remove these two lines when API is working
        this.tenant = this.tenantsService.getTenantById(id);
        this.fillValuesInForm();
   
    }

    fillValuesInForm() {
        this.editTenantForm = this.fb.group({
            displayName: [this.tenant.displayName, [Validators.required]],
            username: [this.getMQTTUserName(), Validators.required],
            password: [this.getMQTTPassword(), Validators.required],
            confirmPassword: [this.getMQTTPassword(), Validators.required],
            parameters: this.fb.array([]),
            services: this.fb.array([])
        }, { validator: matchingPasswordsValidator('password', 'confirmPassword') });


        let parameters = this.getParameters();
        let controlParameters = <FormArray>this.editTenantForm.controls['parameters'];
        for (let idx in parameters) {
            controlParameters.push(this.fb.group({          
                name: [parameters[idx].name, Validators.required],
                value: [parameters[idx].value, Validators.required],
                secret: [parameters[idx].secret]
            }));      
        }
   
        let services = this.getServices();
        let controlServices = <FormArray>this.editTenantForm.controls['services'];
        for (let idx in services) {
            if (services[idx].type === 'stateless') {
                controlServices.push(this.fb.group({
                    type: [services[idx].type],
                    typename: [services[idx].typename, Validators.required],
                    instanceCount: [services[idx].instanceCount, Validators.pattern('[1-9][0-9]{0,4}')], 
                    minReplicaSetSize: [1, Validators.pattern('[1-9][0-9]{0,4}')],
                    targetReplicaSetSize: [2, Validators.pattern('[1-9][0-9]{0,4}')],                
                    name: [services[idx].name, Validators.required]
                }, { validator: targetReplicaSetSizeValidator('minReplicaSetSize', 'targetReplicaSetSize') }));
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

        this.deleteTenantForm = this.fb.group({
            displayName: [this.tenant.displayName],
            confirmDisplayName: ['', [Validators.required]]

        }, { validator: matchingDisplayNamesValidator('displayName', 'confirmDisplayName') });

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

    getVersion() {
        for (let idx in this.tenant.resources) {
            if (this.tenant.resources[idx].type === "tenantApp") {
                return this.tenant.resources[idx].configuration['version']
            }
        }
        
    }

    getAvailableUpgradeVersions() {
        //TODO: call service to get available upgrade versions for tenant
        // ...

        // Remove this when when API works
        return ["v0.9", "v1.1", "v1.2", "v1.3", "v1.4"];

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
        this.router.navigate(['/tenants']);
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
   
    delete() {
        alert("Tenant Deleted!");
        
        this.tenantsService.deleteTenant(this.tenant.id);      
    }

    removeParameter(i: number) {
        const control = <FormArray>this.editTenantForm.controls['parameters'];
        control.removeAt(i);
    }

    removeService(i: number) {      
        const control = <FormArray>this.editTenantForm.controls['services'];
        control.removeAt(i);
    }

    addParameter() {     
        const control = <FormArray>this.editTenantForm.controls['parameters'];
        control.push(this.initParameter());
    }

    addService() {
        const control = <FormArray>this.editTenantForm.controls['services'];
        control.push(this.initService());
    }


    changeType() {
    }

    // Update tenant
    save() {
       
        this.tenant.displayName = this.editTenantForm.value.displayName;

        for (let idx in this.tenant.resources) {

            // Add parameters and services configuration
            if (this.tenant.resources[idx].type === "tenantApp") {
                this.tenant.resources[idx].configuration['parameters'] = [];
                if (this.editTenantForm.value.parameters.length > 0) {                  
                    this.editTenantForm.value.parameters.forEach(parameter => {
                        this.tenant.resources[idx].configuration['parameters'].push(parameter);
                    })
                }

                this.tenant.resources[idx].configuration['services'] = [];
                if (this.editTenantForm.value.services.length > 0) {

                    this.editTenantForm.value.services.forEach(service => {
                        this.tenant.resources[idx].configuration['services'].push(service);
                    })

                    this.cleanFields(this.tenant.resources[idx].configuration['services']);
                }
            }

      
            // Add mqtt configuration
            let mqttBroker = {
                username: this.editTenantForm.value.username,
                password: this.editTenantForm.value.password
            }

            if (this.tenant.resources[idx].type == "mqttBroker") {
                this.tenant.resources[idx].configuration = mqttBroker;
            }
        }

        // Update tenant
        this.tenantsService.updateTenant(this.tenant);

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

 
    startStop() {
        if (this.status === "Running") {
            this.status = "Stopped";
            //TODO: Call service to stop the app
            // ...
        } else {
            this.status = "Running";
            //TODO: Call service to start the app
            // ...
        }
    }

}


