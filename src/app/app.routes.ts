import { Routes } from '@angular/router';
import HomeComponent from './pages/home/home.component';
import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';
import { LogInComponent } from './pages/auth/log-in/log-in.component';
import { authGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '', component:HomeComponent,
    canActivate:[authGuard]
  },
  {
    path: 'auth',
    canActivate:[publicGuard],
    children: [
      {
        path: 'sign-up',component:SignUpComponent
      },
      {
        path: 'log-in',component:LogInComponent
      },
    ],
  },
];
