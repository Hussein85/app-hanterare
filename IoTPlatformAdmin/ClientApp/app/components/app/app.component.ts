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
        translate.addLangs(["eng","fra","ger"]);
        translate.setDefaultLang('eng');

        let browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/eng|fra/) ? browserLang : 'eng');
    }
    
    
}





