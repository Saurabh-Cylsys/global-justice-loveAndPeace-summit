import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewBadgeComponent } from './preview-badge.component';

describe('PreviewBadgeComponent', () => {
  let component: PreviewBadgeComponent;
  let fixture: ComponentFixture<PreviewBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewBadgeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
