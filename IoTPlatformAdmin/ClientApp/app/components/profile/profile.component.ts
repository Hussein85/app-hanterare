import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'profile',
    template: require('./profile.component.html')
})
export class ProfileComponent {
    profile: any;

   
    constructor(private auth: AuthService) {
        this.profile = JSON.parse(localStorage.getItem('profile'));
        console.log(this.profile);
    }
    
}

