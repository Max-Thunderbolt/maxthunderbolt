import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EmailService, ContactFormData } from './email/email.service';

export enum ContactFormStep {
  Inactive = 'inactive',
  Name = 'name',
  Email = 'email',
  Phone = 'phone',
  Message = 'message',
  Confirmation = 'confirmation',
  Complete = 'complete'
}

export interface ContactFormState {
  isActive: boolean;
  currentStep: ContactFormStep;
  formData: ContactFormData;
}

@Injectable({
  providedIn: 'root'
})
export class ContactFormService {
  private formState = new BehaviorSubject<ContactFormState>({
    isActive: false,
    currentStep: ContactFormStep.Inactive,
    formData: {
      name: '',
      email: '',
      phone: '',
      message: '',
      subject: 'Contact Request from Website Chatbot'
    }
  });

  public formState$ = this.formState.asObservable();

  constructor(private emailService: EmailService) { }

  startContactForm(): void {
    this.formState.next({
      isActive: true,
      currentStep: ContactFormStep.Name,
      formData: {
        name: '',
        email: '',
        phone: '',
        message: '',
        subject: 'Contact Request from Website Chatbot'
      }
    });
  }

  cancelContactForm(): void {
    this.formState.next({
      isActive: false,
      currentStep: ContactFormStep.Inactive,
      formData: {
        name: '',
        email: '',
        phone: '',
        message: '',
        subject: 'Contact Request from Website Chatbot'
      }
    });
  }

  updateFormData(field: keyof ContactFormData, value: string): void {
    const currentState = this.formState.value;
    
    this.formState.next({
      ...currentState,
      formData: {
        ...currentState.formData,
        [field]: value
      }
    });
  }

  nextStep(): void {
    const currentState = this.formState.value;
    let nextStep: ContactFormStep;

    switch (currentState.currentStep) {
      case ContactFormStep.Name:
        nextStep = ContactFormStep.Email;
        break;
      case ContactFormStep.Email:
        nextStep = ContactFormStep.Phone;
        break;
      case ContactFormStep.Phone:
        nextStep = ContactFormStep.Message;
        break;
      case ContactFormStep.Message:
        nextStep = ContactFormStep.Confirmation;
        break;
      case ContactFormStep.Confirmation:
        nextStep = ContactFormStep.Complete;
        break;
      default:
        nextStep = ContactFormStep.Inactive;
    }

    this.formState.next({
      ...currentState,
      currentStep: nextStep
    });
  }

  previousStep(): void {
    const currentState = this.formState.value;
    let previousStep: ContactFormStep;

    switch (currentState.currentStep) {
      case ContactFormStep.Email:
        previousStep = ContactFormStep.Name;
        break;
      case ContactFormStep.Phone:
        previousStep = ContactFormStep.Email;
        break;
      case ContactFormStep.Message:
        previousStep = ContactFormStep.Phone;
        break;
      case ContactFormStep.Confirmation:
        previousStep = ContactFormStep.Message;
        break;
      default:
        previousStep = currentState.currentStep;
    }

    this.formState.next({
      ...currentState,
      currentStep: previousStep
    });
  }

  submitContactForm(): Observable<any> {
    // In production, use the actual email service
    // return this.emailService.sendContactForm(this.formState.value.formData);
    
    // For development, use the simulation
    return this.emailService.simulateSendContactForm(this.formState.value.formData);
  }

  completeContactForm(): void {
    const currentState = this.formState.value;
    this.formState.next({
      ...currentState,
      currentStep: ContactFormStep.Complete
    });
  }

  resetContactForm(): void {
    this.formState.next({
      isActive: false,
      currentStep: ContactFormStep.Inactive,
      formData: {
        name: '',
        email: '',
        phone: '',
        message: '',
        subject: 'Contact Request from Website Chatbot'
      }
    });
  }

