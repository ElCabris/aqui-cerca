import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './explore.html',
  styleUrls: ['./explore.css']
})
export class Explore {
  constructor(private http: HttpClient) {}

  tags: string[] = [];
  newTag = '';

  locals: Array<{ id?: number; name: string; description?: string; categories?: string[] }>= [];

  private fetchLocals(): void {
    const params = this.tags.length ? `?tags=${encodeURIComponent(this.tags.join(','))}` : '';
    const url = `${environment.apiUrl}/users/locals/search${params}`;
    this.http.get<{ locals: Array<{ id: number; name: string; description: string | null }> }>(url)
      .subscribe({
        next: (res) => {
          this.locals = (res.locals || []).map(l => ({ id: l.id, name: l.name, description: l.description || undefined }));
        },
        error: () => {
          this.locals = [];
        }
      });
  }

  addTag(): void {
    const t = this.newTag.trim().toLowerCase();
    if (!t) return;
    if (!this.tags.includes(t)) {
      this.tags.push(t);
      this.fetchLocals();
    }
    this.newTag = '';
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
    this.fetchLocals();
  }

  get filteredLocals() {
    // Ya filtramos en el backend; devolver tal cual
    return this.locals;
  }
}
