import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { driverApprovedGuard } from './guards/driver-approved.guard';
import { MainLayout } from './layout/main-layout';
import { AdminLayout } from './layout/admin-layout';
import { ClientLayout } from './layout/client-layout';


export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.Register) },
  { path: 'register-driver-1', loadComponent: () => import('./pages/register-driver/register-driver-1/register-driver-1').then(m => m.RegisterDriverOne) },
  { path: 'register-driver-2', loadComponent: () => import('./pages/register-driver/register-driver-2/register-driver-2').then(m => m.RegisterDriverTwo) },
  { path: 'buttons', loadComponent: () => import('./pages/button-showcase/button-showcase').then(m => m.ButtonShowcase) },
  { 
    path: 'admin', 
    component: AdminLayout,
    canActivate: [authGuard], 
    children: [
      { path: '', redirectTo: 'relatorios', pathMatch: 'full' },
      { path: 'relatorios', loadComponent: () => import('./pages/relatorios/relatorios').then(m => m.RelatoriosComponent) },
      { path: 'motoristas', loadComponent: () => import('./pages/motoristas/motoristas.component').then(m => m.MotoristasComponent)},
      { path: 'clientes', loadComponent: () => import('./pages/clients/clients').then(m => m.ClientsComponent)},
      { path: 'aprovar-motoristas', loadComponent: () => import('./pages/approve-drivers/approve-drivers').then(m => m.ApproveDrivers)},
      { path: 'configuracoes', loadComponent: () => import('./pages/settings/settings').then(m => m.SettingsComponent)}
    ] 
  },
  {
    path: '',
    component: ClientLayout,
    children: [
      { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
      { path: 'viagens', loadComponent: () => import('./pages/viagens/viagens').then(m => m.Viagens), canActivate: [authGuard] },
      { path: 'motorista', loadComponent: () => import('./pages/motorista-page/motorista-page').then(m => m.MotoristaPage), canActivate: [authGuard, driverApprovedGuard] },
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];