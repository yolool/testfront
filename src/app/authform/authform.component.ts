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
