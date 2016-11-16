import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';


@Component({
    template: require('./login.component.html'),
    styles: [require('./login.component.css')]
})
export class LoginComponent {
    constructor(private auth: AuthService) { }
}
