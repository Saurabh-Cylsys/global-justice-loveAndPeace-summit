import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBrochureComponent } from './sales-brochure.component';

describe('SalesBrochureComponent', () => {
  let component: SalesBrochureComponent;
  let fixture: ComponentFixture<SalesBrochureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesBrochureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesBrochureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
