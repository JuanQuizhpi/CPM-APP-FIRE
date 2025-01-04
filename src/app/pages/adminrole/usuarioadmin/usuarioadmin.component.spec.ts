import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioadminComponent } from './usuarioadmin.component';

describe('UsuarioadminComponent', () => {
  let component: UsuarioadminComponent;
  let fixture: ComponentFixture<UsuarioadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioadminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsuarioadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
