import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataChangesLineChartComponent } from './data-changes-line-chart.component';

describe('DataChangesLineChartComponent', () => {
  let component: DataChangesLineChartComponent;
  let fixture: ComponentFixture<DataChangesLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataChangesLineChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataChangesLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
