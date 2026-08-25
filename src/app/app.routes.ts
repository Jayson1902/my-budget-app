import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Dashboard } from './dashboard/dashboard';
import { authGuard, guestGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];
