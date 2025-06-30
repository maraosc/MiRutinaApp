import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HabitoService } from '../../services/habito.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-agregar-habito',
  templateUrl: './agregar-habito.page.html',
  styleUrls: ['./agregar-habito.page.scss'],
  standalone: false,
})
export class AgregarHabitoPage {
  nombre: string = '';
  imagen: string = '';
  fechaSeleccionada: string = '';

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private habitoService: HabitoService,
    private authService: AuthServiceService
  ) {}

  ngOnInit() {
    this.fechaSeleccionada =
      this.route.snapshot.paramMap.get('fecha') || new Date().toISOString().split('T')[0];
  }

  async seleccionarImagen() {
    try {
      const image = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt // permite elegir entre cámara o galería
      });

      this.imagen = image.dataUrl || '';
    } catch (error) {
      console.error('Error seleccionando imagen:', error);
    }
  }

  async guardar() {
    if (!this.nombre.trim()) {
      alert('Debes ingresar un nombre para el hábito.');
      return;
    }

    const nuevoHabito = {
      nombre: this.nombre.trim(),
      completado: false,
      imagen: this.imagen || 'https://via.placeholder.com/150',
      fecha: this.fechaSeleccionada
    };

    const userId = this.authService.getUserId();

    try {
      await this.habitoService.guardarHabito(nuevoHabito, userId, nuevoHabito.fecha);
      this.navCtrl.back();
    } catch (error) {
      console.error('Error al guardar hábito:', error);
    }
  }
}
