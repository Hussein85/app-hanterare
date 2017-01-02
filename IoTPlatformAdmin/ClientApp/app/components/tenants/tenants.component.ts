import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from 'ng2-translate';
import { ThemeService } from '../../services/theme.service';
import { TenantsService } from '../../services/tenants.service';
import { matchingPasswordsValidator } from '../../validators/matchingPasswordsValidator';
import { targetReplicaSetSizeValidator } from '../../validators/targetReplicaSetSizeValidator';
import { TenantFilterPipe } from '../../pipes/tenant-filter.pipe';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
    template: require('./tenants.component.html'),
    styles: [require('./tenants.component.css')]
})
export class TenantsComponent implements OnInit {

    addTenantForm: FormGroup;
    tenantFilterPipe: any;

    tenants: any;
    selectedTenants: any;
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


    constructor(
        private auth: AuthService,
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
        //Uncomment code when API works
        /*
        this.tenantsService.getTenants().subscribe(
            tenants => this.tenants = tenants,
            error => {
                console.log(error);
            });
        */

        this.tenants = this.tenantsService.getTenants();  // Remove this line when api works
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

 
    save() {

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

        // Create a new tenant
        this.tenantsService.createTenant(this.tenant);


        // For debugging. Remove later
        this.showJSON = true;

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
        this.selectedTenants.forEach(tenant => {
            if (tenant.selected === true)
                nbrITems++;
        })
        return nbrITems;
    }

    checkboxClicked() {
        //alert(this.getNbrItemSelected() + '\n' + this.tenants.length);

        //if ((this.getNbrItemSelected() <= this.tenants.length) && this.nameCheckBox == true) {
        //    this.nameCheckBox = false;
        //} 
    }




}


