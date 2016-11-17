﻿import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';

import { AuthGuardUser } from './auth.guard';
import { AuthGuardAdmin } from './auth.guard';

const appRoutes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuardAdmin]
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuardUser]
    },  
    {
        path: 'fetch-data',
        component: FetchDataComponent,
        canActivate: [AuthGuardUser]
    }

];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

