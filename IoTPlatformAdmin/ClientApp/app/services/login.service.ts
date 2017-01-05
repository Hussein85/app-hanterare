import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';


import 'rxjs/add/operator/map'


@Injectable()
export class LoginService {

    API_URL = 'https://dev-beta.combitech-iot.net:19008/PlatformApp/TenantMgmt/api/account/login';


    constructor(private http: Http) { };


    login(username, password) {

        let login = {
            UserName: username,
            Password: password
        }

        return this.http.post(this.API_URL, login)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

    }


    logout() {
        localStorage.removeItem('id_token');
        localStorage.removeItem('profile');
        localStorage.removeItem('userPref');
        location.reload();
    }


    authenticated() {

        // Search for an item in localStorage with key == 'id_token'
        for (var i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i) === 'id_token') {
                return true;
            }
        }

        return false;
     
    }

    
}

