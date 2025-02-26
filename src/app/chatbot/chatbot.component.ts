import { Component, inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import {
  VertexAI,
  getVertexAI,
  GenerativeModel,
  getGenerativeModel,
} from 'firebase/vertexai';
import { firebaseServices } from '../app.config';
import { CvDataService } from '../services/cv-data.service';

interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template:/*html */`
    <div class="chat-container">
      <div class="chat-card">
        <button class="back-button" (click)="goBack()">
          <i class="icon-back"></i>
        </button>
        <div class="chat-header">
          <h2>Chat with AI Assistant</h2>
          <p>Ask me anything about the CV</p>
        </div>

        <div class="chat-content">
          <div class="messages">
            <div
              *ngFor="let message of messages"
              class="message"
              [ngClass]="{
                'user-message': message.isUser,
                'bot-message': !message.isUser
              }"
            >
              <div class="message-content">
                {{ message.content }}
              </div>
              <div class="message-timestamp">
                {{ message.timestamp | date : 'shortTime' }}
              </div>
            </div>
          </div>
        </div>

        <div class="chat-input">
          <div class="input-field">
            <input
              [(ngModel)]="currentMessage"
              (keyup.enter)="sendMessage()"
              placeholder="Type your message..."
            />
          </div>
          <button class="send-button" (click)="sendMessage()">
            <i class="icon-send"></i>
          </button>
        </div>
      </div>
    </div>
  `,
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
      }
    `,
  ],
})
export class ChatbotComponent implements OnInit {
  messages: ChatMessage[] = [
    {
      content:
        "Hello! I'm an AI assistant. How can I help you learn more about Max's CV?",
      isUser: false,
      timestamp: new Date(),
    },
  ];
  currentMessage = '';
  private platformId = inject(PLATFORM_ID);
  private model: GenerativeModel | undefined;
  private vertexAI: VertexAI | undefined;
  private cvData: string = '';

  constructor(private router: Router, private cvDataService: CvDataService) {
    this.cvData = this.cvDataService.getCvDataAsString();
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const app = initializeApp(firebaseServices.getConfig());
        this.vertexAI = getVertexAI(app);
        this.model = getGenerativeModel(this.vertexAI, {
          model: 'gemini-2.0-flash',
        });
      } catch (error) {
        console.error('Error initializing Firebase:', error);
      }
    }
  }

  async sendMessage() {
    if (!this.currentMessage.trim()) return;

    // Add user message
    this.messages.push({
      content: this.currentMessage,
      isUser: true,
      timestamp: new Date(),
    });

    if (isPlatformBrowser(this.platformId) && this.model) {
      try {
        // Create a prompt that includes the CV data as context
        const prompt = `
You are an AI assistant for Max van der Walt. You are helping users learn more about Max's CV and professional experience.
Please answer the following question based on Max's CV information:

${this.currentMessage}

Here is Max's CV information for reference:
${this.cvData}

Please provide a helpful, accurate, and concise response based only on the information in the CV.
`;

        // Generate response using Gemini with the CV data as context
        const result = await this.model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Add AI response
        this.messages.push({
          content: text,
          isUser: false,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error('Error generating response:', error);
        this.messages.push({
          content:
            'I apologize, but I encountered an error processing your request.',
          isUser: false,
          timestamp: new Date(),
        });
      }
    } else {
      // Add a message when model is not available
      this.messages.push({
        content: 'Chat functionality is not available in this environment.',
        isUser: false,
        timestamp: new Date(),
      });
    }

    this.currentMessage = '';
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
