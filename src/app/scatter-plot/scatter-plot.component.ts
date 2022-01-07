import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-scatter-plot',
  templateUrl: './scatter-plot.component.html',
  styleUrls: ['./scatter-plot.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScatterPlotComponent implements OnInit {

  private data = [
    {"Framework": "Vue", "Stars": "166443", "Released": "2014"},
    {"Framework": "React", "Stars": "150793", "Released": "2013"},
    {"Framework": "Angular", "Stars": "62342", "Released": "2016"},
    {"Framework": "Backbone", "Stars": "27647", "Released": "2010"},
    {"Framework": "Ember", "Stars": "21471", "Released": "2011"},
  ];
  private svg: any;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

  constructor() { }

  ngOnInit(): void {
    this.createSvg();
    this.drawPlot();
  }

  createSvg() {
    this.svg = d3.select('figure#scatter-plot')
      .append('div')
      .append('svg')
      .attr('width', this.width + (this.margin * 2))
      .attr('height', this.height + (this.margin * 2))
      //responsive SVG needs these 2 attributes and no width and height attr
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr('viewBox', [0, 0, this.width + (this.margin * 2), this.height + (this.margin * 2)])
      .append('g')
      .attr('transform', 'translate(' + this.margin + ', ' + this.margin + ')');
  }

  drawPlot() {
    // Get the xScale
    const xScale = d3.scaleLinear()
     // .domain([2008, 2018])
      .domain([2009, 2017])
      .range([0, this.width]);

    // Draw the x-axis, can format the axis format.
    // tick => set the count
    // tickFormat => format the text
    this.svg.append('g')
      .attr('transform', 'translate(0, ' + this.height + ')')
      .call(d3.axisBottom(xScale).tickFormat(d3.format('d')));
     // .call(d3.axisBottom(xScale).ticks(4).tickFormat(d3.format('d')));

    const yScale = d3.scaleLinear()
      .domain([0, 200000])
      .range([this.height, 0]);

    // Draw the y-axis
    this.svg.append('g')
      .call(d3.axisLeft(yScale));

    // Add dots
    const dotsGroup = this.svg.append('g');
    // Add dot circles
    dotsGroup.selectAll('circle')
      .data(this.data, (d: any) => d.Framework)
      .join('circle')
      .attr('cx', (d: any) => xScale(d.Released))
      .attr('cy', (d: any) => yScale(d.Stars))
      .attr('r', 5)
      .attr('fill', '#69b3a2');

    // Add labels
    const labelsGroup = this.svg.append('g');
    // Add labels
    labelsGroup.selectAll('text')
      .data(this.data, (d: any) => d.Framework)
      .join('text')
      .text((d: any) => d.Framework)
      .attr('x', (d: any) => xScale(d.Released))
      .attr('y', (d: any) => yScale(d.Stars) - 7)
      .attr('text-anchor', 'middle');
  }

}
