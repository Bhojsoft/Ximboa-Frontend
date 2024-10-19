import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelevanceDataComponent } from './relevance-data.component';

describe('RelevanceDataComponent', () => {
  let component: RelevanceDataComponent;
  let fixture: ComponentFixture<RelevanceDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RelevanceDataComponent]
    });
    fixture = TestBed.createComponent(RelevanceDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
