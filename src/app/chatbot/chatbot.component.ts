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
  styleUrls: ['./chatbot.scss']
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
