import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstPartnerComponent } from './first-partner.component';

describe('FirstPartnerComponent', () => {
  let component: FirstPartnerComponent;
  let fixture: ComponentFixture<FirstPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstPartnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
