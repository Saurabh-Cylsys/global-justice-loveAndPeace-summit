import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeacekeeperHeaderComponent } from './peacekeeper-header.component';

describe('PeacekeeperHeaderComponent', () => {
  let component: PeacekeeperHeaderComponent;
  let fixture: ComponentFixture<PeacekeeperHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeacekeeperHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeacekeeperHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
