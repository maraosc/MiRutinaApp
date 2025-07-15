import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let alertCtrlSpy: jasmine.SpyObj<AlertController>;
  let router: Router;

  beforeEach(async () => {
    // Espía para AlertController
    const alertCtrlMock = jasmine.createSpyObj('AlertController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AlertController, useValue: alertCtrlMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    alertCtrlSpy = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;

    // Espía para Router.navigate
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.stub();

    // Stub para alert.present()
    alertCtrlSpy.create.and.returnValue(Promise.resolve({
      present: () => Promise.resolve(),
      dismiss: () => Promise.resolve()
    } as any));

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar email y password como cadenas vacías', () => {
    expect(component.email).toBe('');
    expect(component.password).toBe('');
  });

  it('debería mostrar alerta si email o password están vacíos', async () => {
    component.email = '';
    component.password = '';
    await component.login();
    expect(alertCtrlSpy.create).toHaveBeenCalledWith(
      jasmine.objectContaining({ message: 'Por favor, completa todos los campos.' })
    );
  });

  it('debería mostrar alerta si el email no es válido', async () => {
    component.email = 'invalid-email';
    component.password = '1234';
    await component.login();
    expect(alertCtrlSpy.create).toHaveBeenCalledWith(
      jasmine.objectContaining({ message: 'Por favor, ingresa un email válido.' })
    );
  });

  it('debería mostrar alerta si la contraseña es demasiado corta', async () => {
    component.email = 'test@example.com';
    component.password = '123';
    await component.login();
    expect(alertCtrlSpy.create).toHaveBeenCalledWith(
      jasmine.objectContaining({ message: 'La contraseña debe tener al menos 4 caracteres.' })
    );
  });

  it('debería navegar a /home si las credenciales son correctas', async () => {
    component.email = 'test@correo.com';
    component.password = '1234';
    await component.login();
    expect(router.navigate).toHaveBeenCalledWith(
      ['/home'],
      { state: { refrescar: true } }
    );
  });
});