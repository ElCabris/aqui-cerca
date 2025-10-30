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
  businessName = 'Mi Negocio de Ejemplo';
  businessAddress = 'Calle Falsa 123, Springfield';
  tags: string[] = ['restaurante', 'comida-rapida', 'familiar'];
  newTag = '';
  products: Product[] = [
    { name: 'Hamburguesa Clásica', available: true },
    { name: 'Papas Fritas', available: true },
    { name: 'Refresco', available: false }
  ];
  newProductName = '';
  qrCodeUrl?: string;

  ngOnInit(): void {
    const email = this.auth.getUserEmail();
    if (!email) {
      this.qrCodeUrl = undefined;
      return;
    }

    const url = `${environment.apiUrl}/qr?email=${encodeURIComponent(email)}`;
    this.http.get<{ qr: string }>(url).subscribe({
      next: (res) => {
        this.qrCodeUrl = res.qr; // data URL devuelta por backend
      },
      error: () => {
        this.qrCodeUrl = undefined;
      }
    });
  }

  addTag() {
    if (this.newTag.trim() && !this.tags.includes(this.newTag.trim())) {
      this.tags.push(this.newTag.trim());
      this.newTag = '';
    }
  }

  removeTag(tagToRemove: string) {
    this.tags = this.tags.filter(tag => tag !== tagToRemove);
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
    // Aquí iría la lógica para guardar los datos en el backend a través de un servicio.
    console.log('Guardando cambios:', {
      name: this.businessName,
      address: this.businessAddress,
      tags: this.tags,
      products: this.products
    });
    alert('Cambios guardados (simulación). Revisa la consola para ver los datos.');
  }
}