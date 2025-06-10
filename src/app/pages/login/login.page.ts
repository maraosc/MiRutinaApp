import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';


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
    private alertController: AlertController
  ) { }

  //Método para mostrar alerta de error
  async mostrarAlertaError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  //Función para validar el formato de email
  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar el formato de email
    // Verifica si el email cumple con el formato
    return emailRegex.test(email);
  }

  //Método login
  login() {
    // Validar campos vacíos
    if (!this.email || !this.password) {
      this.mostrarAlertaError('Por favor, completa todos los campos.');
      return;
    }

    // Validar formato de email
    if (!this.validarEmail(this.email)) {
      this.mostrarAlertaError('Por favor, ingresa un email válido.');
      return;
    }

    //Validar longitud de contraseña
    if (this.password.length < 4) {
      this.mostrarAlertaError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    // Si la autenticación es exitosa, redirigir al usuario a la página principal
    this.router.navigate(['/home'], { state: { user: this.email } });

  }

}
