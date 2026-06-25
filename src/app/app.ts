import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from './message.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  newMessage = '';
  editIndex: number | null = null;
  editText = '';

  loading = false;
  error: string | null = null;

  messages = signal<string[]>([]);

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.loading = true;
    this.error = null;
    this.messageService.getMessages()
      .subscribe({
        next: data => this.messages.set(data),
        error: err => { this.error = 'Failed loading messages'; console.error(err); },
        complete: () => { this.loading = false; }
      });
  }

  submitMessage() {
    if (!this.newMessage.trim()) return;
    this.loading = true;
    this.messageService.submitMessage(this.newMessage)
      .subscribe({
        next: () => {
          this.messages.update(msgs => [...msgs, this.newMessage]);
          this.newMessage = '';
        },
        error: err => { console.error(err); alert('Failed to submit message'); },
        complete: () => { this.loading = false; }
      });
  }

  deleteMessage(index: number) {
    this.loading = true;
    this.messageService.deleteMessage(index)
      .subscribe({
        next: () => {
          this.messages.update(msgs => {
            const updated = [...msgs];
            updated.splice(index, 1);
            return updated;
          });
        },
        error: err => { console.error('Delete failed', err); alert('Failed to delete message'); },
        complete: () => { this.loading = false; }
      });
  }

  startEdit(index: number, currentMessage: string) {
    this.editIndex = index;
    this.editText = currentMessage;
    // allow DOM to update then auto-resize and focus textarea with id="edit-textarea"
    setTimeout(() => {
      const ta = document.querySelector<HTMLTextAreaElement>('#edit-textarea');
      if (ta) {
        ta.style.height = 'auto';
        ta.style.height = `${ta.scrollHeight}px`;
        ta.focus();
      }
    });
  }

  cancelEdit() {
    this.editIndex = null;
    this.editText = '';
  }

  resizeTextarea(target: EventTarget | null) {
    if (!(target instanceof HTMLTextAreaElement)) return;
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
  }

  saveEditedMessage() {
    if (this.editIndex === null || !this.editText.trim()) return;
    this.loading = true;
    const index = this.editIndex;
    const updatedMessage = this.editText.trim();

    this.messageService.editMessage(index, updatedMessage)
      .subscribe({
        next: () => {
          this.messages.update(msgs => msgs.map((msg, i) => i === index ? updatedMessage : msg));
          this.cancelEdit();
        },
        error: err => { console.error('Edit failed', err); alert('Failed to save edit'); },
        complete: () => { this.loading = false; }
      });
  }

  deleteAll() {
    if (!confirm('Delete all messages?')) return;
    this.loading = true;
    this.messageService.deleteAllMessages()
      .subscribe({
        next: (res: any) => {
          if (res?.status) alert(res.status);
          this.messages.set([]);
        },
        error: err => { console.error(err); alert('Failed to delete all messages'); },
        complete: () => { this.loading = false; }
      });
  }
}