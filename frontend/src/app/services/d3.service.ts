import { Injectable } from "@angular/core";
import * as d3 from "d3";
import { DataForD3, Stock } from "../interfaces/charts.interface";

@Injectable({
  providedIn: 'root'
})
export class D3Service {
  constructor() {}

  handleStocksForD3(stocks: Array<Stock>): Array<DataForD3[]> {
    let arrayOfStocks = stocks.map((stock: Stock): Array<DataForD3> => {
      let minFromMin = Math.min(...stock.timestamps.map((timestamp) => +timestamp.low));
      let maxFromMax = Math.max(...stock.timestamps.map((timestamp) => +timestamp.high));
      return stock.timestamps.map((timestamp) => ({ date: new Date(timestamp.date), max: `${+timestamp.high}`, min: `${+timestamp.low}`, topRange: maxFromMax, bottomRange: minFromMin }))
    })
    return arrayOfStocks;
  }

  createChart(container: d3.Selection<d3.BaseType, unknown, HTMLElement, any>, dataForD3: DataForD3[]) {
    let data = dataForD3;
    let margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    let svg = container
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    let x = d3.scaleTime()
    .domain([data[data.length - 1].date, data[0].date])
    .range([0, width])
    .nice()

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    let y = d3.scaleLinear()
      .domain( [data[0].bottomRange, data[0].topRange])
      .range([ height, 0 ]);

    svg.append("g")
      .call(d3.axisLeft(y));

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 1.5)
      .attr("d", <any>d3.line()
        .curve(d3.curveBasis)
        .x(function(d: any) { return x(d.date) })
        .y(function(d: any) { return y(d.max) })
      )

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 1.5)
      .attr("d", <any>d3.line()
        .curve(d3.curveBasis)
        .x(function(d: any) { return x(d.date) })
        .y(function(d: any) { return y(d.min) })
      )
  }
}
