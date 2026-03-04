import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private apiService: ApiService) {}

  chat(userId: string, query: string, stream: boolean = false): Observable<any> {
    const body = {
      user_id: userId,
      query: query,
      stream: stream,
    };
    return this.apiService.post<any>('/chatbot/chat', body);
  }

  getChatHistory(userId: string): Observable<any[]> {
    return this.apiService.get<any[]>(`/chatbot/history?user_id=${userId}`);
  }
}
