import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
 newMessage = '';
  deleteIndex: number | null = null;

  // ✅ messages stored in a signal
  messages = signal<string[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.http.get<string[]>('http://localhost:9595/messages')
      .subscribe(data => this.messages.set(data));
  }

  submitMessage() {
    if (!this.newMessage.trim()) return;

    this.http.post('http://localhost:9595/submit', { message: this.newMessage })
      .subscribe(() => {
        // ✅ update signal immediately
        this.messages.update(msgs => [...msgs, this.newMessage]);
        this.newMessage = '';
      });
  }

  deleteMessage(index: number) {
    if (index !== null) {
      this.http.post('http://localhost:9595/delete', { index: index })
        .subscribe(() => {
          this.messages.update(msgs => {
            const updated = [...msgs];
            updated.splice(index!, 1);
            return updated;
          });
          // index = null;
        });
    }
  }

  deleteAll() {
    this.http.post('http://localhost:9595/deleteAll', {})
      .subscribe((res: any) => {
        alert(res.status);
        this.messages.set([]); // ✅ clear immediately
      });
  }
}