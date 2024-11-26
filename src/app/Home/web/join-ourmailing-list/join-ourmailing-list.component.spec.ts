import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinOurmailingListComponent } from './join-ourmailing-list.component';

describe('JoinOurmailingListComponent', () => {
  let component: JoinOurmailingListComponent;
  let fixture: ComponentFixture<JoinOurmailingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinOurmailingListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinOurmailingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
