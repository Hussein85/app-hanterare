import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from 'ng2-translate';


@Component({
    selector: 'app',
    template: require('./app.component.html'),
    styles: [require('./app.component.css')]

})
export class AppComponent {

    constructor(
        private auth: AuthService,
        private translate: TranslateService
    ) {
        translate.addLangs(["en", "fr", "de", "sv"]);

        translate.setDefaultLang('en');

        //let browserLang = translate.getBrowserLang();
        //translate.use(browserLang.match(/en|fr|de|sv/) ? browserLang : 'en');
        //translate.use('eng');

        let browserLang = this.translate.getBrowserLang();
        
        if (translate.getLangs().indexOf(browserLang) === -1) {
            browserLang = "en";
        }
        this.translate.use(browserLang);
    }

    changeLanguage(langSelect) {
        this.translate.use(langSelect.value)

        // Save selected language in local storage to keep it selected when refreshing the page.
        if (localStorage.getItem('userPref')) {
            let userPref = JSON.parse(localStorage.getItem('userPref'))
            userPref.language = langSelect.value;
            localStorage.setItem('userPref', JSON.stringify(userPref));
        }
    }

}






