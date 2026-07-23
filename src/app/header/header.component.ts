import { Component, inject, Input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  route = inject(Router)
  
  login = false
  constructor(private authserv:AuthService){

  }
  
   ngOnInit(){
    this.authserv.checkSession().subscribe(
     { next: (data)=>this.login = data }
    )
  }
  

      Logout(){
       sessionStorage.clear()
       this.authserv.logout().subscribe({
        error : (err)=>{
               console.log(err)
        }
       })
        this.route.navigate(['/'])
     }

  
  
  
}
