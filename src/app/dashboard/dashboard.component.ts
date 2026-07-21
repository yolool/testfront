import { Component, inject, OnInit, } from '@angular/core';
import { ActivatedRoute, RouterLink,Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  router = inject(Router)
  constructor(private route : ActivatedRoute){}
  type=''
  showexpand = false
  showcollapse = true
  sign=false
   ngOnInit(): void {
       this.route.queryParams.subscribe(params => {
        if(params['type'] === 'guest'){
          this.type= 'guest'
        }else if(params['type'] === 'PersonelLaboTE'){
          this.type = 'PersonelLaboTE'
        }else if(params['type'] === 'AutrePersonelTE'){
          this.type = 'AutrePersonelTE'
        }else{
          this.router.navigate(['/404'])

        }
       if(params['msg'] === 'signed'){
        this.sign = true

       }
      
     })
   }
   
   collapse(){
    this.showcollapse=true
     this.showexpand = false
   }
   
   extand(){
     this.showcollapse=false
     this.showexpand = true
   }
   

}
