import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstRagistratComponent } from './first-ragistrat.component';

describe('FirstRagistratComponent', () => {
  let component: FirstRagistratComponent;
  let fixture: ComponentFixture<FirstRagistratComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstRagistratComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstRagistratComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
