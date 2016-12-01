import { Component, Inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

import { DOCUMENT } from '@angular/platform-browser';

// ng2-translate
import { TranslateService} from 'ng2-translate';

// angular2 localization
//import { Locale, LocaleService, LocalizationService } from 'angular2localization';


const themes = {
    default: "//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css",
    cerulean: "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.7/cerulean/bootstrap.min.css",
    cosmo: "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.7/cosmo/bootstrap.min.css",
    cyborg: "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.7/cyborg/bootstrap.min.css",
    darkly: "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.7/darkly/bootstrap.min.css",
    flatly: "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.7/flatly/bootstrap.min.css",
    journal: "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.7/journal/bootstrap.min.css",
    lumen: "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.7/lumen/bootstrap.min.css",
    paper: "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.7/paper/bootstrap.min.css",
    readable: "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.7/readable/bootstrap.min.css",
    sandstone: "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.7/sandstone/bootstrap.min.css",
    simplex: "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.7/simplex/bootstrap.min.css",
    slate: "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.7/slate/bootstrap.min.css",
    spacelab: "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.7/spacelab/bootstrap.min.css",
    superhero: "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.7/superhero/bootstrap.min.css",
    united: "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.7/united/bootstrap.min.css",
    yeti: "https://cdnjs.cloudflare.com/ajax/libs/bootswatch/3.3.7/yeti/bootstrap.min.css"   
}


   // ` @import "${themes.slate}" ;`,
// ng2-translate
@Component({
    selector: 'app',
    template: require('./app.component.html'),
    styles: [  require('./app.component.css')]
   
})
export class AppComponent  {
    themes = [
        "cerulean",
        "cosmo",
        "cyborg",
        "darkly",
        "flatly",
        "journal",
        "lumen",
        "paper",
        "readable",
        "sandstone",
        "simplex",
        "slate",
        "spacelab",
        "superhero",
        "united",
        "yeti"
    ];
    selectedTheme = themes.united;
  
    constructor(private auth: AuthService, private translate: TranslateService, @Inject(DOCUMENT) private document) {
        translate.addLangs(["eng","fra","ger"]);
        translate.setDefaultLang('eng');

        let browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/eng|fra/) ? browserLang : 'eng');

        this.changeTheme(this.selectedTheme);
    }

    changeTheme(theme) {
        this.document.getElementById('theme').setAttribute('href', theme);
        
    }
    
}





