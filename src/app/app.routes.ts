import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LayoutMainComponent } from './layout/layout-main/layout-main.component';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { VehiculeClientComponent } from './pages/vehicule-client/vehicule-client.component';
import { ForbiddenComponent } from './pages/error/forbidden/forbidden.component';
import { NotFoundComponent } from './pages/error/not-found/not-found.component';
import { EntreeStockComponent } from './pages/entree-stock/entree-stock.component';
import { EtatStockComponent } from './pages/etat-stock/etat-stock.component';
import { DetailReparationComponent } from './pages/detail-reparation/detail-reparation.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutMainComponent, // Pages with the layout
    children: [
      {
        path: 'accueil',
        component: AccueilComponent,
        canActivate: [authGuard],
        data: { profiles: ['client'] },
      },
      {
        path: 'vehicule-client',
        component: VehiculeClientComponent,
        canActivate: [authGuard],
        data: { profiles: ['clients', 'technicien', 'admin'] },
      },
      {
        path: 'entree-stock',
        component: EntreeStockComponent,
        canActivate: [authGuard],
        data: { profiles: ['client', 'technicien', 'admin'] },
      },
      {
        path: 'etat-stock',
        component: EtatStockComponent,
        canActivate: [authGuard],
        data: { profiles: ['client', 'technicien', 'admin'] },
      },
      {
        path: 'detail-reparation/:reparation_id',
        component: DetailReparationComponent,
        canActivate: [authGuard],
        data: { profiles: ['client', 'technicien', 'admin'] },
      },
      { path: '', redirectTo: 'accueil', pathMatch: 'full' },
    ],
  },
  { path: 'forbidden', component: ForbiddenComponent }, // Page 403
  { path: 'not-found', component: NotFoundComponent }, // Page 404
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
];
