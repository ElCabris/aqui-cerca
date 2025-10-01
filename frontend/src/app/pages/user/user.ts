import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.html',
  styleUrls: ['./user.css']
})
export class User {
  user = {
    name: 'Juan Pérez',
    puntosApoyoLocal: 1250,
    historialLocales: [
      { nombre: 'Café Central', fecha: '2024-06-10' },
      { nombre: 'Librería El Saber', fecha: '2024-06-08' },
      { nombre: 'Panadería La Espiga', fecha: '2024-06-05' }
    ]
  };
}

