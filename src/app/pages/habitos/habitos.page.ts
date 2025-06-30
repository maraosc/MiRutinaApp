import { Component } from '@angular/core';
import { HabitoService } from '../../services/habito.service';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-habitos',
  templateUrl: './habitos.page.html',
  styleUrls: ['./habitos.page.scss'],
  standalone: false,
})
export class HabitosPage {
  fechaActual: Date = new Date();
  habitos: any[] = [];
  userId: number = 0;

  constructor(
    private habitoService: HabitoService,
    private authService: AuthServiceService
  ) {}

  async ionViewWillEnter() {
    this.userId = this.authService.getUserId();
    await this.habitoService.init();
    this.cargarHabitos();
  }

  cambiarFecha(dias: number) {
    const nuevaFecha = new Date(this.fechaActual);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    this.fechaActual = nuevaFecha;
    this.cargarHabitos();
  }

  async cargarHabitos() {
    const fechaStr = this.fechaActual.toISOString().split('T')[0];
    try {
      this.habitos = await this.habitoService.obtenerHabitosPorFecha(fechaStr, this.userId);
    } catch (error) {
      console.error('Error cargando hábitos:', error);
      this.habitos = [];
    }
  }

  async marcarComoCompletado(habito: any) {
    habito.completado = habito.completado ? 0 : 1;
    try {
      await this.habitoService.actualizarEstadoHabito(habito.id, habito.completado);
      this.cargarHabitos();
    } catch (err) {
      console.error('Error actualizando hábito:', err);
    }
  }

  // Método para agregar un nuevo hábito
 async agregarHabito() {
  const nuevoHabito = {
    nombre: 'Nuevo Hábito',
    completado: false,
    imagen: 'https://via.placeholder.com/150'
  };

  const fecha = this.fechaActual.toISOString().split('T')[0];

  try {
    await this.habitoService.guardarHabito(nuevoHabito, this.userId, fecha);
    this.cargarHabitos();
  } catch (error) {
    console.error('Error agregando hábito:', error);
  }
}
  // Método para eliminar un hábito

  async eliminarHabito(id: number) {
    try {
      await this.habitoService.eliminarHabito(id);
      this.cargarHabitos();
    } catch (err) {
      console.error('Error eliminando hábito:', err);
    }
  }
}
