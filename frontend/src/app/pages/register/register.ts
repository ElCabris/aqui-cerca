import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService, RegisterRequest } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  user: RegisterRequest = {
    name: '',
    email: '',
    password: ''
  };

  private router = inject(Router);
  private authService = inject(AuthService);

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.authService.register(this.user).subscribe({
        next: (user) => {
          Swal.fire({
            title: '¡Registro Exitoso!',
            text: `Se ha registrado correctamente: ${this.user.name}`,
            icon: 'success',
            confirmButtonText: 'Iniciar Sesión',
            confirmButtonColor: '#3085d6'
          }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (error) => {
          Swal.fire({
            title: 'Error en el registro',
            text: '❌ No se pudo completar el registro. Intente nuevamente.',
            icon: 'error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#d33'
          });
        },
        complete: () => {
          form.resetForm();
        }
      });
    } else {
      Swal.fire({
        title: 'Error en el formulario',
        text: '❌ Por favor completa todos los campos correctamente.',
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#d33'
      });
    }
  }
}
