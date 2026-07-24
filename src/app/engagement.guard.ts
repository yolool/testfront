import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './service/auth.service';
import { map } from 'rxjs';

export const engagementGuard: CanActivateFn = (route, state) => {

  const authserv = inject(AuthService);
  const router = inject(Router);

  const type = sessionStorage.getItem("type");

  if (type === "guest") {
    return true;
  }

  return authserv.checkrole().pipe(
    map((data: any) => {

      const role = data.authorities?.[0]?.authority;

      if (role !== 'LABO') {
        return true;
      }

       router.navigate(['/Dashboard']);
      return false;
    })
  );
};