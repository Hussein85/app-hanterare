// Modules
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UniversalModule } from 'angular2-universal';
import { AUTH_PROVIDERS } from 'angular2-jwt';                  // Provides the AuthHttp helper which automatically adds the authorization header to requests

// Components
import { AppComponent } from './components/app/app.component'
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';

// Routing and AuthGuard
import { routing, appRoutingProviders } from './app.routing';
import { AuthGuard } from './auth.guard';

// Services
import { AuthService } from './services/auth.service';
import { ForecastService } from './services/forecast.service';


@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent, 
        FetchDataComponent,
        HomeComponent,
        ProfileComponent
    ],
    imports: [
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        routing
    ],
    providers: [
        AuthService,
        AuthGuard,
        AUTH_PROVIDERS,
        appRoutingProviders,
        ForecastService
    ]
})
export class AppModule {
}
