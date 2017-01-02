import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/map'


// Fake tenants. Remove later when API is working
var tenants = [
    {
        id: "1",
        name: "name1",
        version: "1.0",
        healthState: "OK",
        status: "Running",
        selected: false,
    },
    {
        id: "2",
        name: "name2",
        version: "1.0",
        healthState: "OK",
        status: "Running",
        selected: false,
    },
    {
        id: "3",
        name: "name3",
        version: "1.1",
        healthState: "Error",
        status: "Stopped",
        selected: false,
    },
    {
        id: "4",
        name: "name4",
        version: "1.1",
        healthState: "OK",
        status: "Running",
        selected: false,
    },
    {
        id: "5",
        name: "name5",
        version: "1.1",
        healthState: "OK",
        status: "Running",
        selected: false,
    }
];





@Injectable()
export class TenantsService {

    API_URL = 'http://localhost:19081/Platform/TenantMgmt/api/tenants';
    

    constructor(private http: Http) { }


    // Get all tenants
    getTenants() {

        //Uncomment code when API is working
        /*
        return this.http.get(this.API_URL)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
        */

        return tenants;  // Return fake tenants
    }

    // Create a tenant
    createTenant(tenant) {
        //Uncomment code when API is working
        /*
        return this.http.post(this.API_URL, tenant)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
        */
    }

    // Delete a tenant
    deleteTenant(id) {
        //Uncomment code when API is working
        /*
        return this.http.delete(this.API_URL + "/" + id)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
        */
    }

    // Get a tenant by id
    getTenantById(id) {
        return this.http.get(this.API_URL + "/" + id)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    // Update a tenant
    updateTenant(tenant) {
        return this.http.put(this.API_URL + "/" + tenant['id'], tenant)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    // Get a tenant configuration 
    getTenantConfiguration(id) {
        return this.http.get(this.API_URL + "/" + id + "/configuration")
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    // Update a tenant configuration
    updateTenantConfiguration(tenant) {
        return this.http.put(this.API_URL + "/" + tenant['id'] + "/configuration", tenant)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }


}






