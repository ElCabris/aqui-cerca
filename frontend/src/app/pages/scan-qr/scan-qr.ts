import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
// No necesitamos importar 'Result' si el componente emite solo el string
// import { Result } from '@zxing/library';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-scan-qr',
  standalone: true,
  imports: [ZXingScannerModule, CommonModule],
  templateUrl: './scan-qr.html',
  styleUrls: ['./scan-qr.css'],
})
export class ScanQr implements OnInit {

  // Opciones del escáner
  availableDevices: MediaDeviceInfo[] = [];
  currentDevice: MediaDeviceInfo | undefined = undefined;
  hasDevices: boolean = false;
  qrResultString: string = '';
  torchEnabled: boolean = false;

  private http = inject(HttpClient);

  constructor(private router: Router) { }

  ngOnInit(): void { }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);

    if (this.hasDevices) {
      // Selecciona la cámara trasera por defecto
      this.currentDevice = this.availableDevices[this.availableDevices.length - 1];
    }
  }

  // 💡 CORREGIDO: Ahora acepta directamente el 'string' decodificado.
  onCodeResult(scannedData: string): void {
    this.qrResultString = scannedData;

    console.log('✅ QR Escaneado:', scannedData);
    // Aquí puedes implementar la lógica de tu aplicación:
    // 1. Llamar a un servicio
    // 2. Navegar a una nueva ruta: this.router.navigate(['/ruta', { qr: scannedData }]);
  }

  // Maneja el error de escaneo por separado (tipado Error)
  onScanError(error: Error): void {
    console.error('❌ Error de escaneo:', error);
    if (error.name === 'NotAllowedError') {
      this.qrResultString = 'Permiso de cámara denegado.';
    }
  }

  onDeviceSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    console.log('Cámara seleccionada:', selectedValue);
    const device = this.availableDevices.find(d => d.deviceId === selectedValue);
    this.currentDevice = device;
  }

  sendSupportPoints(points: number = 10): void {
    if (!this.qrResultString) return;
    const url = `${environment.apiUrl}/qr/award`;
    this.http.post<{ success: boolean; points: number }>(url, {
      qr_code_id: this.qrResultString,
      points
    }).subscribe({
      next: (res) => {
        console.log('Puntos de apoyo sumados. Total actual:', res.points);
      },
      error: (err) => {
        console.error('Error enviando puntos de apoyo', err);
      }
    });
  }
}
