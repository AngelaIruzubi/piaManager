import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>; //Contenedorde Login y su HTML
 
  //Entorno pruebas Angular, se ejecuta antes de cada prueba
  beforeEach(async () => {
    await TestBed.configureTestingModule({ //Simula el navegador para probar componenetes
      imports: [Login],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
