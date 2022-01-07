import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'app-advanced-line-chart',
  templateUrl: './advanced-line-chart.component.html',
  styleUrls: ['./advanced-line-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdvancedLineChartComponent implements OnInit {

  private colorList = ['#FDBF6F', '#FB9A99', '#B2DF8A', '#A6CEE3', '#CAB2D6', '#FFFF99', '#9FA8DA'];

  private data = [
    [
      {"Framework": "Backbone", "Stars": "27647", "Released": "2010"},
      {"Framework": "Ember", "Stars": "21471", "Released": "2011"},
      {"Framework": "React", "Stars": "150793", "Released": "2013"},
      {"Framework": "Vue", "Stars": "166443", "Released": "2014"},
      {"Framework": "Angular", "Stars": "62342", "Released": "2016"}
    ],
    [
      {"Framework": "Hadoop", "Stars": "154030", "Released": "2003"},
      {"Framework": "Hive", "Stars": "78900", "Released": "2010"},
      {"Framework": "Spark", "Stars": "105000", "Released": "2014"},
      {"Framework": "K8s", "Stars": "120300", "Released": "2015"}
    ]
  ];
  private svg: any;
  private margin = 100;
  private width = 750;
  private height = 600;

  constructor() { }

  ngOnInit(): void {
    this.createSvg();
    this.drawLineChart();
  }

  createSvg() {
    this.svg = d3.select('figure#advanced-line-chart')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
  }

  drawLineChart() {
    // Add the x-axis title
    this.svg.append('text')
      .attr('x', this.width / 2)
      .attr('y', this.height - 50)
      .attr('text-anchor', 'middle')
      .style('font-size', 12)
      .text('Release Years');

    // Add the y-axis title
    this.svg.append('text')
      .attr('transform', 'translate(' + 30 + ',' + ((this.height) / 2) + ') rotate(-90)' )
      .attr('text-anchor', 'middle')
      .style('font-size', 12)
      .text('Stars');

    const chart = this.svg.append('g')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');

    const xScale = d3.scaleLinear()
      .domain([2003, 2016])
      .range([0, this.width - (this.margin * 2)]);

    chart.append('g')
      .attr('transform', 'translate(0,' + (this.height - (this.margin * 2)) + ')')
      //.call(d3.axisBottom(xScale).ticks((this.width - (this.margin * 2)) /80).tickSize(0))
      .call(d3.axisBottom(xScale).tickSize(0))
      .call((g: any) => g.select('.domain').attr('stroke', '#ddd'))
      .call((g: any) => g.selectAll('.tick text').attr('fill', '#ddd').attr('y', 10));

    const yScale = d3.scaleLinear()
      .domain([0, 200000])
      .range([this.height - (this.margin * 2), 0])

    chart.append('g')
      .call(d3.axisLeft(yScale))
      .call((g: any) => g.select('.domain').remove())
      .call((g: any) => g.select('.tick:first-of-type line').remove())
      .call((g: any) => g.selectAll('.tick:not(:first-of-type) line')
        .attr('x2', this.width - (this.margin * 2))
        .attr('stroke', '#ddd'))
      .call((g: any) => g.selectAll('.tick text').attr('fill', '#ddd'))
      // .call((g: any) => g.select('.tick:last-of-type text').clone()
      //   .attr('x', 3)
      //   .attr('text-anchor', 'start')
      //   .attr('font-weight', 'bold')
      //   .text('test'));

    const lineGroup = chart.selectAll('.line-group')
      .data(this.data)
      .join('g')
      .attr('class', 'line-group');

    const line = d3.line()
      .defined( (d: any) => !isNaN(d.Released))
      .x((d: any) => xScale(d.Released))
      .y((d: any) => yScale(d.Stars))
    // .curve(d3.curveMonotoneX);

    //  console.log('lines', line(this.data as any))

    // Draw lines
    lineGroup.append('path')
      .attr('class', 'line')
      .attr('d', (d:any) => line(d))
      .style('fill', 'none')
      .style('stroke', (d: any, i: number) => this.colorList[i])
      .style('stroke-width', '2');

    const tooltip = d3.select('#tooltip');

    // Draw scatter plot
    lineGroup.selectAll('circle')
      .data((d:any[], j:number) =>
        d.map((value, i) => {
          return {color: this.colorList[j], data: value};
      }))
      .join('circle')
      .attr('cx', (d: any, i: number) => xScale(d.data.Released))
      .attr('cy', (d: any, i: number) => yScale(d.data.Stars))
      .attr('r', 5)
      .attr('fill', (d: any) => d.color)
      .on('mouseover', (event: any, d: any) => {
        const clientRect = d3.select(event.currentTarget).node().getBoundingClientRect();
        console.log('bbox', clientRect);
         tooltip.select('.line1').text(d.data.Framework);
         tooltip.select('#line2').text(d.data.Stars);

         const tooltipHeight = parseFloat(tooltip.style('height'));
         console.log('tooltip height:' + tooltipHeight);

       // tooltip.transition().duration(20)
        tooltip
          .style('visibility', 'visible')
          .style('left', (clientRect.right + 20) + 'px')
          .style('top',  (clientRect.top - (tooltipHeight / 2) + (clientRect.width / 2)) + 'px');
      })
      .on('mouseout', (event: any, d: any) => {
       // tooltip.transition().duration(0)
        tooltip
          .style('visibility', 'hidden');
      });


    lineGroup.selectAll('text')
        .data((d: any) => d)
        .join('text')
        .text((d: any) => d.Framework)
        .attr('x', (d: any) => xScale(d.Released))
        .attr('y', (d: any) => yScale(d.Stars) - 7)
        .attr('text-anchor', 'middle');
  }
}
