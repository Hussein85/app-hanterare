import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from 'ng2-translate';

@Component({
    template: require('./login.component.html'),
    styles: [require('./login.component.css')]
})
export class LoginComponent {
    constructor(private auth: AuthService, private translate: TranslateService) { }


    login(username, password): void {
        this.auth.login(username, password);
    }

    wrongEmailOrPassword(): boolean {
        return this.auth.wrongEmailOrPassword;
    }

}
