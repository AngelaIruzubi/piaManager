import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPersonas } from './lista-personas';

describe('ListaPersonas', () => {
  let component: ListaPersonas;
  let fixture: ComponentFixture<ListaPersonas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaPersonas],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaPersonas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
