import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { LoginComponent } from './components/login/login.component';


import { AuthGuard } from './auth.guard';

const appRoutes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    /*
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    */
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]
    },
    
    {
        path: 'fetch-data',
        component: FetchDataComponent,
        canActivate: [AuthGuard]
    }


];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