  // Helper methods for the chatbot
  getPromptForCurrentStep(): string {
    const currentState = this.formState.value;
    
    switch (currentState.currentStep) {
      case ContactFormStep.Name:
        return "I'd be happy to help you get in touch with Max. What is your name?";
      case ContactFormStep.Email:
        return "What is your email address where I can reach you?";
      case ContactFormStep.Phone:
        return "What is your phone number? (optional, you can type 'skip' to continue)";
      case ContactFormStep.Message:
        return "Please describe how Max can help you:";
      case ContactFormStep.Confirmation:
        return `Thank you! Here's what I'll send to Max:\n\nName: ${currentState.formData.name}\nEmail: ${currentState.formData.email}\nPhone: ${currentState.formData.phone || 'Not provided'}\nMessage: ${currentState.formData.message}\n\nIs this correct? (yes/no)`;
      case ContactFormStep.Complete:
        return "Your contact information has been sent! Max will get back to you soon. Is there anything else I can help you with?";
      default:
        return "";
    }
  }

  processUserInput(input: string): { response: string, shouldUpdateStep: boolean } {
    const currentState = this.formState.value;
    let response = '';
    let shouldUpdateStep = true;
    
    switch (currentState.currentStep) {
      case ContactFormStep.Name:
        if (input.trim().length < 2) {
          response = "Please enter a valid name.";
          shouldUpdateStep = false;
        } else {
          this.updateFormData('name', input.trim());
          response = `Thanks, ${input.trim()}! What is your email address where I can reach you?`;
          this.nextStep();
          shouldUpdateStep = false;
        }
        break;
        
      case ContactFormStep.Email:
        if (!this.isValidEmail(input.trim())) {
          response = "That doesn't look like a valid email address. Please enter a valid email.";
          shouldUpdateStep = false;
        } else {
          this.updateFormData('email', input.trim());
          response = "Thanks for your email. What is your phone number? (optional, you can type 'skip' to continue)";
          this.nextStep();
          shouldUpdateStep = false;
        }
        break;
        
      case ContactFormStep.Phone:
        if (input.toLowerCase().trim() === 'skip') {
          this.updateFormData('phone', 'Not provided');
          response = "That's fine! Please describe how Max can help you:";
          this.nextStep();
          shouldUpdateStep = false;
        } else if (!this.isValidPhone(input.trim()) && input.trim() !== '') {
          response = "That doesn't look like a valid phone number. Please enter a valid number or type 'skip'.";
          shouldUpdateStep = false;
        } else {
          this.updateFormData('phone', input.trim());
          response = "Thanks! Please describe how Max can help you:";
          this.nextStep();
          shouldUpdateStep = false;
        }
        break;
        
      case ContactFormStep.Message:
        if (input.trim().length < 5) {
          response = "Please provide a bit more detail about your request.";
          shouldUpdateStep = false;
        } else {
          this.updateFormData('message', input.trim());
          response = `Thank you! Here's what I'll send to Max:\n\nName: ${currentState.formData.name}\nEmail: ${currentState.formData.email}\nPhone: ${currentState.formData.phone || 'Not provided'}\nMessage: ${input.trim()}\n\nIs this correct? (yes/no)`;
          this.nextStep();
          shouldUpdateStep = false;
        }
        break;
        
      case ContactFormStep.Confirmation:
        if (input.toLowerCase().includes('yes') || input.toLowerCase().includes('correct')) {
          this.submitContactForm().subscribe({
            next: () => {
              this.completeContactForm();
            },
            error: (error) => {
              response = "I'm sorry, there was an error sending your information. Please try again later.";
              shouldUpdateStep = false;
            }
          });
          response = "Great! I'm sending your information to Max now. He'll get back to you soon! Is there anything else I can help you with?";
          shouldUpdateStep = false;
        } else if (input.toLowerCase().includes('no') || input.toLowerCase().includes('wrong')) {
          this.previousStep();
          response = "Let's fix that. What message would you like to send to Max?";
          shouldUpdateStep = false;
        } else {
          response = "Please confirm if the information is correct by typing 'yes' or 'no'.";
          shouldUpdateStep = false;
        }
        break;
        
      case ContactFormStep.Complete:
        this.resetContactForm();
        response = "Is there anything else I can help you with?";
        shouldUpdateStep = false;
        break;
        
      default:
        response = "I'm not sure how to process that.";
        shouldUpdateStep = false;
    }
    
    return { response, shouldUpdateStep };
  }

  // Validation helpers
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    // Allow various phone formats, including international
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
  }
} 