import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollableLineChartComponent } from './scrollable-line-chart.component';

describe('ScrollableLineChartComponent', () => {
  let component: ScrollableLineChartComponent;
  let fixture: ComponentFixture<ScrollableLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrollableLineChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollableLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
