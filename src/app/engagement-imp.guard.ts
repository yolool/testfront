import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './service/auth.service';
import { map } from 'rxjs';

export const engagementImpGuard: CanActivateFn = (route, state) => {
  const authserv = inject(AuthService);
  const router = inject(Router);
   
  return authserv.checkrole().pipe(
    map((data: any) => {
      console.log('Guard data:', data);

      const userRole = data.authorities?.[0]?.authority;

      console.log('Role:', userRole);

      if (userRole === 'LABO') {
        return true;
      }

      router.navigate(['/']);
      return false;
    })
  );
};