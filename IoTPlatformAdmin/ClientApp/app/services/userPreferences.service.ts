import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/map'


// Fake user preferences.
var fakeUserPreferences = {
        id: "1",
        theme: "default",
        language: "en",
        userId: "user1"
    }


@Injectable()
export class UserPreferencesService {

    API_URL = 'http://localhost:10076/api/UserPreferences';
    token = localStorage.getItem('id_token');
    headers = new Headers({ 'Authorization': 'Bearer ' + this.token });
    options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http) { }


    //OBS!!! Uncomment code below when API works
    getUserPreferences() { 
          
        // Uncomment code when API works
        /*
        return this.http.get(this.API_URL, this.options)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
        */

        return fakeUserPreferences;       
    }

    //OBS!!! Uncomment code below when API works
    updateUserPreferences(userPref) {
        // Uncomment code when API works
        /*    
        return this.http.put(this.API_URL, userPref, this.options)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
        */  
    }


}






