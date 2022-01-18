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
  selector: 'app-scrollable-line-chart2',
  templateUrl: './scrollable-line-chart2.component.html',
  styleUrls: ['./scrollable-line-chart2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScrollableLineChart2Component implements OnInit {

  private colorList = ['#FDBF6F', '#FB9A99', '#B2DF8A', '#A6CEE3', '#CAB2D6', '#FFFF99', '#9FA8DA'];

  private margin = 100;
  private width = 750;
  private height = 600;

  private svg: any;
  private chart: any;
  private xScale: any;
  private yScale: any;

  private currentDataSet: any;
  private xAxisData: XAxisData;
  private yAxisData: YAxisData;

  private xyAxisGap = 0;

  private zoom: any;

  private clip: any;

  constructor() {
    this.currentDataSet = DataConst.dayInMonthData1;
    const date = new Date();
    this.xAxisData = new XAxisData(new Date(date.getFullYear(), 1).getTime(),
      new Date(date.getFullYear(), 2, 0).getTime(), xAxisType.dayInMonthType);
    this.yAxisData = new YAxisData(0, 20, 5);
  }

  ngOnInit(): void {
    this.zoom = d3.zoom().scaleExtent([1, 1])
      .translateExtent([[0,0], [28 * 50, this.height]])
      .on('zoom', this.handleZoom.bind(this));

    this.createSvg();
    this.updateXYAxisTitles('Date Range', 'Count');
    this.drawChart();
  }

  createSvg() {
    this.svg = d3.select('div#scrollable-line-chart2')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', [0, 0, this.width, this.height])
      .call(this.zoom)

    // this.svg.on('wheel', (event: any) => {
    //   console.log('wheel event:', event);
    //   this.svg.call(this.zoom.translateBy, event.deltaX, 0);
    // })


    // this.svg.append('rect')
    //   .attr('width', this.width)
    //   .attr('height', this.height)
    //   .attr('fill', '#84afa3')

    // Add the x-axis title
    this.svg.append('text')
      .attr('class', 'x-axis-title')
      .attr('x', this.width / 2)
      .attr('y', this.height - 50)
      .attr('text-anchor', 'middle')
      .style('font-size', 12);

    // Add the y-axis title
    this.svg.append('text')
      .attr('class', 'y-axis-title')
      .attr('transform', 'translate(' + 30 + ',' + ((this.height) / 2) + ') rotate(-90)' )
      .attr('text-anchor', 'middle')
      .style('font-size', 12);

    // Add the chart group.
    this.chart = this.svg.append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')')

    // Add the x-axis group.
    this.chart.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(' + this.xyAxisGap + ',' + (this.height - (this.margin * 2)) + ')');


    d3.svg('./assets/keyboard_arrow_left_black_24dp.svg').then(data => {
      this.svg.append('g')
        .attr('class', 'left-arrow')
        .attr('transform', 'translate(' +  55 + ',' + (this.height - this.margin ) + ')')
        .on('click', (event: any, d: any) => {
          this.svg.call(this.zoom.translateBy, 150, 0);
        })
        .node().appendChild(data.documentElement)
    });

    d3.svg('./assets/keyboard_arrow_right_black_24dp.svg').then(data => {
      this.svg.append('g')
        .attr('class', 'right-arrow')
        .attr('transform', 'translate(' + (this.width - 40) + ',' + (this.height - this.margin) + ')')
        .on('click', (event: any, d: any) => {
          this.svg.call(this.zoom.translateBy, -150, 0);
        })
        .node().appendChild(data.documentElement)
    })

    // Add the y-axis group.
    this.chart.append('g')
      .attr('class', 'y-axis')


    // Add a clipPath: everything out of this area won't be drawn.
    this.clip = this.chart.append("defs").append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", this.width - this.margin - 50)
      .attr("height", this.height - this.margin)
      .attr("x", 0)
      .attr("y", 0);
  }

  updateXYAxisTitles(xTitle: string, yTitle: string) {
    // Set the x-axis title
    this.svg.select('.x-axis-title')
      .text(xTitle);

    // Add the y-axis title
    this.svg.select('.y-axis-title')
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
    // Set the x-axis scale.-45
    // scaleTime is local time. scaleUtc is utc time.
    this.xScale = d3.scaleTime()
      .domain([xAxisData.minTimestampMillis ,xAxisData.maxTimestampMillis]);

    let axisBottom: any = d3.axisBottom(this.xScale);

    if (xAxisData?.type) {
      switch (xAxisData.type) {
        case xAxisType.every15MinType:
          this.xScale.range([0, this.width - (this.margin * 2)]);
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
          this.xScale.range([0, this.width - (this.margin * 2)]);
          axisBottom = d3.axisBottom(this.xScale)
            .ticks(d3.timeDay.every(1))
            .tickSize(0)
            .tickFormat((domainValue:any) => d3.timeFormat('%A')(domainValue))
          break;
        case xAxisType.dayInMonthType:
          this.xScale.domain([xAxisData.minTimestampMillis ,1644767999000])
          const width = (28 * 50) - (this.margin * 2 + 50);
          this.xScale.range([5, this.width - (this.margin * 2) + 50]);
          axisBottom = d3.axisBottom(this.xScale)
            .ticks(d3.timeDay.every(1))
            .tickSize(0)
            .tickFormat((domainValue: any) => 'long-name' + d3.timeFormat('%e')(domainValue));
          break;
      }
    }


    // Draw the x-axis
    this.chart.select('.x-axis')
      .call(axisBottom)
      .call((g: any) => g.select('.domain').attr('stroke', '#ddd'))
      .call((g: any) => g.selectAll('.tick text').attr('fill', '#000')
        .attr('y', 10)
        .attr('transform', 'translate(-5, 0) rotate(-30)')
        .style('text-anchor', 'end'));
  }

  drawYAxis(yAxisData: YAxisData) {
    // Set the y-axis scale.
    this.yScale = d3.scaleLinear()
      .domain([yAxisData.min, yAxisData.max])
      .range([this.height - (this.margin * 2), 0]);

    // Draw the y-axis
    this.chart.select('.y-axis')
      .call(d3.axisLeft(this.yScale).ticks(yAxisData.count))
      .call((g: any) => g.select('.domain').remove())
      .call((g: any) => g.selectAll('.tick line')
        .attr('x1', this.xyAxisGap)
        .attr('x2', this.width - this.margin - 50 + this.xyAxisGap)
        .attr('stroke', '#ddd'))
      .call((g: any) => g.selectAll('.tick text').attr('fill', '#000'));
  }

  drawLines(newData: any) {
    const lineGroup = this.chart.selectAll('.line-group')
      .data(newData)
      .join('g')
      .attr('class', 'line-group')
      .attr('transform', 'translate(' + this.xyAxisGap + ', 0)')
      .attr("clip-path", "url(#clip)")

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
    // lineGroup.selectAll('text')
    //   .data((d: any) =>  {
    //     //  console.log('data label:', d);
    //     return d.data;
    //   })
    //   .join('text')
    //   .attr('class', 'data-label')
    //   .text((d: any) => d.count > 0 ? d.count : '')
    //   .attr('x', (d: any) => this.xScale(this.getXValue(d)))
    //   .attr('y', (d: any) => this.yScale(d.count) - 7)
    //   .attr('text-anchor', 'middle')
    //   .style('font-size', 10);


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
        console.log('event:', event);
        const x = event.pageX;
        const y = event.pageY;
        const clientRect = d3.select(event.currentTarget).node().getBoundingClientRect();
        console.log('bbox', clientRect);
        //  console.log('box left, top:', (clientRect.right + 20) + ', ' + (clientRect.top - (tooltipHeight / 2) + (clientRect.width / 2)))
        tooltip.select('#line1').text(d.name);
        tooltip.select('#line2').text(d.data.count);
        const tooltipHeight = parseFloat(tooltip.style('height'));
   //     console.log('tooltip height:' + tooltipHeight);
        tooltip
          .style('visibility', 'visible')
          .style('left', (clientRect.right + 10) + 'px')
          .style('top',  (y - (tooltipHeight / 2)) + 'px');
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

  handleZoom(e: any) {
    // console.log('handleZoom', e);
    const currentTransform = e.transform;
    console.log('currentTransform:', currentTransform);

    if (this.chart) {
      this.reDraw();
    }
    else {
      console.log('no chart access');
    }
  }

  reDraw() {
    let newX = d3.zoomTransform(this.svg.node()).rescaleX(this.xScale);
    // console.log('reDraw: ', newX);
    let axisBottom = d3.axisBottom(newX)
      .ticks(d3.timeDay.every(1))
      .tickSize(0)
      .tickFormat((domainValue: any) => 'long-name' + d3.timeFormat('%e')(domainValue));
    this.chart.select('.x-axis')
      .call(axisBottom)
      .call((g: any) => g.select('.domain').attr('stroke', '#ddd'))
      .call((g: any) => g.selectAll('.tick text').attr('fill', '#000').attr('y', 10)
        .attr('transform', 'translate(-10, 0) rotate(-30)')
        .style('text-anchor', 'end'));

    const line = d3.line()
      .defined( (d: any) => !isNaN(d.count))
      .x((d: any) => newX(this.getXValue(d)))
      .y((d: any) => this.yScale(d.count));
    const lineGroup = this.chart.selectAll('.line-group')

    lineGroup.selectAll('.line')
      .attr('d', (d: any) => line(d.data));

    lineGroup.selectAll('circle')
      .attr('cx', (d: any, i: number) => newX(this.getXValue(d.data)))
      .attr('cy', (d: any, i: number) => this.yScale(d.data.count))
  }
}
