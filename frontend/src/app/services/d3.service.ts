import { Injectable } from "@angular/core";
import * as d3 from "d3";
import { DataForD3, Stock } from "../interfaces/charts.interface";

@Injectable({
  providedIn: 'root',
})
export class D3Service {
  constructor() {}

  handleStocksForD3(stocks: Array<Stock>): Array<DataForD3[]> {
    let arrayOfStocks = stocks.map((stock: Stock): Array<DataForD3> => {
      let minFromMin = Math.min(
        ...stock.timestamps.map((timestamp) => +timestamp.low)
      );
      let maxFromMax = Math.max(
        ...stock.timestamps.map((timestamp) => +timestamp.high)
      );
      return stock.timestamps.map((timestamp) => ({
        date: new Date(timestamp.date),
        max: `${+timestamp.high}`,
        min: `${+timestamp.low}`,
        topRange: maxFromMax,
        bottomRange: minFromMin,
      }));
    });
    return arrayOfStocks;
  }

  createChart(
    container: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
    dataForD3: DataForD3[],
    className: string
  ) {
    let data = dataForD3;
    let margin = { top: 10, right: 30, bottom: 30, left: 60 },
      width = 700 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    let svg = container
      .append('svg')
      .attr('class', className)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    let x = d3
      .scaleTime()
      .domain([data[data.length - 1].date, data[0].date])
      .range([0, width])
      .nice();

    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));

    let y = d3
      .scaleLinear()
      .domain([data[0].bottomRange, data[0].topRange])
      .range([height, 0]);

    svg.append('g').call(d3.axisLeft(y));

    this.createPath(svg, data, 'max', x, y);
    this.createPath(svg, data, 'min', x, y);

    this.createTooltip(container, svg, data, 'max', x, y);
    this.createTooltip(container, svg, data, 'min', x, y);
  }

  createPath(
    svg: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
    data: DataForD3[],
    property: string,
    x: d3.ScaleTime<number, number, never>,
    y: d3.ScaleLinear<number, number, never>
  ) {
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-width', 1.5)
      .attr(
        'd',
        <any>d3
          .line()
          .x(function (d: any) {
            return x(d.date);
          })
          .y(function (d: any) {
            return y(d[property]);
          })
      );
  }

  createTooltip(
    container: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
    svg: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
    data: DataForD3[],
    property: string,
    x: d3.ScaleTime<number, number, never>,
    y: d3.ScaleLinear<number, number, never>
  ) {
    const Tooltip = container
      .append('div')
      .style('opacity', 0)
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('border-width', '2px')
      .style('border-radius', '5px')
      .style('padding', '5px');

    const mouseover = function () {
      Tooltip.style('opacity', 1);
    };

    const mousemove = function (event: any, d: any) {
      Tooltip.html('Exact value: ' + d[property])
        .style('left', d3.pointer(event)[0] + 'px')
        .style('top', d3.pointer(event)[1] + 'px');
    };

    const mouseleave = function () {
      Tooltip.style('opacity', 0);
    };

    svg
      .append('g')
      .selectAll('dot')
      .data(data)
      .join('circle')
      .attr('class', 'myCircle')
      .attr('cx', (d: any) => x(d.date))
      .attr('cy', (d: any) => y(d[property]))
      .attr('r', 4)
      .attr('stroke', '#69b3a2')
      .attr('stroke-width', 3)
      .attr('fill', 'white')
      .on('mouseover', mouseover)
      .on('mousemove', mousemove)
      .on('mouseleave', mouseleave);
  }
}
