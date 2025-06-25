import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {

  email: string = '';
  password: string = '';
  mensaje: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthServiceService
  ) {}

  // Método para mostrar alerta de error
  async mostrarAlertaError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  // Función para validar el formato de email
  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Método login
  async login() {
    if (!this.email || !this.password) {
      this.mostrarAlertaError('Por favor, completa todos los campos.');
      return;
    }

    if (!this.validarEmail(this.email)) {
      this.mostrarAlertaError('Por favor, ingresa un email válido.');
      return;
    }

    if (this.password.length < 4) {
      this.mostrarAlertaError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    try {
      // Intentar autenticar con SQLite
      const usuario = await this.authService.loginUser(this.email, this.password);

      // Guardar el email en localStorage
      localStorage.setItem('user', usuario.email);

      // Redirigir al home con el nombre
      this.router.navigate(['/home'], { state: { user: usuario.nombre } });

    } catch (error) {
      // Mostrar alerta en caso de error
      this.mostrarAlertaError('Usuario o contraseña incorrectos.');
    }
  }
}
