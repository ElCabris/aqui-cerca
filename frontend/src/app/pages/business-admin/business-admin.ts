import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';

interface Product {
  name: string;
  available: boolean;
}

@Component({
  selector: 'app-business-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './business-admin.html',
  styleUrls: ['./business-admin.css']
})
export class BusinessAdmin implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  businessName = '';
  businessAddress = 'Calle Falsa 123, Springfield';
  tags: string[] = [];
  newTag = '';
  products: Product[] = [
    { name: 'Hamburguesa Clásica', available: true },
    { name: 'Papas Fritas', available: true },
    { name: 'Refresco', available: false }
  ];
  newProductName = '';
  qrCodeUrl?: string;
  private qrCodeId?: string;

  ngOnInit(): void {
    const email = this.auth.getUserEmail();
    if (!email) {
      this.qrCodeUrl = undefined;
      return;
    }

    // Cargar datos del negocio (nombre)
    const businessUrl = `${environment.apiUrl}/users/email/${encodeURIComponent(email)}/business`;
    this.http.get<any>(businessUrl).subscribe({
      next: (biz) => {
        this.businessName = biz?.name || '';
      },
      error: () => {
        this.businessName = '';
      }
    });

    // Cargar QR (y qr_code_id)
    const qrUrl = `${environment.apiUrl}/qr?email=${encodeURIComponent(email)}`;
    this.http.get<{ qr: string; qr_code_id: string }>(qrUrl).subscribe({
      next: (res) => {
        this.qrCodeUrl = res.qr;
        this.qrCodeId = res.qr_code_id;
      },
      error: () => {
        this.qrCodeUrl = undefined;
        this.qrCodeId = undefined;
      }
    });

    // Cargar etiquetas existentes
    const tagsUrl = `${environment.apiUrl}/users/email/${encodeURIComponent(email)}/tags`;
    this.http.get<{ tags: string[] }>(tagsUrl).subscribe({
      next: (res) => {
        this.tags = res.tags || [];
      },
      error: () => {
        this.tags = [];
      }
    });
  }

  addTag() {
    const email = this.auth.getUserEmail();
    const t = this.newTag.trim().toLowerCase();
    if (!email || !t) return;

    const url = `${environment.apiUrl}/users/email/${encodeURIComponent(email)}/tags`;
    this.http.post<{ tags: string[] }>(url, { name: t }).subscribe({
      next: (res) => {
        this.tags = res.tags || [];
        this.newTag = '';
      },
      error: () => {
        // Mantener estado; opcional: feedback al usuario
      }
    });
  }

  removeTag(tagToRemove: string) {
    const email = this.auth.getUserEmail();
    if (!email) return;

    const url = `${environment.apiUrl}/users/email/${encodeURIComponent(email)}/tags/${encodeURIComponent(tagToRemove)}`;
    this.http.delete<{ tags: string[] }>(url).subscribe({
      next: (res) => {
        this.tags = res.tags || [];
      },
      error: () => {
        // Mantener estado; opcional: feedback al usuario
      }
    });
  }

  addProduct() {
    if (this.newProductName.trim()) {
      this.products.push({ name: this.newProductName.trim(), available: true });
      this.newProductName = '';
    }
  }

  removeProduct(productToRemove: Product) {
    this.products = this.products.filter(product => product !== productToRemove);
  }

  saveChanges() {
    const email = this.auth.getUserEmail();
    if (!email) return;

    const url = `${environment.apiUrl}/users/email/${encodeURIComponent(email)}/business/name`;
    this.http.patch(url, { name: this.businessName || '' }).subscribe({
      next: () => {
        alert('Nombre del negocio actualizado');
      },
      error: () => {
        alert('No se pudo actualizar el nombre del negocio');
      }
    });
  }

  awardPoints(points: number = 10) {
    if (!this.qrCodeId) return;
    const url = `${environment.apiUrl}/qr/award`;
    this.http.post<{ success: boolean; points: number }>(url, {
      qr_code_id: this.qrCodeId,
      points
    }).subscribe({
      next: (res) => {
        console.log('Puntos actualizados:', res.points);
      },
      error: (err) => {
        console.error('Error sumando puntos', err);
      }
    });
  }
}