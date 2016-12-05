import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/map'



@Injectable()
export class TenantsService {

    API_URL = 'http://localhost:19081/Platform/TenantMgmt/api/tenants';
    

    constructor(private http: Http) { }


    // Get all tenants
    getTenants() {
        return this.http.get(this.API_URL)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    // Create a tenant
    createTenant(tenant) {
        return this.http.post(this.API_URL, tenant)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    // Delete a tenant
    deleteTenant(id) {
        return this.http.delete(this.API_URL + "/" + id)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
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






