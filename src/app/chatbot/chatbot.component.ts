import { Component, inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { initializeApp } from 'firebase/app';
import {
  VertexAI,
  getVertexAI,
  GenerativeModel,
  getGenerativeModel,
} from '@firebase/vertexai';
import { firebaseServices } from '../app.config';
import { CvDataService } from '../services/cv-data.service';
import { AuthService } from '../services/auth/auth.service';
import { ContactFormService, ContactFormStep, ContactFormState } from '../services/contact-form.service';

interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background-color: var(--background-dark);
        color: var(--text-primary);
      }

      .chat-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
        height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .chat-card {
        background-color: var(--background-card);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
        position: relative;
      }

      .back-button {
        position: absolute;
        top: 1rem;
        left: 1rem;
        background: transparent;
        border: none;
        color: var(--primary-color);
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        z-index: 10;
      }

      .back-button:hover {
        background-color: rgba(233, 30, 99, 0.1);
        transform: scale(1.1);
      }

      .icon-back {
        display: inline-block;
        width: 24px;
        height: 24px;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e91e63'%3E%3Cpath d='M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z'/%3E%3C/svg%3E");
        background-size: contain;
        background-repeat: no-repeat;
      }

      .chat-header {
        padding: 1.5rem;
        border-bottom: 1px solid var(--border-color);
        text-align: center;
        background-color: rgba(233, 30, 99, 0.05);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .chat-header h2 {
        color: var(--text-primary);
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
      }

      .chat-header p {
        color: var(--text-secondary);
        margin-bottom: 0;
      }

      .chat-header-content {
        flex-grow: 1;
        text-align: center;
      }

      .header-actions {
        display: flex;
        gap: 0.5rem;
      }

      .logout-button {
        background: transparent;
        border: 1px solid var(--primary-color);
        color: var(--primary-color);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
      }

      .logout-button:hover {
        background-color: var(--primary-color);
        color: white;
      }

      .profile-button {
        background: var(--primary-color);
        border: 1px solid var(--primary-color);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
      }

      .profile-button:hover {
        background-color: var(--primary-dark);
        transform: translateY(-2px);
      }

      .chat-content {
        flex: 1;
        overflow-y: auto;
        padding: 1.5rem;
        background-color: rgba(0, 0, 0, 0.1);
      }

      .messages {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .message {
        padding: 1rem 1.25rem;
        border-radius: 1rem;
        max-width: 80%;
        word-break: break-word;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        animation: fadeIn 0.3s ease-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .user-message {
        align-self: flex-end;
        background-color: var(--primary-color);
        color: white;
        border-bottom-right-radius: 0;
      }

      .bot-message {
        align-self: flex-start;
        background-color: rgba(255, 255, 255, 0.05);
        color: var(--text-primary);
        border-bottom-left-radius: 0;
        border: 1px solid var(--border-color);
      }

      .message-content {
        line-height: 1.5;
        white-space: pre-line;
      }

      .message-timestamp {
        font-size: 0.75rem;
        opacity: 0.7;
        text-align: right;
        margin-top: 0.5rem;
      }

      .chat-input {
        display: flex;
        padding: 1.25rem;
        gap: 1rem;
        align-items: center;
        border-top: 1px solid var(--border-color);
        background-color: var(--background-card);
      }

      .input-field {
        flex: 1;
        position: relative;
      }

      .input-field input {
        width: 100%;
        padding: 1rem 1.25rem;
        border-radius: 30px;
        border: 1px solid var(--border-color);
        background-color: rgba(255, 255, 255, 0.05);
        color: var(--text-primary);
        font-size: 1rem;
        transition: all 0.3s ease;
      }

      .input-field input:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(233, 30, 99, 0.2);
      }

      .input-field input::placeholder {
        color: var(--text-secondary);
        opacity: 0.7;
      }

      .suggested-prompts {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0 1.25rem;
        margin-bottom: 1rem;
        border-top: 1px solid var(--border-color);
        padding-top: 1rem;
      }
      
      .prompt-button {
        display: flex;
        align-items: center;
        padding: 0.75rem 1rem;
        background-color: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary);
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: left;
      }
      
      .prompt-button:hover {
        background-color: rgba(233, 30, 99, 0.1);
        border-color: var(--primary-color);
        transform: translateY(-2px);
      }
      
      .icon-code-prompt,
      .icon-contact-prompt,
      .icon-star-prompt {
        display: inline-block;
        width: 18px;
        height: 18px;
        margin-right: 8px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        opacity: 0.7;
      }
      
      .icon-code-prompt {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e91e63'%3E%3Cpath d='M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z'/%3E%3C/svg%3E");
      }
      
      .icon-contact-prompt {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e91e63'%3E%3Cpath d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'/%3E%3C/svg%3E");
      }
      
      .icon-star-prompt {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e91e63'%3E%3Cpath d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'/%3E%3C/svg%3E");
      }

      .send-button {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: var(--primary-color);
        color: white;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 10px rgba(233, 30, 99, 0.3);
      }

      .send-button:hover {
        transform: scale(1.1);
        background-color: var(--primary-light);
        box-shadow: 0 6px 15px rgba(233, 30, 99, 0.4);
      }

      .send-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: scale(1);
        box-shadow: none;
      }

      .icon-send {
        display: inline-block;
        width: 24px;
        height: 24px;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M2.01 21L23 12 2.01 3 2 10l15 2-15 2z'/%3E%3C/svg%3E");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }

      @media (max-width: 768px) {
        .chat-container {
          padding: 1rem;
          height: calc(100vh - 2rem);
        }

        .message {
          max-width: 90%;
        }

        .chat-header h2 {
          font-size: 1.3rem;
        }
        
        .suggested-prompts {
          padding: 0 0.75rem;
          padding-top: 0.75rem;
          margin-bottom: 0.75rem;
        }
        
        .prompt-button {
          padding: 0.625rem 0.75rem;
          font-size: 0.8rem;
        }
        
        .icon-code-prompt,
        .icon-contact-prompt,
        .icon-star-prompt {
          width: 16px;
          height: 16px;
          margin-right: 6px;
        }
      }
    `,
  ],
})
export class ChatbotComponent implements OnInit, OnDestroy {
  messages: ChatMessage[] = [
    {
      content: 'Hi! I\'m an AI assistant for Max\'s CV. How can I help you today? You can ask me about Max\'s skills, experience, or education, or if you\'d like to get in touch with Max, just let me know!',
      isUser: false,
      timestamp: new Date(),
    },
  ];

  currentMessage = '';
  isProcessing = false;
  private platformId = inject(PLATFORM_ID);
  private model: GenerativeModel | undefined;
  private vertexAI: VertexAI | undefined;
  private cvData: string = '';
  
  private contactFormState: ContactFormState | null = null;
  private contactFormSubscription: Subscription | null = null;
  private previousContactFormState: ContactFormState | null = null;

  constructor(
    private router: Router, 
    private cvDataService: CvDataService,
    private authService: AuthService,
    private contactFormService: ContactFormService
  ) {
    this.cvData = this.cvDataService.getCvDataAsString();
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        // Mock the AI functionality to avoid initialization errors with Vertex AI
        this.model = {
          generateContent: async (prompt: string) => {
            console.log('Generating content for prompt:', prompt);
            // Simulated response based on the prompt content
            return {
              response: {
                text: () => {
                  if (typeof prompt === 'string') {
                    const promptLower = prompt.toLowerCase();
                    
                    // Specific responses for suggested prompts
                    if (promptLower.includes('tell me about max and his experience as a developer')) {
                      return `Max is a passionate software developer with strong skills in multiple programming languages and frameworks. He has experience as a Junior Software Engineer at EaseFica where he worked on web development projects using Angular and .NET. He's also worked as an Assistant Teacher at Scope IT, teaching programming to grade 1-7 students, which demonstrates his ability to communicate complex technical concepts clearly. Max has a Bachelor of Computer Science in Application Development from Varsity College and is proficient in TypeScript, JavaScript, Python, Java, C#, C++, Kotlin, HTML, CSS, and SQL. He's also experienced with frameworks like Angular and .NET, and tools like Git, GitHub, VS Code, Visual Studio, IntelliJ, Azure, Firebase, and SSMS.`;
                    } 
                    else if (promptLower.includes('i want to contact max')) {
                      // Return an empty string since we'll handle the contact form directly
                      return ``;
                    } 
                    else if (promptLower.includes('what makes max standout')) {
                      return `Max stands out due to his combination of technical skills, teaching experience, and passion for problem-solving. His experience teaching programming to young students demonstrates excellent communication skills and patience. He has a strong foundation in both front-end and back-end technologies, making him a versatile full-stack developer. Max is particularly skilled in Angular and .NET development, and has experience with cloud platforms like Azure and Firebase. He's also committed to continuous learning and staying current with the latest technologies in the rapidly evolving field of software development.`;
                    }
                    // Original responses for other queries
                    else if (promptLower.includes('skills') || promptLower.includes('programming')) {
                      return `Max has strong skills in multiple programming languages including TypeScript, JavaScript, Python, Java, C#, C++, Kotlin, HTML, CSS, and SQL. He's also experienced with frameworks like Angular and .NET, and tools like Git, GitHub, VS Code, Visual Studio, IntelliJ, Azure, Firebase, and SSMS.`;
                    } else if (promptLower.includes('experience') || promptLower.includes('work')) {
                      return `Max has experience as an Assistant Teacher at Scope IT teaching grade 1-7 IT, as a Junior Software Engineer at EaseFica, and as a spot helper at SYSDBA where he installed and configured a server at E-Lab for Lancet Laboratories.`;
                    } else if (promptLower.includes('education')) {
                      return `Max has a Bachelor of Computer Science in Application Development from Varsity College (2025) and a Matric Certificate with Bachelor's Pass from St John's College (2016-2020).`;
                    } else if (promptLower.includes('contact') || promptLower.includes('email') || promptLower.includes('phone')) {
                      return `If you'd like to contact Max, I can help collect your information and he'll get back to you soon. Just let me know if you'd like to reach out to him.`;
                    } else if (promptLower.includes('accomplishments') || promptLower.includes('achievements')) {
                      return `Max has several accomplishments in sports, including being part of GLRU U/12 in 2014, being the most improved backline player at Pirates Rugby Club in 2018, and winning the club rugby league at Pirates Rugby Club in 2018.`;
                    } else {
                      return `I'd be happy to help answer questions about Max's skills, experience, education, or anything else on his CV. What specifically would you like to know?`;
                    }
                  } else {
                    return `I'd be happy to help answer questions about Max's skills, experience, education, or anything else on his CV. What specifically would you like to know?`;
                  }
                }
              }
            };
          }
        } as unknown as GenerativeModel;
        
        console.log('AI initialized successfully (mock mode)');
      } catch (error) {
        console.error('Error initializing mock AI:', error);
      }

      // Subscribe to contact form state changes
      this.contactFormSubscription = this.contactFormService.formState$.subscribe(state => {
        this.contactFormState = state;
        
        // Only show initial prompt when first activating the form
        const prevState = this.previousContactFormState;
        this.previousContactFormState = { ...state };
        
        if (state.isActive) {
          // Only show the initial prompt when starting the contact form
          const isInitialActivation = !prevState?.isActive && state.currentStep === ContactFormStep.Name;
          
          if (isInitialActivation) {
            const promptMessage = this.contactFormService.getPromptForCurrentStep();
            if (promptMessage) {
              this.addBotMessage(promptMessage);
            }
          }
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.contactFormSubscription) {
      this.contactFormSubscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logout().subscribe();
  }

  async sendMessage() {
    if (!this.currentMessage.trim() || this.isProcessing) {
      return;
    }

    this.isProcessing = true;
    const userMessage = this.currentMessage.trim();
    this.addUserMessage(userMessage);
    this.currentMessage = '';

    // Check if contact form is active
    if (this.contactFormState?.isActive) {
      this.processContactFormMessage(userMessage);
      return;
    }

    // Check for contact intent in the user message, but not if it's a suggested prompt
    // that we already handled in useSuggestedPrompt
    if (!userMessage.toLowerCase().includes('i want to contact max') && 
        this.detectContactIntent(userMessage)) {
      this.startContactForm();
      return;
    }

    try {
      // Regular chatbot AI response
      const response = await this.generateAIResponse(userMessage);
      
      // Don't add empty responses (like from the contact form prompt)
      if (response && response.trim().length > 0) {
        this.addBotMessage(response);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      this.addBotMessage(
        'I\'m sorry, I encountered an error processing your request. Please try again.'
      );
    } finally {
      this.isProcessing = false;
    }
  }

  private processContactFormMessage(userMessage: string) {
    const result = this.contactFormService.processUserInput(userMessage);
    
    // Always add the response
    if (result.response && result.response.trim().length > 0) {
      this.addBotMessage(result.response);
    }
    
    // Move to the next step if needed (but processUserInput now handles this internally)
    if (result.shouldUpdateStep) {
      this.contactFormService.nextStep();
    }
    
    this.isProcessing = false;
  }

  private startContactForm() {
    // Start the contact form - the form state subscription will display the first message
    this.contactFormService.startContactForm();
    this.isProcessing = false;
  }

  private detectContactIntent(message: string): boolean {
    const contactKeywords = [
      'contact', 'reach out', 'get in touch', 'talk to', 'speak with',
      'email', 'call', 'phone', 'message', 'connect with max'
    ];
    
    const messageLower = message.toLowerCase();
    return contactKeywords.some(keyword => messageLower.includes(keyword));
  }

  private async generateAIResponse(userMessage: string): Promise<string> {
    if (!this.model) {
      return 'AI model not available.';
    }

    // Create a prompt with context
    const prompt = `You are an AI assistant for Max's CV. Be friendly, professional, and concise in your responses.
    Here is the CV information:
    ${this.cvData}
    
    User question: ${userMessage}
    
    If the user wants to contact Max, let them know you can collect their information for Max to get in touch with them.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (error) {
      console.error('Error generating content:', error);
      return 'I apologize, but I encountered an error processing your request. Please try again.';
    }
  }

  private addUserMessage(content: string) {
    this.messages.push({
      content,
      isUser: true,
      timestamp: new Date(),
    });
    this.scrollToBottom();
  }

  private addBotMessage(content: string) {
    this.messages.push({
      content,
      isUser: false,
      timestamp: new Date(),
    });
    this.scrollToBottom();
  }

  private scrollToBottom() {
    setTimeout(() => {
      const chatContent = document.querySelector('.chat-content');
      if (chatContent) {
        chatContent.scrollTop = chatContent.scrollHeight;
      }
    }, 0);
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  goBack() {
    this.router.navigate(['/']);
  }

  useSuggestedPrompt(prompt: string): void {
    if (this.isProcessing) {
      return;
    }
    
    // If the prompt is about contacting Max, directly start the contact form
    // without sending it to the AI to avoid duplicate prompts
    if (prompt.toLowerCase().includes('contact max')) {
      this.isProcessing = true;
      this.addUserMessage(prompt);
      this.startContactForm();
      return;
    }
    
    this.currentMessage = prompt;
    this.sendMessage();
  }
  
  shouldShowSuggestedPrompts(): boolean {
    // Don't show prompts if the contact form is active or if processing a message
    if (this.contactFormState?.isActive || this.isProcessing) {
      return false;
    }
    
    // Only show prompts if there are just the welcome message or a few messages
    // This prevents cluttering the interface during an active conversation
    if (this.messages.length <= 3) {
      return true;
    }
    
    // Show prompts again if the last message was from the bot
    // and there's been some time since the last user message
    const lastMessage = this.messages[this.messages.length - 1];
    const secondLastMessage = this.messages.length >= 2 ? this.messages[this.messages.length - 2] : null;
    
    if (!lastMessage.isUser && 
        (!secondLastMessage || !secondLastMessage.isUser || 
         (Date.now() - secondLastMessage.timestamp.getTime() > 300000))) { // 5 minutes
      return true;
    }
    
    return false;
  }
}
