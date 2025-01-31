import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeacekeeperMainComponent } from './peacekeeper-main.component';

describe('PeacekeeperMainComponent', () => {
  let component: PeacekeeperMainComponent;
  let fixture: ComponentFixture<PeacekeeperMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeacekeeperMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeacekeeperMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
