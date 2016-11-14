import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'home',
    template: require('./home.component.html')
})
export class HomeComponent {
    constructor(private auth: AuthService) { }
}
