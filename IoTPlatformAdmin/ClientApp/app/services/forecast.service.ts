import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs';

import { Router } from '@angular/router';

import 'rxjs/add/operator/map'


import { Forecast } from '../models/forecast';


@Injectable()
export class ForecastService {

    API_URL = 'http://localhost:10076/api/SampleData/WeatherForecasts';
    

    constructor(private http: Http, private authHttp: AuthHttp) { }


    getForecasts(): Observable<Forecast[]> {

        // get data from api with a token in authorization header
        let token = localStorage.getItem('id_token');
        let headers = new Headers({ 'Authorization': 'Bearer ' + token });
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.API_URL, options)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));



        /*
        //  get data from api with without authorization header
        return this.http.get(this.API_URL)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
        */

        /* 
        // AuthHttp will automatically add the token in the authorization header
        return this.authHttp.get(this.API_URL)
            .map((res: Response) => res.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
        */

       
        
    }

}

