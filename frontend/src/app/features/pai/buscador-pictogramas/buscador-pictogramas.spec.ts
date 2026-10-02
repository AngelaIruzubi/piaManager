import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorPictogramas } from './buscador-pictogramas';

describe('BuscadorPictogramas', () => {
  let component: BuscadorPictogramas;
  let fixture: ComponentFixture<BuscadorPictogramas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscadorPictogramas],
    }).compileComponents();

    fixture = TestBed.createComponent(BuscadorPictogramas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
