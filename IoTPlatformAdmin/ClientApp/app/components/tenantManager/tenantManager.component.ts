import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from 'ng2-translate';
import { ThemeService } from '../../services/theme.service';
import { TenantsService } from '../../services/tenants.service';

//import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

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
   
    services = [
        //{
        //    type: "stateless",
        //    typename: "",
        //    instanceCount: 1,
        //    name: ""
        //}
    ];

    parameters = [
        //{
        //    name: "",
        //    value: "",
        //    secret: false
        //}
    ];

    serviceTypes = [
        "stateless",
        "stateful"
    ]

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

    constructor(
        private auth: AuthService,
        private translateService: TranslateService,
        private themeService: ThemeService,
        private tenantsService: TenantsService
       
    ) { }

    ngOnInit(): void {
        var specificUserPreference = JSON.parse(localStorage.getItem('userPref'));
        this.themeService.changeTheme(specificUserPreference.theme);
        this.translateService.use(specificUserPreference.language);
        //this.getTenants();    // TODO: get Tenants from API
    
    }


    getTenants(): void {  
        this.tenantsService.getTenants().subscribe(
            tenants => this.tenants = tenants,
            error => {
                console.log(error);         
            });
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

    removeParameter(i: number) {   
        this.parameters.splice(i, 1);
    }

    removeService(i: number) {
        this.services.splice(i, 1);
    }

    // TODO: call API to save tenant
    save() {

        this.tenant.displayName = this.displayName;

        for (let idx in this.tenant.resources) {

            // Add parameters and services configuration
            if (this.tenant.resources[idx].type === "tenantApp") {            
                this.tenant.resources[idx].configuration['parameters'] = [];
                this.tenant.resources[idx].configuration['parameters'].push(this.parameters)
                this.tenant.resources[idx].configuration['services'] = [];
                this.tenant.resources[idx].configuration['services'].push(this.cleanFields(this.services))
            }

            // Add mqtt configuration
            if (this.tenant.resources[idx].type == "mqttBroker") {
                this.tenant.resources[idx].configuration = this.mqttBroker;
            }
        }

        // For debugging. Remove later
        this.showJSON = true;
    }

    parameterValid() {
        //return this.myForm.controls['parameterName'].valid && this.myForm.controls['parameterValue'].valid 
    }

    serviceValid() {
        //return this.myForm.controls['serviceName'].valid && this.myForm.controls['serviceTypeName'].valid &&
        //    this.myForm.controls['instanceCount'].valid && this.myForm.controls['minReplicaSetSize'].valid &&
        //    this.myForm.controls['targetReplicaSetSize'].valid;
    }

    formValid() {
        //if (this.parameters.length > 0 || this.services.length > 0) {
        //    return true;
        //} else {
        //    return false;
        //}
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




}


 