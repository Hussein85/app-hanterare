import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs';

import { Router } from '@angular/router';

import 'rxjs/add/operator/map'


import { UserPreferences } from '../models/userPreferences';


@Injectable()
export class UserPreferencesService {

    API_URL = 'http://localhost:10076/api/UserPreferences';
    token = localStorage.getItem('id_token');
    headers = new Headers({ 'Authorization': 'Bearer ' + this.token });
    options = new RequestOptions({ headers: this.headers });

    constructor(private http: Http, private authHttp: AuthHttp) { }

  
    getAllUserPreferences(): Observable<UserPreferences> {
        return this.http.get(this.API_URL, this.options)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getSpecificUserPreference(id): Observable<UserPreferences> {
        return this.http.get(this.API_URL + "/" + id, this.options)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }


    updateSpecificUserPreference(userPref): Observable<UserPreferences> {
        return this.http.put(this.API_URL, userPref, this.options)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    


}






