import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaPersona } from './ficha-persona';

describe('FichaPersona', () => {
  let component: FichaPersona;
  let fixture: ComponentFixture<FichaPersona>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichaPersona],
    }).compileComponents();

    fixture = TestBed.createComponent(FichaPersona);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
