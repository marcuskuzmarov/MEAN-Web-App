import { Routes } from '@angular/router';
import { SearchComponent } from "./search/search.component";
import { DetailsComponent } from "./details/details.component";
import { LoginComponent } from "./login/login.component";
import { CreateAccountComponent } from "./create-account/create-account.component";
import { HeroComponent } from './hero/hero.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AdminComponent } from './admin/admin.component';
import { UpdatePassComponent } from './update-pass/update-pass.component';
import { PolicyComponent } from './policy/policy.component';
import { DmcaComponent } from './dmca/dmca.component';
import { AccUseComponent } from './acc-use/acc-use.component';

// paths for website routing
export const routes: Routes = [
    {
        path: '',
        component: WelcomeComponent,
        title: 'Superheroes',
    },
    {
        path: 'login',
        component: LoginComponent,
        title: 'Login Page',
    },
    {
        path: 'register',
        component: CreateAccountComponent,
        title: 'Create Account page',
    
    },
    {
        path: 'search',
        component: HeroComponent,
        title: 'Search Page',
    },
    {
        path: 'details/:id',
        component: HeroComponent,
        title: 'Hero Details',
    },
    {
        path: 'admin',
        component: AdminComponent,
        title: 'Admin Page',
    },
    {
        path: 'update-pass',
        component: UpdatePassComponent,
        title: 'Update Password Page',
    },
    {
        path: 'dmca',
        component: DmcaComponent,
        title: 'DMCA Policy',
    },
    {
        path: 'privacy',
        component: PolicyComponent,
        title: 'Privacy Policy',
    },
    {
        path: 'acc-use',
        component: AccUseComponent,
        title: 'Acceptable Use Policy',
    },
    {
        path: '**',
        redirectTo: '',
        title: 'Superheroes',
    },
];