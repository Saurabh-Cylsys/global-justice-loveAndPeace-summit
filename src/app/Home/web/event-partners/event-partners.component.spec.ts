import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPartnersComponent } from './event-partners.component';

describe('EventPartnersComponent', () => {
  let component: EventPartnersComponent;
  let fixture: ComponentFixture<EventPartnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventPartnersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
