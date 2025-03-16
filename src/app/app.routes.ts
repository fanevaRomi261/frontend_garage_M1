import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LayoutMainComponent } from './layout/layout-main/layout-main.component';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { VehiculeClientComponent } from './pages/vehicule-client/vehicule-client.component';
import { ForbiddenComponent } from './pages/error/forbidden/forbidden.component';
import { NotFoundComponent } from './pages/error/not-found/not-found.component';
import { PlanningComponent } from './pages/planning/planning.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutMainComponent, // Pages with the layout
    children: [
      { path: 'accueil', component: AccueilComponent },
      { path: 'vehicule-client', component: VehiculeClientComponent },
      { path : 'planning' , component: PlanningComponent},
      { path: '', redirectTo: 'accueil', pathMatch: 'full' }
    ],
  },
  { path: 'forbidden', component: ForbiddenComponent }, // Page 403
  { path: 'not-found', component: NotFoundComponent }, // Page 404
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'not-found',pathMatch: 'full'},
];
