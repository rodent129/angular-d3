import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  private data = [
    {"Framework": "Backbone", "Stars": "27647", "Released": "2010"},
    {"Framework": "Ember", "Stars": "21471", "Released": "2011"},
    {"Framework": "React", "Stars": "150793", "Released": "2013"},
    {"Framework": "Vue", "Stars": "166443", "Released": "2014"},
    {"Framework": "Angular", "Stars": "62342", "Released": "2016"}
  ];
  private svg: any;
  private margin = 100;
  private width = 750;
  private height = 600;

  constructor() { }

  ngOnInit(): void {
    this.createSvg();
    this.drawLines();
  }

  createSvg() {
    this.svg = d3.select('figure#line-chart')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
  }

  drawLines() {

    // Add the x-axis label
    this.svg.append('text')
      .attr('x', this.width / 2)
      .attr('y', this.height - 50)
      .attr('text-anchor', 'middle')
      .style('font-size', 12)
      .text('Release Years');

    // Add the y-axis label
    this.svg.append('text')
      .attr('transform', 'translate(' + 30 + ',' + ((this.height) / 2) + ') rotate(-90)' )
      .attr('text-anchor', 'middle')
      .style('font-size', 12)
      .text('Stars');

    const chart = this.svg.append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
    const xScale = d3.scaleLinear()
      .domain([2009, 2017])
      .range([0, this.width - (this.margin * 2)]);
    // draw x-axis
    chart.append('g')
      .attr('transform', 'translate(0, ' + (this.height - this.margin * 2) + ')')
      .call(d3.axisBottom(xScale).tickFormat(d3.format('d')));

    const yScale = d3.scaleLinear()
      .domain([0, 200000])
      .range([this.height - (this.margin * 2), 0]);

    // draw y-axis
    chart.append('g')
      .call(d3.axisLeft(yScale));

    const line = d3.line()
      .x((d: any) => xScale(d.Released))
      .y((d: any) => yScale(d.Stars))
      // .curve(d3.curveMonotoneX);

  //  console.log('lines', line(this.data as any))

    // Draw lines
    chart.append('g')
      .selectAll('path')
      .data([this.data])
      .enter()
      .append('path')
      .attr('class', 'line')
      .attr('d', (d: any) => line(d))
      .style('fill', 'none')
      .style('stroke', '#CC0000')
      .style('stroke-width', '2');


    // Add dots
    const dotsGroup = chart.append('g');
    // Add dot circles
    dotsGroup.selectAll('circle')
      .data(this.data, (d: any) => d.Framework)
      .join('circle')
      .attr('cx', (d: any) => xScale(d.Released))
      .attr('cy', (d: any) => yScale(d.Stars))
      .attr('r', 5)
      .attr('fill', '#69b3a2');

    // Add labels
    const labelsGroup = chart.append('g');
    // Add labels
    labelsGroup.selectAll('text')
      .data(this.data, (d: any) => d.Framework)
      .join('text')
      .text((d: any) => d.Framework)
      .attr('x', (d: any) => xScale(d.Released))
      .attr('y', (d: any) => yScale(d.Stars) - 10)
      .attr('text-anchor', 'middle');
  }
}
