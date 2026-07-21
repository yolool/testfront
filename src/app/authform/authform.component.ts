import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup,Validators,ReactiveFormsModule} from '@angular/forms';
import { ActivatedRoute , Router } from '@angular/router';

@Component({
  selector: 'app-authform',
  imports: [ReactiveFormsModule,],
  templateUrl: './authform.component.html',
  styleUrl: './authform.component.css'
})
export class AuthformComponent {
  router= inject(Router)
  showdep=false
  form:FormGroup

  constructor(private route:ActivatedRoute , private fb:FormBuilder){
    this.form = this.fb.group({
      idte:['',Validators.required],
      dep:[''],
    });
  }
   

  ngOnInit(){
    this.route.queryParams.subscribe(params=>{
       if(params['as']==='AutrePersonelTE'){
        this.showdep=true
        this.form.get('dep')?.setValidators(Validators.required);

       }else if(params['as']==='PersonelLaboTE'){
         this.showdep=false
       }else{
         this.router.navigate(['/404'])
       }
    })

    

     this.form.get('dep')?.updateValueAndValidity(); 
  
  }
  OnSubmit(){
     if (this.form.invalid) {
    this.form.markAllAsTouched();
    return ;
    
  }
    if(this.showdep === true){
      
      this.router.navigate(['/Dashboard'],{
              queryParams:{type: 'AutrePersonelTE'}
      })
    }else if(this.showdep === false){
          this.router.navigate(['/Dashboard'],{
              queryParams:{type: 'PersonelLaboTE'}
      })
    }
  }

}
