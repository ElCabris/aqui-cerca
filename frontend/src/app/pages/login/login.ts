import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService, LoginRequest } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  user: LoginRequest = {
    email: '',
    password: ''
  };

  private router = inject(Router);
  private authService = inject(AuthService);

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.authService.login(this.user).subscribe({
        next: () => this.router.navigate(['/profile']),
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Credenciales incorrectas',
            confirmButtonColor: '#e53935'
          });
        },
        complete: () => {
          form.resetForm();
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor completa todos los campos correctamente',
        confirmButtonColor: '#e53935'
      });
    }
  }
}
