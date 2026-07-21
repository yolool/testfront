import { Component, ViewChild, ElementRef, inject, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SignaturePad from 'signature_pad';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';



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

  constructor(private fb: FormBuilder, private http: HttpClient) {
  
    this.form = this.fb.group({
      check: [false],
      name: ['', Validators.required],
      teid: ['', Validators.required],
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

generatePdf() {

  const pages = document.querySelectorAll('.page');
  const buttons = document.querySelectorAll('.no-print');


  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  if (this.signaturePad.isEmpty()) {
    this.signture = true;
    return;
  } else {
    this.signture = false;
  }


  buttons.forEach(btn => {
    (btn as HTMLElement).style.display = 'none';
  });


  const pdf = new jsPDF('p', 'mm', 'a4');


  let promises: Promise<void>[] = [];


  pages.forEach((page, index) => {

    promises.push(

      html2canvas(page as HTMLElement, {
        scale: 2,
        useCORS: true
      }).then(canvas => {


        const imgData = canvas.toDataURL('image/png');


        const imgWidth = 210;
        const imgHeight =
          (canvas.height * imgWidth) / canvas.width;


        if (index !== 0) {
          pdf.addPage();
        }


        pdf.addImage(
          imgData,
          'PNG',
          0,
          0,
          imgWidth,
          imgHeight
        );

      })

    );

  });


  Promise.all(promises).then(() => {


    const blob = pdf.output('blob');


    const formData = new FormData();

    formData.append(
      'pdf',
      blob,
      'Engagement.pdf'
    );


    this.http.post(
      "http://localhost:3000/send-email",
      formData
    ).subscribe({

      next: () => {
        console.log("Email envoyé avec succès");
      },

      error: err => {
        console.log(err);
      }

    });


    this.router.navigate(['/Dashboard'], {
      queryParams: {
        type: 'PersonelLaboTE',
        msg: 'signed'
      }
    });


    buttons.forEach(btn => {
      (btn as HTMLElement).style.display = 'block';
    });


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