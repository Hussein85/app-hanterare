import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs';

import { Router } from '@angular/router';

import 'rxjs/add/operator/map'


import { UserPreferences } from '../models/userPreferences';


@Injectable()
export class UserPreferencesService {

    API_URL = 'http://localhost:10076/api/UserPreferences/GetUserPreferences';


    constructor(private http: Http, private authHttp: AuthHttp) { }

  
    getUserPreferences(): Observable<UserPreferences> {

        let token = localStorage.getItem('id_token');
        let headers = new Headers({ 'Authorization': 'Bearer ' + token });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.API_URL, options)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

    }


}






