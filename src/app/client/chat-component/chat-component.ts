import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../core/services/chatbot.service';
import { ChatMessage } from '../../core/models/chat.model';

@Component({
  selector: 'app-chat-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-component.html',
  styleUrls: ['./chat-component.scss'],
})
export class ChatComponent implements OnInit {
  messages: ChatMessage[] = [];
  newMessage: string = '';
  userId: string = '';

  constructor(private chatService: ChatService) {
    this.userId = localStorage.getItem('access_token') || 'guest';
  }

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.chatService.getChatHistory(this.userId).subscribe({
      next: (res) => {
        console.log('📜 History:', res);

        this.messages = res.map((msg: any) => ({
          sender: msg.role === 'assistant' ? 'bot' : 'user',
          text: msg.content,
        }));
      },
      error: (err) => {
        console.error('❌ History load error:', err);
      },
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    // user message
    const userMsg: ChatMessage = { sender: 'user', text: this.newMessage };
    this.messages.push(userMsg);

    const thinkingMsg: ChatMessage = { sender: 'bot', text: 'Thinking...' };
    this.messages.push(thinkingMsg);

    const currentIndex = this.messages.length - 1;

    this.chatService.chat(this.userId, this.newMessage).subscribe({
      next: (res) => {
        console.log('✅ Chat API response:', res);

        const replyText =
          res?.answer?.trim() ||
          res?.reply?.trim() ||
          res?.data?.reply?.trim() ||
          res?.message?.trim() ||
          '';

        if (replyText) {
          this.messages[currentIndex].text = replyText;
        }
      },
      error: (err) => {
        console.error('❌ Chat API error:', err);
        this.messages[currentIndex].text = '⚠️ Error, please try again.';
      },
    });

    this.newMessage = '';
  }
}
