import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { LoginService } from '../../services/login.service';

@Component({
    template: require('./login.component.html'),
    styles: [require('./login.component.css')]
})
export class LoginComponent {

    wrongPassOrEmail = false;


    constructor(
        private loginService: LoginService,
        private translate: TranslateService,
        private router: Router
    ) { }


    login(username, password): void {
             
        this.loginService.login(username, password).subscribe(
            response => {
                localStorage.setItem('id_token', response.IdToken);

                //TODO: get profile from id_token and save in local storage: localStorage.setItem('profile', JSON.stringify(profile));
                // ...

                this.router.navigate(['']);
            },
            error => {
                this.wrongPassOrEmail = true;
            });
    }

    wrongEmailOrPassword(): boolean {
        return this.wrongPassOrEmail;
    }


   

}







