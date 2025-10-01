import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faInfoCircle, faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar-home',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './navbar-home.html',
  styleUrl: './navbar-home.css'
})
export class NavbarHome {
  selected: string = 'Acerca de';

  sections = [
    { label: 'Registro', path: '/register', icon: faUserPlus },
    { label: 'Acerca de', path: '/about', icon: faInfoCircle },
    { label: 'Ingreso', path: '/login', icon: faSignInAlt }
  ];

  private router = inject(Router);

  selectSection(section: any) {
    this.selected = section.label;
    this.router.navigate([section.path]);
  }
}
