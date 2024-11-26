import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerMainComponent } from './partner-main.component';

describe('PartnerMainComponent', () => {
  let component: PartnerMainComponent;
  let fixture: ComponentFixture<PartnerMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartnerMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnerMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
