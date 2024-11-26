import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaPharmaPreconnectComponent } from './agenda-pharma-preconnect.component';

describe('AgendaPharmaPreconnectComponent', () => {
  let component: AgendaPharmaPreconnectComponent;
  let fixture: ComponentFixture<AgendaPharmaPreconnectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendaPharmaPreconnectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendaPharmaPreconnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
