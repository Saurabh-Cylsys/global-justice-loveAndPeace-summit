import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakerRegistrationComponent } from './speaker-registration.component';

describe('SpeakerRegistrationComponent', () => {
  let component: SpeakerRegistrationComponent;
  let fixture: ComponentFixture<SpeakerRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpeakerRegistrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeakerRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
