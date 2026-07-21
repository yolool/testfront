import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SignaturePad from 'signature_pad';
import { DatePipe } from '@angular/common';
import {  Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-engagement-form',
  imports: [ReactiveFormsModule ],
  templateUrl: './engagement-form.component.html',
  styleUrl: './engagement-form.component.css'
})
export class EngagementFormComponent {
@ViewChild('signatureCanvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  router = inject(Router)
signaturePad!: SignaturePad;
 showbtn=false
 form: FormGroup;
 date:Date = new Date
 signture=false


  constructor(private fb: FormBuilder , private http:HttpClient){
    
    this.form = this.fb.group({
      check:[false],
      name:['',Validators.required],
      role:['',Validators.required],
      company:['',Validators.required],
      teid:[''],
      city:['',Validators.required],
      date:[{value: this.date.getDate() + '/' + '0'+(this.date.getMonth()+1) + '/' + this.date.getFullYear(),disabled:true}]

    });
         
    
  }
 
    
  verfiecheck(){
        if(this.form.get('check')?.value === true){
        this.showbtn=true
         }else if(this.form.get('check')?.value === false){
      this.showbtn=false
    }
  }

 generatePdf(){

    const content = document.getElementById('pdfContent');

    const buttons = document.querySelectorAll('.no-print');

   
     if (this.form.invalid) {
    this.form.markAllAsTouched();
    return ;
    
  }

  if (this.signaturePad.isEmpty()) {
    this.signture=true
    return ;
  }else{
     this.signture=false
  }
    buttons.forEach(btn=>{
        (btn as HTMLElement).style.display='none';
    });


    html2canvas(content!, {
        scale:2
    }).then(canvas=>{


        const pdf = new jsPDF('p','mm','a4');

        const img = canvas.toDataURL('image/png');


        pdf.addImage(
            img,
            'PNG',
            0,
            0,
            210,
            297
        );


        //pdf.save('Engagement.pdf');
         this.router.navigate(['/Dashboard'],{
              queryParams:{type: 'guest' ,msg:'signed'}
            })
        const blo =pdf.output('blob')
        const formData = new FormData();
        formData.append('pdf', blo, 'Engagement.pdf');
        this.http.post(
            "http://localhost:3000/send-email",
            formData
        ).subscribe({

            next: () => {

                console.log("Email envoyé avec succès.");

            },

            error: err => {

                console.log(err);

            }

        });

    });



        buttons.forEach(btn=>{
            (btn as HTMLElement).style.display='block';
        
          
        });


  

}
 ngAfterViewInit() {

    setTimeout(() => {

      const canvas = this.canvas.nativeElement;

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      this.signaturePad = new SignaturePad(canvas);

      
    }, 100);

  }



clearSignature() {
  this.signaturePad.clear();
}
}
