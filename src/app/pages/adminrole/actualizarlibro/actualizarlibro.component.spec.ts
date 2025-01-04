import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarlibroComponent } from './actualizarlibro.component';

describe('ActualizarlibroComponent', () => {
  let component: ActualizarlibroComponent;
  let fixture: ComponentFixture<ActualizarlibroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarlibroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActualizarlibroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
