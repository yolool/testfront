import { Component, ViewChild, ElementRef, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SignaturePad from 'signature_pad';
import {  Router } from '@angular/router';
import { EngagementService } from '../service/engagement.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-engagement-form',
  imports: [ReactiveFormsModule ],
  templateUrl: './engagement-form.component.html',
  styleUrl: './engagement-form.component.css'
})
export class EngagementFormComponent {
@ViewChild('signatureCanvas')
  canvas!: ElementRef<HTMLCanvasElement>;
  type : any
  router = inject(Router)
signaturePad!: SignaturePad;
 showbtn=false
 form: FormGroup;
 date:Date = new Date
 signture=false
 errorMessage = signal<string | null>(null);
 isLoading = signal<boolean>(false);
 successMessage = signal<string | null>(null);


 ngOnInit(){
  this.type = sessionStorage.getItem('type')
 
   if(this.type !== 'guest'){
       this.form.get('teid')?.setValidators([Validators.required])
      this.form.get('teid')?.updateValueAndValidity()
      
   }   

 }

  constructor(private fb: FormBuilder , private engagementServ:EngagementService){
    
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

  private getErrorMessage(err: HttpErrorResponse): string {
    return 'ID personnel not found';
  }

 async generatePdf(): Promise<void> {
   this.form.get('check')?.disable()
   this.errorMessage.set(null);
   this.successMessage.set(null);
   
   if (this.signaturePad.isEmpty() || this.form.invalid) {
       this.signture = true;
       this.form.markAllAsTouched();
      return ;
    }

    this.isLoading.set(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const content = document.getElementById('pdfContent');
      if (!content) return;

      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);

      const pdfBlob = pdf.output('blob');
      const pdfFile = new File([pdfBlob], 'Engagement.pdf', { type: 'application/pdf' });
      
      const subject = `Engagement de confidentialité - ${this.form.value.name}`;
      let id = ''
      if(this.type !== 'guest'){
         id = this.form.get('teid')?.value
      }

      this.engagementServ.uploadEngagement(pdfFile, subject, id).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.successMessage.set('Document submitted successfully!');
          setTimeout(() => {
            if(this.type === 'guest'){
              this.router.navigate(['/']);
              sessionStorage.setItem('msg' , response.statut)
            }else{
              this.router.navigate(['/Dashboard'])
            }
          }, 1500);
        },
        error: (err: HttpErrorResponse) => {
          this.form.get('check')?.enable()
          this.isLoading.set(false);
          this.errorMessage.set(this.getErrorMessage(err));
        }
      });

    } catch (error) {
      this.isLoading.set(false);
      this.errorMessage.set('Failed to generate PDF. Please try again.');
    }
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