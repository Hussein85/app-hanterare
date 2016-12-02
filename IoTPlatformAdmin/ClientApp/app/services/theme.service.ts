import { Injectable, Inject } from '@angular/core';

import { DOCUMENT } from '@angular/platform-browser';


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


@Injectable()
export class ThemeService {

    constructor( @Inject(DOCUMENT) private document) { }

    // Get all themes
    getThemes(){
        return Object.keys(themes).map(function (key) { return key; });
    }

    // Change theme
    changeTheme(theme) {
        this.document.getElementById('theme').setAttribute('href', themes[theme]);
    }

}






