import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';


export const roleGuard: CanActivateFn = (route) =>{
    const router = inject(Router);
    const authService= inject(AuthService);
    const requiredRole = route.data?.['role'] as 'admin' | 'student';

    return authService.authState$.pipe(
        map((user)=>{
            if(!user){
                router.navigateByUrl('auth/log-in');
                return false;
            }

            const email = user.email ||'';
            const userRole = authService.getUserRole(email);

            if(userRole === requiredRole){
                return true;
            }
            router.navigateByUrl('/unauthorized');
            return false;
        })
    );
};

export const routerInjection = () => inject(Router);

export const authStateObs$ = () => inject(AuthService).authState$;

export const studentGuard: CanActivateFn = () => {
  const router = routerInjection();
  const authService = inject(AuthService);

  return authStateObs$().pipe(
    map((user) => {
      if (user && authService.getUserRole(user.email || '') === 'student') {
        return true;
      }
      router.navigateByUrl('/unauthorized'); // Ruta de acceso denegado
      return false;
    })
  );
};

export const adminGuard: CanActivateFn = () => {
  const router = routerInjection();
  const authService = inject(AuthService);

  return authStateObs$().pipe(
    map((user) => {
      if (user && authService.getUserRole(user.email || '') === 'admin') {
        return true;
      }
      router.navigateByUrl('/unauthorized'); // Ruta de acceso denegado
      return false;
    })
  );
};

