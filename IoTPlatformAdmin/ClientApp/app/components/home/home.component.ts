import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from 'ng2-translate';

@Component({
    selector: 'home',
    template: require('./home.component.html')
})
export class HomeComponent {
    constructor(private auth: AuthService, private translate: TranslateService) { }
}
