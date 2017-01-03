// Modules
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UniversalModule } from 'angular2-universal';
import { AUTH_PROVIDERS } from 'angular2-jwt';                  // Provides the AuthHttp helper which automatically adds the authorization header to requests
import { HttpModule, Http } from '@angular/http';
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { TranslateModule } from 'ng2-translate';

// Components
import { AppComponent } from './components/app/app.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { TenantsComponent } from './components/tenants/tenants.component';
import { TenantDetailComponent } from './components/tenants/tenantDetail.component';

// Routing and AuthGuard
import { routing, appRoutingProviders } from './app.routing';
import { AuthGuardUser } from './auth.guard';
import { AuthGuardAdmin } from './auth.guard';

// Services
import { AuthService } from './services/auth.service';
import { UserPreferencesService } from './services/userPreferences.service';
import { ThemeService } from './services/theme.service';
import { TenantsService } from './services/tenants.service';
import { TranslateService, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';

// Pipes
import { TenantFilterPipe } from "./pipes/tenant-filter.pipe";




@NgModule({
    bootstrap: [ AppComponent ],
    declarations: [
        AppComponent, 
        HomeComponent,
        ProfileComponent,
        LoginComponent,
        AdminComponent,
        TenantsComponent,
        TenantDetailComponent,
        TenantFilterPipe
    ],
    imports: [
        UniversalModule, // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        FormsModule,
        ReactiveFormsModule,
        routing,
        TranslateModule.forRoot(), 
        HttpModule,
        ModalModule.forRoot(),
        BootstrapModalModule
    ],
    providers: [
        AuthService,
        AuthGuardUser,
        AuthGuardAdmin,
        AUTH_PROVIDERS,
        appRoutingProviders,
        UserPreferencesService,
        ThemeService,
        TenantsService
    ]
})
export class AppModule {
}

