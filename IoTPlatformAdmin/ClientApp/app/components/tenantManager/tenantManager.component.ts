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
        //this.getTenants();


        this.myForm = this.fb.group({
            //displayName: ['', [Validators.required, Validators.minLength(1)]],
            displayName: ['', [Validators.required]],
            parameters: this.fb.array([this.initParameter()])
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
        return this.fb.group({
            name: ['', Validators.required],
            value: [''],
            secret:[false]
        });
    }


    addParameter() {
        const control = <FormArray>this.myForm.controls['parameters'];
        control.push(this.initParameter());  
    }

    removeParameter(i: number) {
        const control = <FormArray>this.myForm.controls['parameters'];
        control.removeAt(i);
    }

    save(model) {
        // TODO: call API to save
        
        let displayName = this.myForm.controls['displayName'].value;
        this.tenant.displayName = displayName;

        let parameters = <FormArray>this.myForm.controls['parameters'].value;
       
        for (let idx in this.tenant.resources) {
            if (this.tenant.resources[idx].type === 'tenantApp') {
                this.tenant.resources[idx].configuration.parameters = [];
                this.tenant.resources[idx].configuration.parameters.push(parameters)
            }
        }

        console.log(model);
    }
}


 