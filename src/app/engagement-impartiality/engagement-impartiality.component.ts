import { Component, ViewChild, ElementRef, inject, signal, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SignaturePad from 'signature_pad';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { EngagementService } from '../service/engagement.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-engagement-impartiality',
  imports: [ReactiveFormsModule , DatePipe],
  templateUrl: './engagement-impartiality.component.html',
  styleUrl: './engagement-impartiality.component.css'
})
export class EngagementImpartialityComponent {

 @ViewChild('signatureCanvas') canvas!: ElementRef<HTMLCanvasElement>;

  router = inject(Router);
  signaturePad!: SignaturePad;
  showbtn = false;
  form: FormGroup;
  date: Date = new Date();
  signture = false;
  errorMessage = signal<string | null>(null);
  isLoading = signal<boolean>(false);
  successMessage = signal<string | null>(null);

  constructor(private fb: FormBuilder, private engagementServ:EngagementService) {
  
    this.form = this.fb.group({
      check: [false],
      name: ['', Validators.required],
      teid: ['',Validators.required],
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
    return;
  }

  this.isLoading.set(true);

  

  const buttons = document.querySelectorAll('.no-print');
  buttons.forEach(btn => {
    (btn as HTMLElement).style.display = 'none';
  });

  try {
    const pages = document.querySelectorAll('.page');
    const pdf = new jsPDF('p', 'mm', 'a4');

    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(
        pages[i] as HTMLElement,
        {
          scale: 2,
          useCORS: true,
          logging: false
        }
      );

      const imgData = canvas.toDataURL('image/png');
      const pageWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      if (i > 0) {
        pdf.addPage();
      }

      const finalHeight = Math.min(imgHeight, pageHeight);
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, finalHeight);
    }

    const blob = pdf.output('blob');
    const pdfFile = new File([blob], 'Engagement.pdf', { type: 'application/pdf' });

    const subject = `Engagement d'impartialité et de confidentialité - ${this.form.value.name}`;
    const idte = this.form.get('teid')?.value;

    this.engagementServ.uploadEngagement(pdfFile, subject, idte).subscribe({
      next: () => {
        
        this.isLoading.set(false);
        this.successMessage.set('Document submitted successfully!');
        setTimeout(() => {
          this.router.navigate(['/Dashboard']);
        }, 1500);
      },
      error: (err: HttpErrorResponse) => {
           this.form.get('check')?.enable()
        this.isLoading.set(false);
        this.errorMessage.set(this.getErrorMessage(err));
      }
    });

  } catch(error) {
    this.isLoading.set(false);
    this.errorMessage.set('Failed to generate PDF. Please try again.');
  } finally {
    buttons.forEach(btn => {
      (btn as HTMLElement).style.display = 'block';
    });
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