import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeacekeeperLeftpanelComponent } from './peacekeeper-leftpanel.component';

describe('PeacekeeperLeftpanelComponent', () => {
  let component: PeacekeeperLeftpanelComponent;
  let fixture: ComponentFixture<PeacekeeperLeftpanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeacekeeperLeftpanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeacekeeperLeftpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
