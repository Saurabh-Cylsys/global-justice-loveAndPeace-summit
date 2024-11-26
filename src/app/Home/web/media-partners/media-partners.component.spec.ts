import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaPartnersComponent } from './media-partners.component';

describe('MediaPartnersComponent', () => {
  let component: MediaPartnersComponent;
  let fixture: ComponentFixture<MediaPartnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaPartnersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
