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

// Fake tenant. Remove later
var tenant = {
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
                "version": "1.0",
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

        return tenants;  // Return fake tenants. Remove
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
        //Uncomment code when API is working
        /*
        return this.http.get(this.API_URL + "/" + id)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
        */

        return tenant;
    }

    // Update a tenant
    updateTenant(tenant) {
        //Uncomment code when API is working
        /*
        return this.http.put(this.API_URL + "/" + tenant['id'], tenant)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
        */
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






