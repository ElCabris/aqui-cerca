import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  user = {
    name: '',
    email: '',
    password: ''
  };

  constructor(private router: Router) { }

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Usuario registrado:', this.user);

      // SweetAlert2 para éxito con redirección
      Swal.fire({
        title: '¡Registro Exitoso!',
        text: `Se ha registrado correctamente: ${this.user.name}`,
        icon: 'success',
        confirmButtonText: 'Ir al Perfil',
        confirmButtonColor: '#3085d6',
        showCancelButton: true,
        cancelButtonText: 'Quedarse aquí',
        cancelButtonColor: '#d33'
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirigir a /profile
          this.router.navigate(['/profile']);
        }
        // Resetear el formulario en cualquier caso
        form.resetForm();
      });

    } else {
      // SweetAlert2 para error
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
