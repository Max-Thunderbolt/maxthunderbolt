import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  // For demonstration purposes, we're using EmailJS as a service
  // In production, you might want to set up a Firebase Cloud Function or use another service
  private readonly emailServiceUrl = 'https://api.emailjs.com/api/v1.0/email/send';
  private readonly serviceId = 'your_emailjs_service_id';  // Replace with your EmailJS service ID
  private readonly templateId = 'your_emailjs_template_id'; // Replace with your EmailJS template ID
  private readonly userId = 'your_emailjs_user_id'; // Replace with your EmailJS user ID

  constructor(private http: HttpClient) { }

  sendContactForm(formData: ContactFormData): Observable<any> {
    const payload = {
      service_id: this.serviceId,
      template_id: this.templateId,
      user_id: this.userId,
      template_params: {
        from_name: formData.name,
        reply_to: formData.email,
        phone: formData.phone || 'Not provided',
        message: formData.message,
        subject: formData.subject || 'New Contact Form Submission'
      }
    };

    return this.http.post(this.emailServiceUrl, payload)
      .pipe(
        tap(() => console.log('Email sent successfully')),
        catchError(error => {
          console.error('Error sending email:', error);
          return of(error);
        })
      );
  }
  
  // This method can be called to simulate sending an email during development
  // without actually sending real emails
  simulateSendContactForm(formData: ContactFormData): Observable<any> {
    console.log('Simulating sending email with data:', formData);
    // Simulate a delay and successful response
    return of({ success: true, message: 'Email simulated successfully' })
      .pipe(
        tap(() => {
          console.log('Email simulation completed.');
        })
      );
  }
} 