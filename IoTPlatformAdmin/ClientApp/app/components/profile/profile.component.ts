import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { AuthService } from '../../services/auth.service';
import { AuthHttp } from 'angular2-jwt';
import { Router } from '@angular/router';


@Component({
    selector: 'profile',
    template: require('./profile.component.html')
})
export class ProfileComponent {
    profile: any;

   
    constructor(private auth: AuthService, private authHttp: AuthHttp, private router: Router) {
        this.profile = JSON.parse(localStorage.getItem('profile'));
        //console.log(this.profile);
    }


    onSubmit() {

        var headers: any = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        
        var data: any = JSON.stringify({
            user_metadata: {
                firstname: this.profile.user_metadata.firstname,
                lastname: this.profile.user_metadata.lastname,
            },
            //email : this.profile.email
        });
        

        this.authHttp
            .patch('https://' + 'iotplatformadmin.eu.auth0.com' + '/api/v2/users/' + this.profile.user_id, data, { headers: headers })
            .map(response => response.json())
            .subscribe(
            response => {
                //Update profile
                this.profile = response;
                localStorage.setItem('profile', JSON.stringify(response));
                this.router.navigate(['/profile']);
                alert("Changes saved");
            },
            error => alert(error.json().message)
            );

    }




    
}

