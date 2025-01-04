import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestamoadminComponent } from './prestamoadmin.component';

describe('PrestamoadminComponent', () => {
  let component: PrestamoadminComponent;
  let fixture: ComponentFixture<PrestamoadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestamoadminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrestamoadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
