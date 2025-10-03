import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User as UserModel } from '../../services/user';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.html',
  styleUrls: ['./user.css']
})
export class UserPage implements OnInit {
  user: UserModel | null = null;

  historialLocales = [
    { nombre: 'Café Central', fecha: '2024-06-10' },
    { nombre: 'Librería El Saber', fecha: '2024-06-08' },
    { nombre: 'Panadería La Espiga', fecha: '2024-06-05' },
    { nombre: 'Bodega Familiar', fecha: '2024-06-01' },
    { nombre: 'Ferretería Moderna', fecha: '2024-05-28' }
  ];

  private userService = inject(UserService);
  private authService = inject(AuthService);

  ngOnInit() {
    console.log('🔄 [UserPage] Inicializando página de usuario...');
    this.loadUserData();
  }

  loadUserData() {
    console.log('📥 [UserPage] Cargando datos del usuario...');

    this.userService.getCurrentUser().subscribe({
      next: (user: UserModel) => {
        console.log('✅ [UserPage] Datos del usuario cargados:', user);
        this.user = user;
      },
      error: (error: any) => {
        console.error('💥 [UserPage] Error cargando datos del usuario:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    });
  }

  logout() {
    console.log('🚪 [UserPage] Cerrando sesión...');
    this.authService.logout();
  }
}
