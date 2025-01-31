import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBadgeComponent } from './edit-badge.component';

describe('EditBadgeComponent', () => {
  let component: EditBadgeComponent;
  let fixture: ComponentFixture<EditBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBadgeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
