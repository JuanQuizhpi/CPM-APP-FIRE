import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibroestudianteComponent } from './libroestudiante.component';

describe('LibroestudianteComponent', () => {
  let component: LibroestudianteComponent;
  let fixture: ComponentFixture<LibroestudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibroestudianteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LibroestudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
