import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements OnInit {
  user: any = null;
  edad: number = 0;

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  async ngOnInit() {
    const email = localStorage.getItem('user'); // asumimos que se guardó el email al iniciar sesión
    if (email) {
      const usuario = await this.authService.getUserByEmail(email);
      if (usuario) {
        this.user = usuario;
        this.edad = this.calcularEdad(usuario.fecha_nacimiento);
      }
    }
  }

  calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const fecha = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const m = hoy.getMonth() - fecha.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
      edad--;
    }
    return edad;
  }
}
