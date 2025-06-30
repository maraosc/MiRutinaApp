import { Component } from '@angular/core';
import { HabitoService } from '../services/habito.service';
import { AuthServiceService } from '../services/auth-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage {
  user: string = '';
  totalHabitos: number = 0;
  habitosCumplidos: number = 0;
  porcentajeHabitos: number = 0;
  fechaHoy: string = '';

  constructor(
    private habitoService: HabitoService,
    private authService: AuthServiceService
  ) {}

  async ionViewWillEnter() {
    await this.cargarResumenHabitos();
  }

  async cargarResumenHabitos() {
    this.user = localStorage.getItem('nombre') || 'Invitado';
    this.fechaHoy = new Date().toISOString().split('T')[0];

    const userId = this.authService.getUserId();
    const habitos = await this.habitoService.obtenerHabitosPorFecha(this.fechaHoy, userId);

    this.totalHabitos = habitos.length;
    this.habitosCumplidos = habitos.filter(h => h.completado === 1).length;

    this.porcentajeHabitos = this.totalHabitos > 0
      ? this.habitosCumplidos / this.totalHabitos
      : 0;
  }
}
