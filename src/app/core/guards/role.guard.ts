import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';
import { user } from '@angular/fire/auth';

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
