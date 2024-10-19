import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeealltrainerComponent } from './seealltrainer.component';

describe('SeealltrainerComponent', () => {
  let component: SeealltrainerComponent;
  let fixture: ComponentFixture<SeealltrainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeealltrainerComponent]
    });
    fixture = TestBed.createComponent(SeealltrainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
