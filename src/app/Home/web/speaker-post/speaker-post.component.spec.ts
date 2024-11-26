import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakerPostComponent } from './speaker-post.component';

describe('SpeakerPostComponent', () => {
  let component: SpeakerPostComponent;
  let fixture: ComponentFixture<SpeakerPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpeakerPostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeakerPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
