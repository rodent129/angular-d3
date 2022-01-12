import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarComponent } from './bar/bar.component';
import { PieComponent } from './pie/pie.component';
import { ScatterPlotComponent } from './scatter-plot/scatter-plot.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { AdvancedLineChartComponent } from './advanced-line-chart/advanced-line-chart.component';
import { DataChangesLineChartComponent } from './data-changes-line-chart/data-changes-line-chart.component';
import { ScrollableLineChartComponent } from './scrollable-line-chart/scrollable-line-chart.component';
import { ScrollableLineChart2Component } from "./scrollable-line-chart2/scrollable-line-chart2.component";

@NgModule({
  declarations: [
    AppComponent,
    BarComponent,
    PieComponent,
    ScatterPlotComponent,
    LineChartComponent,
    AdvancedLineChartComponent,
    DataChangesLineChartComponent,
    ScrollableLineChartComponent,
    ScrollableLineChart2Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
