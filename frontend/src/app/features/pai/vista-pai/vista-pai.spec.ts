import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaPai } from './vista-pai';

describe('VistaPai', () => {
  let component: VistaPai;
  let fixture: ComponentFixture<VistaPai>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaPai],
    }).compileComponents();

    fixture = TestBed.createComponent(VistaPai);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
