import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormObjetivo } from './form-objetivo';

describe('FormObjetivo', () => {
  let component: FormObjetivo;
  let fixture: ComponentFixture<FormObjetivo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormObjetivo],
    }).compileComponents();

    fixture = TestBed.createComponent(FormObjetivo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
