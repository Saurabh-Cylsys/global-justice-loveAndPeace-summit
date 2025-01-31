import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentInvitationComponent } from './sent-invitation.component';

describe('SentInvitationComponent', () => {
  let component: SentInvitationComponent;
  let fixture: ComponentFixture<SentInvitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SentInvitationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SentInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
