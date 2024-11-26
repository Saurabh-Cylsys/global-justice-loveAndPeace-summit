import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurLengcyComponent } from './our-lengcy.component';

describe('OurLengcyComponent', () => {
  let component: OurLengcyComponent;
  let fixture: ComponentFixture<OurLengcyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OurLengcyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurLengcyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
