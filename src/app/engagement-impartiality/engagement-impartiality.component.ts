import { Component, ViewChild, ElementRef, inject, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SignaturePad from 'signature_pad';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EngagementService } from '../service/engagement.service';



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

  constructor(private fb: FormBuilder, private http: HttpClient , private engagementServ:EngagementService) {
  
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

async generatePdf(): Promise<void> {
 
  if (this.signaturePad.isEmpty() || this.form.invalid) {
    this.signture = true;
    this.form.markAllAsTouched();
    return
    
  }
  

 

  this.signture = false;

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


      const imgHeight =
        (canvas.height * pageWidth) / canvas.width;


      if (i > 0) {
        pdf.addPage();
      }


      const finalHeight = Math.min(imgHeight, pageHeight);


      pdf.addImage(
        imgData,
        'PNG',
        0,
        0,
        pageWidth,
        finalHeight
      );
    }


    const blob = pdf.output('blob');


    const pdfFile = new File(
      [blob],
      'Engagement.pdf',
      {
        type: 'application/pdf'
      }
    );


    const subject =
      `Engagement d’impartialité et de confidentialité  - ${this.form.value.name}`;
    const idte = this.form.get('teid')?.value


    this.engagementServ
      .uploadEngagement(pdfFile, subject , idte)
      .subscribe({

        next: (response) => {

            this.router.navigate(['/Dashboard'])
        },
        error: (err) => {
          console.error(
            'Failed to upload PDF:',
            err
          );
        }

      });


  } catch(error) {

    console.error(
      "PDF generation error:",
      error
    );

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