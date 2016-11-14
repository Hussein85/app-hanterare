import { Component, OnInit } from '@angular/core';

import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'


import { ForecastService } from '../../services/forecast.service';
import { Forecast } from '../../models/forecast';

@Component({
    selector: 'fetchdata',
    template: require('./fetchdata.component.html')
})
export class FetchDataComponent implements OnInit {

    public forecasts: Forecast[];


    constructor(private forecastService: ForecastService) { }


    ngOnInit(): void {
        this.getForecasts();
    }

    getForecasts(): void {
        this.forecastService.getForecasts()
            .subscribe(
            forecasts => this.forecasts = forecasts,
            error => {      
                console.log(error);
            });
    }



   

        /*
        http.get(`${this.API_URL}/api/SampleData/WeatherForecasts`).subscribe(result => {
            this.forecasts = result.json();
        });
        */
       

        /*
        // AuthHttp will fetch the id_token from localStorage and then adds it in the authorization header
        authHttp.get(`${this.API_URL}/api/SampleData/WeatherForecasts`).subscribe(result => {
            this.forecasts = result.json();
        });
        */

        /*
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authToken = localStorage.getItem('auth_token');
        headers.append('Authorization', `Bearer ${authToken}`);

        return this.http
            .get('/profile', { headers })
            .map(res => res.json());

        */
}
        
        

    


  