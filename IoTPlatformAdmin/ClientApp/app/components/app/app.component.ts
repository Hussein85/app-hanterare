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
        // Add languages
        translate.addLangs(["en", "fr", "de", "sv"]);
  
        // Get browser language
        let browserLang = this.translate.getBrowserLang();

        // if browser langauge is not found in available languages, use english as default language
        if (translate.getLangs().indexOf(browserLang) === -1) {
            browserLang = "en";
        }
        this.translate.use(browserLang);
    }

    changeLanguage(langSelect) {
        this.translate.use(langSelect.value)

        // Save selected language in local storage to keep it selected between page refreshes.
        if (localStorage.getItem('userPref')) {
            let userPref = JSON.parse(localStorage.getItem('userPref'))
            userPref.language = langSelect.value;
            localStorage.setItem('userPref', JSON.stringify(userPref));
        }
    }

}






