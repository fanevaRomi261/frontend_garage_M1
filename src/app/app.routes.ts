import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LayoutMainComponent } from './layout/layout-main/layout-main.component';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { VehiculeClientComponent } from './pages/vehicule-client/vehicule-client.component';
import { ForbiddenComponent } from './pages/error/forbidden/forbidden.component';
import { NotFoundComponent } from './pages/error/not-found/not-found.component';

import { PlanningComponent } from './pages/planning/planning.component';

import { EntreeStockComponent } from './pages/entree-stock/entree-stock.component';
import { EtatStockComponent } from './pages/etat-stock/etat-stock.component';
import { DetailReparationComponent } from './pages/detail-reparation/detail-reparation.component';
import { authGuard } from './guards/auth.guard';
import { GestionMecanicienComponent } from './pages/gestion-mecanicien/gestion-mecanicien.component';
import { ChangePasswordComponent } from './pages/auth/change-password/change-password.component';
import { HistoriqueReparationClientComponent } from './pages/historique-reparation-client/historique-reparation-client.component';
import { AgendaMecanicienComponent } from './pages/agenda-mecanicien/agenda-mecanicien.component';
import { ReparationComponent } from './pages/reparation/reparation.component';
import { GestionPieceComponent } from './pages/gestion-piece/gestion-piece.component';
import { DashboardManagerComponent } from './pages/dashboard-manager/dashboard-manager.component';
import { ListeRdvClientComponent } from './liste-rdv-client/liste-rdv-client.component';


export const routes: Routes = [
  {
    path: '',
    component: LayoutMainComponent, // Pages with the layout
    children: [

      {
        path: 'accueil',
        component: AccueilComponent,
        canActivate: [authGuard],
        data: { profiles: ['client','manager','mécanicien'] },
      },
       { 
         path : 'planning' , 
         component: PlanningComponent , 
         canActivate : [authGuard], 
         data : { profiles : ['client'] },
      },
      {
        path: 'vehicule-client',
        component: VehiculeClientComponent,
        canActivate: [authGuard],
        data: { profiles: ['client'] },
      },
      {
        path: 'historique-reparation-client/:vehicule_id',
        component: HistoriqueReparationClientComponent,
        canActivate: [authGuard],
        data: { profiles: ['client', 'manager', 'mécanicien'] },
      },
      {
        path: 'entree-stock',
        component: EntreeStockComponent,
        canActivate: [authGuard],
        data: { profiles: ['manager'] },
      },
      {
        path: 'etat-stock',
        component: EtatStockComponent,
        canActivate: [authGuard],
        data: { profiles: ['manager','mécanicien'] },
      },
      {
        path: 'detail-reparation/:reparation_id',
        component: DetailReparationComponent,
        canActivate: [authGuard],
        data: { profiles: ['mécanicien', 'manager'] },
      },
      {
        path: 'gestion-mecanicien',
        component: GestionMecanicienComponent,
        canActivate: [authGuard],
        data: { profiles: ['manager'] },
      },
      {
        path: 'agenda-mecanicien',
        component: AgendaMecanicienComponent,
        canActivate: [authGuard],
        data: {profiles : ['mécanicien','manager']}
      },
      {
        path : 'reparation/:id',
        component : ReparationComponent,
        canActivate : [authGuard],
        data : { profiles : ['mécanicien','manager','client']}
      },
      {
        path: 'gestion-piece',
        component: GestionPieceComponent,
        canActivate: [authGuard],
        data: { profiles: ['manager'] },
      },
      {
        path: 'dashboard-manager',
        component: DashboardManagerComponent,
        canActivate: [authGuard],
        data: { profiles: ['manager'] },
      },
      {
        path: 'liste-rdv-client',
        component: ListeRdvClientComponent,
        canActivate: [authGuard],
        data: { profiles: ['client'] },
      },
      { path: '', redirectTo: 'accueil', pathMatch: 'full' },

      
    ],
  },
  { path: 'forbidden', component: ForbiddenComponent }, // Page 403
  { path: 'not-found', component: NotFoundComponent }, // Page 404
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
];
