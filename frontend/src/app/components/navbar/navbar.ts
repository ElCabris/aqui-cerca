import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCompass, faMap, faQrcode, faUser, IconDefinition, faStore } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private router = inject(Router);

  sections = [
    { label: 'Mapa', icon: faMap, route: '/map' },
    { label: 'Escáner QR', icon: faQrcode, route: '/scan-qr' },
    { label: 'Mi perfil', icon: faUser, route: '/profile' },
    { label: 'Explorar', icon: faCompass, route: '/explore' },
    { label: 'Negocio', icon: faStore, route: '/admin/business' }
  ];

  selected = 'Mi perfil'

  constructor(library: FaIconLibrary) {
    library.addIcons(faMap, faQrcode, faUser, faCompass, faStore);
  }

  selectSection(section: { label: string, icon: IconDefinition, route: string }) {
    this.selected = section.label;
    this.router.navigate([section.route]);
  }
}
