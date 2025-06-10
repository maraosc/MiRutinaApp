import { Component } from '@angular/core';

@Component({
  selector: 'app-habitos',
  templateUrl: './habitos.page.html',
  styleUrls: ['./habitos.page.scss'],
  standalone: false,
})
export class HabitosPage {
  habitos = [
    { nombre: 'Beber Agua', imagen: 'assets/habitos/beber-agua.png', completado: false },
    { nombre: 'Leer', imagen: 'assets/habitos/leer.png', completado: false },
    { nombre: 'Ejercicio', imagen: 'assets/habitos/ejercicio.png', completado: false },
    { nombre: 'Dormir Temprano', imagen: 'assets/habitos/dormir.png', completado: false },
  ];

  marcarComoCompletado(habito: any) {
    habito.completado = !habito.completado;
  }

  agregarHabito() {
  console.log('Agregar hábito');
}


}
