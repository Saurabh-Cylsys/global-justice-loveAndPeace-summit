import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderImgComponent } from './header-img.component';

describe('HeaderImgComponent', () => {
  let component: HeaderImgComponent;
  let fixture: ComponentFixture<HeaderImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderImgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
