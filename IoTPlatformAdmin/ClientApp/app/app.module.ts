// Modules
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UniversalModule } from 'angular2-universal';
import { AUTH_PROVIDERS } from 'angular2-jwt';                  // Provides the AuthHttp helper which automatically adds the authorization header to requests
import { HttpModule, Http } from '@angular/http';

// Components
import { AppComponent } from './components/app/app.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';

// Routing and AuthGuard
import { routing, appRoutingProviders } from './app.routing';
import { AuthGuardUser } from './auth.guard';
import { AuthGuardAdmin } from './auth.guard';


// Services
import { AuthService } from './services/auth.service';
import { ForecastService } from './services/forecast.service';

// ng2-translate
import { TranslateModule } from 'ng2-translate';
import { TranslateService, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';

// Angular 2 Localization.
//import { LocaleModule, LocalizationModule } from 'angular2localization';

@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent, 
        FetchDataComponent,
        HomeComponent,
        ProfileComponent,
        LoginComponent,
        AdminComponent
    ],
    imports: [
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        FormsModule,
        routing,

        // angular2 localization
        //LocaleModule.forRoot(),         // New instance of LocaleService.           
        //LocalizationModule.forRoot()    // New instance of LocalizationService.

        //ng2-translate
        TranslateModule.forRoot(),
        HttpModule,
       
    ],
    providers: [
        AuthService,
        AuthGuardUser,
        AuthGuardAdmin,
        AUTH_PROVIDERS,
        appRoutingProviders,
        ForecastService
    ]
})
export class AppModule {
}

