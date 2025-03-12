import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LayoutMainComponent } from './layout/layout-main/layout-main.component';
import { AccueilComponent } from './pages/accueil/accueil.component';

export const routes: Routes = [
  // { path: 'layout' , component: LayoutMainComponent},
  {
    path: '',
    component: LayoutMainComponent, // Pages with the layout
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'accueil', component: AccueilComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
