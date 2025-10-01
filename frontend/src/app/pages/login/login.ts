import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  user = {
    email: '',
    password: ''
  };

  private router = inject(Router);

  onSubmit(form: NgForm) {
    if (form.valid) {
      // Aquí podrías hacer tu lógica real de login
      console.log('Usuario logueado:', this.user);

      Swal.fire({
        icon: 'success',
        title: 'Bienvenido 🎉',
        text: `Has iniciado sesión como ${this.user.email}`,
        confirmButtonColor: '#00acc1' // turquesa-digital
      }).then(() => {
        this.router.navigate(['/profile']);
      });

      form.resetForm();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor completa todos los campos correctamente',
        confirmButtonColor: '#e53935' // rojo-error
      });
    }
  }
}

