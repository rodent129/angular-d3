import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataConst } from "../data/data-const";
import * as d3 from "d3";

enum xAxisType {
  every15MinType = 1,
  hourlyType ,
  dayInWeekType,
  dateInWeekType,
  monthlyType,
  dateInMonthType,
  dayInMonthType,
  yearlyType,
  quarterlyType
}

class XAxisData {
  minTimestampMillis: number;
  maxTimestampMillis: number;
  type?: xAxisType;

  constructor(minTimestampMillis: number, maxTimestampMillis: number, type?: xAxisType) {
    this.minTimestampMillis = minTimestampMillis;
    this.maxTimestampMillis = maxTimestampMillis;
    this.type = type;
  }
}

class YAxisData {
  min: number;
  max: number;
  count?: number;

  constructor(min: number, max: number, count?: number) {
    this.min = min;
    this.max = max;
    this.count = count;
  }
}

@Component({
  selector: 'app-scrollable-line-chart',
  templateUrl: './scrollable-line-chart.component.html',
  styleUrls: ['./scrollable-line-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScrollableLineChartComponent implements OnInit {

  private colorList = ['#FDBF6F', '#FB9A99', '#B2DF8A', '#A6CEE3', '#CAB2D6', '#FFFF99', '#9FA8DA'];

  private width = 750;
  private height = 600;
  private margin = 100;
  private leftPanelWidth = 100;
  private rightBottomPanelWidth = this.width - this.leftPanelWidth;
  private rightBottomPanelHeight = 50;
  private rightUpperPanelWidth = this.width - this.leftPanelWidth;
  private rightUpperPanelHeight = this.height - this.rightBottomPanelHeight;
  private xyAxisGap = 10;


  private wholeContainer: any;
  private svgFloat: any;
  private svgBottom: any;
  private scrollableContainer: any;
  private svgScrollable: any;
  private xScale: any;
  private yScale: any;

  private currentDataSet: any;
  private xAxisData: XAxisData;
  private yAxisData: YAxisData;


  constructor() {
    this.currentDataSet = DataConst.dayInMonthData1;
    const date = new Date();
    console.log('date month:', date.getMonth());
    this.xAxisData = new XAxisData(new Date(date.getFullYear(), 1).getTime(),
      new Date(date.getFullYear(), 2, 0).getTime(), xAxisType.dayInMonthType);
    this.yAxisData = new YAxisData(0, 21, 6);
  }

  ngOnInit(): void {
    this.createSvg();
    this.updateXYAxisTitles('Date Range', 'Agent/Line count');
    this.drawChart();
  }

  createSvg() {
    this.wholeContainer = d3.select('figure#scrollable-line-chart')
      .append('div')
      .attr('class', 'container')

    this.svgFloat = this.wholeContainer
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'y-container');

    // Add the y-axis title
    this.svgFloat.append('text')
      .attr('class', 'y-axis-title')
      .attr('transform', 'translate(' + 30 + ',' + ((this.height) / 2) + ') rotate(-90)' )
      .attr('text-anchor', 'middle')
      .style('font-size', 12);

    // Add the y-axis group.
    this.svgFloat.append('g')
      .attr('transform', 'translate(' + this.leftPanelWidth + ',' + this.leftPanelWidth + ')')
      .attr('class', 'y-axis');

    const rightContainer = this.wholeContainer.append('div')
      .attr('class', 'right-container')
      .style('transform', 'translate(' + this.leftPanelWidth + 'px, ' + 0 + 'px)');

    this.scrollableContainer = rightContainer.append('div')
      .attr('class', 'scrollable-container')
      .style('height', this.rightUpperPanelHeight + 'px')
      .style('width', this.rightUpperPanelWidth + 'px');

    this.svgScrollable = this.scrollableContainer.append('svg')
      .attr('width', this.rightUpperPanelWidth)
      .attr('height', this.rightUpperPanelHeight)
      .style('display', 'block')
      .attr('x', -5)

    // Add the x-axis group.
    this.svgScrollable.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(' + this.xyAxisGap + ',' + (this.rightUpperPanelHeight - this.rightBottomPanelHeight) + ')');

    this.svgBottom = rightContainer
      .append('svg')
      .attr('width', this.rightBottomPanelWidth)
      .attr('height', this.rightBottomPanelHeight);

    // Add the x-axis title
    this.svgBottom.append('text')
      .attr('class', 'x-axis-title')
      .attr('x', this.rightBottomPanelWidth / 2)
      .attr('y', this.rightBottomPanelHeight - 20)
      .attr('text-anchor', 'middle')
      .style('font-size', 12);

  }

  updateXYAxisTitles(xTitle: string, yTitle: string) {
    // Set the x-axis title
    this.svgBottom.select('.x-axis-title')
      .text(xTitle);

    // Add the y-axis title
    this.svgFloat.select('.y-axis-title')
      .text(yTitle);
  }

  drawChart() {
    this.drawXAxis(this.xAxisData);
    this.drawYAxis(this.yAxisData);
    this.drawLines(this.currentDataSet);
  }

  drawXAxis(xAxisData: XAxisData) {
    //domain is the input data
    //range is the output data
    // Set the x-axis scale.
    // scaleTime is local time. scaleUtc is utc time.
    this.xScale = d3.scaleTime()
      .domain([xAxisData.minTimestampMillis ,xAxisData.maxTimestampMillis]);

    let axisBottom: any = d3.axisBottom(this.xScale);

    if (xAxisData?.type) {
      switch (xAxisData.type) {
        case xAxisType.every15MinType:
          this.xScale.range([0, this.rightUpperPanelWidth])
          axisBottom = d3.axisBottom(this.xScale)
            .ticks(d3.timeMinute.every(15))
            .tickSize(0)
            .tickFormat((domainValue:any) => {
                const endTime = domainValue.getTime();
                const startTime = endTime - (15 * 60 * 1000);
                //  console.log('domainValue', domainValue.getTime());
                const format = d3.timeFormat('%H:%M');
                return format(new Date(startTime)) + ' - ' + format(new Date(endTime));
              }
            );
          break;
        case xAxisType.dayInWeekType:
          this.xScale.range([0, this.width - this.rightUpperPanelWidth])
          axisBottom = d3.axisBottom(this.xScale)
            .ticks(d3.timeDay.every(1))
            .tickSize(0)
            .tickFormat((domainValue:any) => d3.timeFormat('%A')(domainValue))
          break;
        case xAxisType.dayInMonthType:
          const width = 28 * 50;
          this.svgScrollable.attr('width', width + 20);
          this.xScale.range([0, width]);
          axisBottom = d3.axisBottom(this.xScale)
            .ticks(d3.timeDay.every(1))
            .tickSize(0)
            .tickFormat((domainValue: any) => d3.timeFormat('%e')(domainValue) + 'dd');
          break;
      }
    }


    // Draw the x-axis
    this.svgScrollable.select('.x-axis')
      .call(axisBottom)
      .call((g: any) => g.select('.domain').attr('stroke', '#ddd'))
      .call((g: any) => g.selectAll('.tick text').attr('fill', '#000').attr('y', 10).attr('text-anchor', 'start'));
  }

  drawYAxis(yAxisData: YAxisData) {
    // Set the y-axis scale.
    this.yScale = d3.scaleLinear()
      .domain([yAxisData.min, yAxisData.max])
      .nice(yAxisData.count)
      .range([this.height - (this.margin * 2), 0]);

    // Draw the y-axis
    this.svgFloat.select('.y-axis')
      .call(d3.axisLeft(this.yScale).ticks(yAxisData.count))
      .call((g: any) => g.select('.domain').remove())
      .call((g: any) => g.selectAll('.tick line')
        .attr('x1', this.xyAxisGap)
        .attr('x2', this.rightUpperPanelWidth + this.xyAxisGap)
        .attr('stroke', '#ddd')
      )
      .call((g: any) => g.selectAll('.tick text').attr('fill', '#000'));
  }

  drawLines(newData: any) {
    const lineGroup = this.svgScrollable.selectAll('.line-group')
      .data(newData)
      .join('g')
      .attr('class', 'line-group')
      .attr('transform', 'translate(' + this.xyAxisGap + ',' + this.margin + ')')

    const line = d3.line()
      .defined( (d: any) => !isNaN(d.count))
      .x((d: any) => this.xScale(this.getXValue(d)))
      .y((d: any) => this.yScale(d.count));

    lineGroup.selectAll('.line')
      .data((d:any, i: number) => [{color: this.colorList[i], data: d.data}])
      .join('path')
      .attr('class', 'line')
      .attr('d', (d: any) => line(d.data))
      .style('fill', 'none')
      .style('stroke', (d: any, i: number) => d.color)
      .style('stroke-width', '2');


    // Add the data label
    lineGroup.selectAll('text')
      .data((d: any) =>  {
        //  console.log('data label:', d);
        return d.data;
      })
      .join('text')
      .attr('class', 'data-label')
      .text((d: any) => d.count > 0 ? d.count : '')
      .attr('x', (d: any) => this.xScale(this.getXValue(d)))
      .attr('y', (d: any) => this.yScale(d.count) - 7)
      .attr('text-anchor', 'middle')
      .style('font-size', 10);


    const tooltip = d3.select('#tooltip');

    // Draw scatter plot
    lineGroup.selectAll('circle')
      .data((d:any, i:number) => {
        const valueList: any[] = d.data;
        return valueList?.map(value => {
          return {color: this.colorList[i], name: d.name, data: value};
        })
      })
      .join('circle')
      .attr('cx', (d: any, i: number) => this.xScale(this.getXValue(d.data)))
      .attr('cy', (d: any, i: number) => this.yScale(d.data.count))
      .attr('r', 5)
      .attr('fill', (d: any) => d.color)
      .on('mouseover', (event: any, d: any) => {
        const clientRect = d3.select(event.currentTarget).node().getBoundingClientRect();
        // console.log('bbox', clientRect);
        tooltip.select('#line1').text(d.name);
        tooltip.select('#line2').text(d.data.count);

        const tooltipHeight = parseFloat(tooltip.style('height'));
        //     console.log('tooltip height:' + tooltipHeight);

        tooltip
          .style('visibility', 'visible')
          .style('left', (clientRect.right + 20) + 'px')
          .style('top',  (clientRect.top - (tooltipHeight / 2) + (clientRect.width / 2)) + 'px');
      })
      .on('mouseout', (event: any, d: any) => {
        tooltip
          .style('visibility', 'hidden');
      });
  }

  getXValue(d: any) {
    if (this.xAxisData?.type) {
      switch (this.xAxisData.type) {
        case xAxisType.every15MinType:
          return d.endTime;
        case xAxisType.dayInWeekType:
          return d.startTime;
        case xAxisType.dayInMonthType:
          return d.startTime;
      }
    }
    return d.endTime;
  }

}
