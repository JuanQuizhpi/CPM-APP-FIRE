import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibroadminComponent } from './libroadmin.component';

describe('LibroadminComponent', () => {
  let component: LibroadminComponent;
  let fixture: ComponentFixture<LibroadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibroadminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LibroadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
