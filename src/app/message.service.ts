import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly API_BASE = 'http://localhost:9595/api/messages';

  constructor(private http: HttpClient) {}

  getMessages(): Observable<string[]> {
    return this.http.get<string[]>(this.API_BASE);
  }

  submitMessage(message: string): Observable<any> {
    return this.http.post(`${this.API_BASE}/submit`, { message });
  }

  deleteMessage(index: number): Observable<any> {
    return this.http.post(`${this.API_BASE}/delete`, { index });
  }

  deleteAllMessages(): Observable<any> {
    return this.http.post(`${this.API_BASE}/deleteAll`, {});
  }

  editMessage(index: number, message: string): Observable<any> {
    return this.http.post(`${this.API_BASE}/edit`, { index, message });
  }
}