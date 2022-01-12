import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollableLineChart2Component } from './scrollable-line-chart2.component';

describe('DataChangesLineChartComponent', () => {
  let component: ScrollableLineChart2Component;
  let fixture: ComponentFixture<ScrollableLineChart2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrollableLineChart2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollableLineChart2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
