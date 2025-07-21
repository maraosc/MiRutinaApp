import { Component, OnInit } from '@angular/core';
import { HabitoService } from '../services/habito.service';
import { AuthServiceService } from '../services/auth-service.service';
import { MenuController } from '@ionic/angular';
import { WeatherService, WeatherResponse } from '../services/weather.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  // Datos de hábitos
  user: string = '';
  totalHabitos: number = 0;
  habitosCumplidos: number = 0;
  porcentajeHabitos: number = 0;
  fechaHoy: string = '';

  // Configuración y resultados de clima
  city: string = 'Santiago';
  weather?: WeatherResponse;
  error?: string;

  constructor(
    private habitoService: HabitoService,
    private authService: AuthServiceService,
    private menuCtrl: MenuController,
    private weatherService: WeatherService,
  ) {}

  // Cada vez que entra a la vista, cargo el resumen de hábitos
  async ionViewWillEnter() {
    await this.cargarResumenHabitos();
    this.menuCtrl.enable(true);
  }

  private async cargarResumenHabitos() {
    this.user = localStorage.getItem('nombre') || 'Invitado';
    this.fechaHoy = new Date().toISOString().split('T')[0];

    const userId = this.authService.getUserId();
    const habitos = await this.habitoService.obtenerHabitosPorFecha(this.fechaHoy, userId);

    this.totalHabitos     = habitos.length;
    this.habitosCumplidos = habitos.filter(h => h.completado === 1).length;
    this.porcentajeHabitos = this.totalHabitos > 0
      ? this.habitosCumplidos / this.totalHabitos
      : 0;
  }

  // Al inicializar el componente, cargo el clima
  ngOnInit() {
    this.loadWeather();
  }

  loadWeather() {
    // Reseteo antes de cada llamada
    this.weather = undefined;
    this.error   = undefined;

    this.weatherService.getCurrentWeather(this.city)
      .subscribe({
        next: data => this.weather = data,
        error: ()   => this.error   = 'No se pudo obtener el clima'
      });
  }
}
