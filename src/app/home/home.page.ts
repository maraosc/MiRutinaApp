import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  user: string = '';

  totalTareas = 5;
  tareasCompletadas = 3;
  porcentajeTareas = 0;

  totalHabitos = 4;
  habitosCumplidos = 2;
  porcentajeHabitos = 0;

  constructor(private router: Router, private menu: MenuController) {
    const nav = history.state;
    this.user = nav.user || localStorage.getItem('usuario') || 'Invitado';
  }

  ngOnInit() {
    this.porcentajeTareas = this.tareasCompletadas / this.totalTareas;
    this.porcentajeHabitos = this.habitosCumplidos / this.totalHabitos;
    this.menu.enable(true);
  }
}

