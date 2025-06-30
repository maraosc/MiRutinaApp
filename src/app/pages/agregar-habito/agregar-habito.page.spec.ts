import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarHabitoPage } from './agregar-habito.page';

describe('AgregarHabitoPage', () => {
  let component: AgregarHabitoPage;
  let fixture: ComponentFixture<AgregarHabitoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarHabitoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
