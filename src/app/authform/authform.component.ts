  import { Component, inject,signal } from '@angular/core';
  import { FormBuilder, FormGroup,Validators,ReactiveFormsModule} from '@angular/forms';
  import { ActivatedRoute , Router } from '@angular/router';
  import { AuthService } from '../service/auth.service';
  import { DepartementDto, PersonnelService } from '../service/personnel.service';

  @Component({
    selector: 'app-authform',
    imports: [ReactiveFormsModule, ],
    templateUrl: './authform.component.html',
    styleUrl: './authform.component.css'
  })
  export class AuthformComponent {
    router= inject(Router)
    deps:DepartementDto[] = []
    showdep=false
    form:FormGroup
    as:any
    errorMessage = signal<string | null>(null);
    isLoading = signal<boolean>(false);

    ngOnInit(){
          this.as = sessionStorage.getItem('as') 
        if(this.as=== 'AutrePersonelTE'){
              this.showdep = true
        }else if(this.as === 'PersonelLaboTE'){
              this.showdep = false


        } 
        this.personelserv.getdeps().subscribe(
          {
            next: (data) =>{
              this.deps = data
            },
            complete : () =>{

            },
            error: (err) =>{
              console.error(err)
            }
                  }
        )
          


      if(this.showdep === true){
        this.form.get('dep')?.setValidators([Validators.required])
        this.form.get('dep')?.updateValueAndValidity
        
      }else if(this.showdep === false){
        this.form.get('dep')?.setValue('LABO')
          
      }

      
    }

    constructor(private route:ActivatedRoute , private fb:FormBuilder , private Authserv:AuthService ,private personelserv:PersonnelService){
      this.form = this.fb.group({
        idPersonnel:['',Validators.required],
        dep:[''],
      });
    }
    

    OnSubmit(){
      if (this.form.invalid) {
      this.form.markAllAsTouched();
      return ;
      
    }
      this.isLoading.set(true)
      this.errorMessage.set(null)
      const credentials = this.form.getRawValue();

      this.Authserv.login(credentials).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/Dashboard']);
          sessionStorage.setItem('id',this.form.get('idPersonnel')?.value)
          sessionStorage.setItem('logout', 'true')
        },
        error: (err) => {
          this.isLoading.set(false);
          if (err.status === 401 || err.status === 400) {
            this.errorMessage.set('Invalid Personnel ID or Department.');
          } else {
            this.errorMessage.set('An error occurred. Please try again later.');
          }
        }
      });

    
    }

  }
