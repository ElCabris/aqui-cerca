import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NavbarHome } from './components/navbar-home/navbar-home';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, CommonModule, NavbarHome],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('frontend');

  public showNavbar = signal(true);


  private router = inject(Router);

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const noNavbarRouter = ['/login', '/register', '/about'];

      const shouldShowNavbar = !noNavbarRouter.includes(event.urlAfterRedirects);

      this.showNavbar.set(shouldShowNavbar);
    })
  }
}
