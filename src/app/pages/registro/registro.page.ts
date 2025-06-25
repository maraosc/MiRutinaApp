import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})
export class RegistroPage {
  public nombre: string = '';
  public email: string = '';
  public password: string = '';
  public fechaNacimiento: Date | null = null;
  public objetivo: string = '';

  constructor(
    private alertController: AlertController,
    private menu: MenuController,
    private authService: AuthServiceService
  ) {}

  ngOnInit() {
    this.menu.enable(false); // Deshabilita el menú en la página de registro
  }

  // Método para mostrar errores
  async mostrarError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Validar formato de correo
  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validaciones por campo
  guardarUsuario() {
    if (!this.nombre.trim()) {
      this.mostrarError('Por favor, ingresa tu nombre.');
      return;
    }

    if (!this.email.trim()) {
      this.mostrarError('Por favor, ingresa tu correo electrónico.');
      return;
    }

    if (!this.validarEmail(this.email)) {
      this.mostrarError('El correo electrónico no tiene un formato válido.');
      return;
    }

    if (!this.password.trim()) {
      this.mostrarError('Por favor, ingresa una contraseña.');
      return;
    }

    if (this.password.length < 4) {
      this.mostrarError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    if (!this.fechaNacimiento) {
      this.mostrarError('Por favor, selecciona tu fecha de nacimiento.');
      return;
    }

    if (!this.objetivo.trim()) {
      this.mostrarError('Por favor, selecciona tu objetivo.');
      return;
    }

    // Si pasa todas las validaciones, llama a register()
    this.register();
  }

  // Alerta de éxito
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Registro exitoso',
      message: 'Usuario registrado correctamente.',
      buttons: ['OK']
    });

    await alert.present();
  }

  // Registro en base de datos
  async register() {
    try {
      const success = await this.authService.registerUser(
        this.nombre,
        this.email,
        this.password,
        this.fechaNacimiento ? this.fechaNacimiento.toISOString().split('T')[0] : '',
        this.objetivo
      );

      if (success) {
        this.presentAlert();
        this.nombre = '';
        this.email = '';
        this.password = '';
        this.fechaNacimiento = null;
        this.objetivo = '';
      } else {
        this.mostrarError('No se pudo registrar el usuario. Inténtalo nuevamente.');
      }

    } catch (error) {
      console.error('Error al registrar:', error);
      this.mostrarError('Ocurrió un error al registrar. Intenta más tarde.');
    }
  }
}
