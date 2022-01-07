import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedLineChartComponent } from './advanced-line-chart.component';

describe('AdvancedLineChartComponent', () => {
  let component: AdvancedLineChartComponent;
  let fixture: ComponentFixture<AdvancedLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedLineChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
