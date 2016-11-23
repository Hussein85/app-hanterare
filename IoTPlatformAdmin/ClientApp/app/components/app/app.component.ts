import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';



// ng2-translate
import { TranslateService} from 'ng2-translate';

// angular2 localization
//import { Locale, LocaleService, LocalizationService } from 'angular2localization';



// ng2-translate
@Component({
    selector: 'app',
    template: require('./app.component.html'),
    styles: [require('./app.component.css')],

})
export class AppComponent  {

  
    constructor(private auth: AuthService, private translate: TranslateService) {
        translate.addLangs(["en","fr"]);
        translate.setDefaultLang('en');

        let browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
    }
    
    
}



// Angular 2 localization
/*
@Component({
    selector: 'app',
    template: require('./app.component.html'),
    styles: [require('./app.component.css')]
})
export class AppComponent extends Locale {
   
    constructor(private auth: AuthService, public locale: LocaleService, public localization: LocalizationService) {
        super(locale, localization);

        // Adds the languages (ISO 639 two-letter or three-letter code).
        this.locale.addLanguages(['en', 'it']);

        // Required: default language, country (ISO 3166 two-letter, uppercase code) and expiry (No days). If the expiry is omitted, the cookie becomes a session cookie.
        // Selects the default language and country, regardless of the browser language, to avoid inconsistencies between the language and country.
        this.locale.definePreferredLocale('en', 'US', 30);

        // Optional: default currency (ISO 4217 three-letter code).
        this.locale.definePreferredCurrency('USD');

        // Initializes LocalizationService: asynchronous loading.
        this.localization.translationProvider('./resources/locale-'); // Required: initializes the translation provider with the given path prefix.
        this.localization.updateTranslation(); // Need to update the translation.

    }

    // Sets a new locale & currency.
    selectLocale(language: string, country: string, currency: string): void {

        this.locale.setCurrentLocale(language, country);
        this.locale.setCurrentCurrency(currency);

    }

}

*/



