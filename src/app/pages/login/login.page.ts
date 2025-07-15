import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {

  email = '';
  password = '';
  mensaje = '';

  private usuariosMock = [
    { email: 'test@correo.com',  password: '1234',  nombre: 'Test User'  },
    { email: 'admin@correo.com', password: 'admin', nombre: 'Admin User' }
  ];

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {}

  private async mostrarAlertaError(mensaje: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  private validarEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async login(): Promise<void> {
    if (!this.email || !this.password) {
      await this.mostrarAlertaError('Por favor, completa todos los campos.');
      return;
    }
    if (!this.validarEmail(this.email)) {
      await this.mostrarAlertaError('Por favor, ingresa un email válido.');
      return;
    }
    if (this.password.length < 4) {
      await this.mostrarAlertaError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    const usuario = this.usuariosMock.find(
      u => u.email === this.email && u.password === this.password
    );

    if (usuario) {
      localStorage.setItem('nombre', usuario.nombre);
      this.router.navigate(['/home'], { state: { refrescar: true } });
    } else {
      await this.mostrarAlertaError('Usuario o contraseña incorrectos.');
    }
  }
}