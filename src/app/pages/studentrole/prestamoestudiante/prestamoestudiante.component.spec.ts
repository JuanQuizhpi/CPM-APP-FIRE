import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestamoestudianteComponent } from './prestamoestudiante.component';

describe('PrestamoestudianteComponent', () => {
  let component: PrestamoestudianteComponent;
  let fixture: ComponentFixture<PrestamoestudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestamoestudianteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrestamoestudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
