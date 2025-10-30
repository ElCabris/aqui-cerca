import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './explore.html',
  styleUrls: ['./explore.css']
})
export class Explore {
  tags: string[] = [];
  newTag = '';

  locals: Array<{ name: string; description?: string; categories?: string[] }>= [
    { name: 'Tienda Doña Ana', description: 'Abarrotes y más', categories: ['barrio', 'abarrotes'] },
    { name: 'Cafetería Medellín', description: 'Café y postres', categories: ['cafetería'] }
  ];

  addTag(): void {
    const t = this.newTag.trim();
    if (!t) return;
    if (!this.tags.includes(t)) this.tags.push(t);
    this.newTag = '';
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
  }

  get filteredLocals() {
    if (this.tags.length === 0) return this.locals;
    return this.locals.filter(l => (l.categories || []).some(c => this.tags.includes(c)));
  }
}
