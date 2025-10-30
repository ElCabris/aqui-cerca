import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { UserPage } from './pages/user/user';
import { ScanQr } from './pages/scan-qr/scan-qr';
import { Map } from './pages/map/map';
import { Explore } from './pages/explore/explore';
import { Login } from './pages/login/login';
import { About } from './pages/about/about';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: 'register', component: Register },
  { path: 'profile', component: UserPage, canActivate: [authGuard] },
  { path: 'scan-qr', component: ScanQr, canActivate: [authGuard] },
  { path: 'map', component: Map, canActivate: [authGuard] },
  { path: 'explore', component: Explore, canActivate: [authGuard] },
  { path: 'login', component: Login },
  { path: 'about', component: About },
  { path: '', redirectTo: 'about', pathMatch: 'full' }
];
