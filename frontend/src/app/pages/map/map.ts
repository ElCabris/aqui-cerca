import { Component, OnInit } from '@angular/core';
declare const L: any;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.html',
  styleUrls: ['./map.css']
})
export class Map implements OnInit {
  private map?: any;

  ngOnInit(): void {
    // Centro: Medellín
    const medellin = [6.2442, -75.5812];

    this.map = L.map('map', {
      center: medellin,
      zoom: 13,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    L.marker(medellin).addTo(this.map).bindPopup('Medellín').openPopup();
  }
}
