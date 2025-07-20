// app.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private router: Router,
    private menuCtrl: MenuController
  ) {}

async navigateAndClose(path: string) {
  console.log('Navegando a →', path);
  await this.menuCtrl.close();
  this.router.navigateByUrl(path);
}

  async logout() {
    await this.menuCtrl.close();
    localStorage.removeItem('usuario');
    this.router.navigateByUrl('/login');
  }
}
