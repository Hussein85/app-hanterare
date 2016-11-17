import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
    template: require('./admin.component.html')
})
export class AdminComponent {
    constructor(private auth: AuthService) { }
}
