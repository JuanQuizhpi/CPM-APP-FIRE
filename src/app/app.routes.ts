import { Routes } from '@angular/router';
import HomeComponent from './pages/home/home.component';
import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';
import { LogInComponent } from './pages/auth/log-in/log-in.component';
import { authGuard, publicGuard } from './core/guards/auth.guard';
import { roleGuard, studentGuard, adminGuard } from './core/guards/role.guard';
import { LibroestudianteComponent } from './pages/studentrole/libroestudiante/libroestudiante.component';
import { PrestamoestudianteComponent } from './pages/studentrole/prestamoestudiante/prestamoestudiante.component';
import { PerfilestudianteComponent } from './pages/studentrole/perfilestudiante/perfilestudiante.component';
import { LibroadminComponent } from './pages/adminrole/libroadmin/libroadmin.component';
import { PrestamoadminComponent } from './pages/adminrole/prestamoadmin/prestamoadmin.component';
import { UsuarioadminComponent } from './pages/adminrole/usuarioadmin/usuarioadmin.component';
import { UnauthorizedComponent } from './pages/informative/unauthorized/unauthorized.component';
import { ActualizarlibroComponent } from './pages/adminrole/actualizarlibro/actualizarlibro.component';
import { CrearlibroComponent } from './pages/adminrole/crearlibro/crearlibro.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'librosEstudiante',
        component: LibroestudianteComponent,
        canActivate: [authGuard, studentGuard],
      },
      {
        path: 'prestamosEstudiante',
        component: PrestamoestudianteComponent,
        canActivate: [authGuard, studentGuard],
      },
      {
        path: 'perfilEstudiante',
        component: PerfilestudianteComponent,
        canActivate: [authGuard, studentGuard],
      },
      {
        path: 'librosAdmin',
        component: LibroadminComponent,
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'crearlibrosAdmin',
        component: CrearlibroComponent,
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'actualizarlibrosAdmin',
        component: ActualizarlibroComponent,
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'prestamosAdmin',
        component: PrestamoadminComponent,
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'usuariosAdmin',
        component: UsuarioadminComponent,
        canActivate: [authGuard, adminGuard],
      },
    ],
  },
  {
    path: 'auth',
    canActivate: [publicGuard],
    children: [
      {
        path: 'sign-up',
        component: SignUpComponent,
      },
      {
        path: 'log-in',
        component: LogInComponent,
      },
    ],
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
];
