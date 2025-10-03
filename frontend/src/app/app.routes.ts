import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { UserPage } from './pages/user/user';
import { ScanQr } from './pages/scan-qr/scan-qr';
import { Map } from './pages/map/map';
import { Explore } from './pages/explore/explore';
import { Login } from './pages/login/login';
import { About } from './pages/about/about';

export const routes: Routes = [
  { path: 'register', component: Register },
  { path: 'profile', component: UserPage },
  { path: 'scan-qr', component: ScanQr },
  { path: 'map', component: Map },
  { path: 'explore', component: Explore },
  { path: 'login', component: Login },
  { path: 'about', component: About },
  { path: '', redirectTo: 'about', pathMatch: 'full' }
];
