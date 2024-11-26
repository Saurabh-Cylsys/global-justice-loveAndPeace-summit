import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoShouldAttendComponent } from './who-should-attend.component';

describe('WhoShouldAttendComponent', () => {
  let component: WhoShouldAttendComponent;
  let fixture: ComponentFixture<WhoShouldAttendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoShouldAttendComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhoShouldAttendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
