import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstSpeekarComponent } from './first-speekar.component';

describe('FirstSpeekarComponent', () => {
  let component: FirstSpeekarComponent;
  let fixture: ComponentFixture<FirstSpeekarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstSpeekarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstSpeekarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
