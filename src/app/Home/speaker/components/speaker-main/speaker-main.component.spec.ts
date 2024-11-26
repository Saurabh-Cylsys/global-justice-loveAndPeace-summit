import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakerMainComponent } from './speaker-main.component';

describe('SpeakerMainComponent', () => {
  let component: SpeakerMainComponent;
  let fixture: ComponentFixture<SpeakerMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpeakerMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeakerMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
