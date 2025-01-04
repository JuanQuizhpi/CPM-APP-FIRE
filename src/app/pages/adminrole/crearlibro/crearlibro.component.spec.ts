import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearlibroComponent } from './crearlibro.component';

describe('CrearlibroComponent', () => {
  let component: CrearlibroComponent;
  let fixture: ComponentFixture<CrearlibroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearlibroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearlibroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
