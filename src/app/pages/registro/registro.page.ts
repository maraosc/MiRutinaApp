import { Component } from '@angular/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})
export class RegistroPage {
  public nombre: string = '';
  public email: string = '';
  public fechaNacimiento: Date | null = null;
  public objetivo: string = '';
}
