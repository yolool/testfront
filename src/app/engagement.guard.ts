import { CanActivateFn , Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './service/auth.service';
export const engagementGuard: CanActivateFn = (route, state) => {
   const authserv = inject(AuthService)
  const router = inject(Router)
  let role = ''
 
  
  if( sessionStorage.getItem("type")!== "guest"){
  authserv.checkrole().subscribe(
          {next :(data:any) =>
          {
             role=data.authorities[0].authority
          }
        }
        )
        if(role !== 'LABO'){
          return true
        }
  }else{
     role = 'guest'
     return true
  }
  router.navigate(["/Dashboard"])
  return false;
  
 
};
