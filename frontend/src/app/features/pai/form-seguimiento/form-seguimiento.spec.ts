import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSeguimiento } from './form-seguimiento';

describe('FormSeguimiento', () => {
  let component: FormSeguimiento;
  let fixture: ComponentFixture<FormSeguimiento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSeguimiento],
    }).compileComponents();

    fixture = TestBed.createComponent(FormSeguimiento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
