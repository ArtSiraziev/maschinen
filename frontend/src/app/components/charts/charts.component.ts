import { AfterViewInit, Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as d3 from 'd3'
import { combineLatest, interval, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators'
import { stocksNames } from 'src/app/constants/charts.const';
import { DataForD3, Stock } from 'src/app/interfaces/charts.interface';
import { PouchDBService } from './../../services/pouch-db.service';
import { D3Service } from './../../services/d3.service';

@UntilDestroy()
@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements AfterViewInit {

  public stocks: Array<{title: string; currentValue: number, min: number, max: number}> = [];
  private inervalForRefresh: Subscription;

  constructor(private readonly pouchService: PouchDBService, private readonly d3Service: D3Service) { }

  ngAfterViewInit(): void {
    this.getData();
  }

  setInterval() {
    if(this.inervalForRefresh) return
    this.inervalForRefresh = interval(5*60*1000).pipe(
      untilDestroyed(this)
    ).subscribe(
      () => this.refreshCharts()
    )
  }

  refreshCharts(): void {
    this.clearCharts();
    this.getData();
  }

  clearCharts(): void {
    d3.select(`.${stocksNames[0]}`).remove();
    d3.select(`.${stocksNames[1]}`).remove();
    d3.select(`.${stocksNames[2]}`).remove();
  }

  getData() {
    combineLatest([
      this.pouchService.getStocks(stocksNames[0]),
      this.pouchService.getStocks(stocksNames[1]),
      this.pouchService.getStocks(stocksNames[2])
    ]).pipe(
      tap((stocks) => this.handleStocksForMetadata(stocks as any)),
      map((stocks) => this.d3Service.handleStocksForD3(stocks as any)),
      untilDestroyed(this)
    ).subscribe(
      (stocks: Array<DataForD3[]>) => {
        this.createCharts(stocks);
        this.setInterval();
      }
    )
  }

  createCharts([data1, data2, data3]: Array<DataForD3[]>) {
    const container1 = d3.select(".my_dataviz_1");
    const container2 = d3.select(".my_dataviz_2");
    const container3 = d3.select(".my_dataviz_3");
    this.d3Service.createChart(container1, data1, stocksNames[0]);
    this.d3Service.createChart(container2, data2, stocksNames[1]);
    this.d3Service.createChart(container3, data3, stocksNames[2]);
  }

  handleStocksForMetadata(stocks: Array<Stock>) {
    this.stocks = stocks.map((stock: Stock) => {
      return { title: stock.name, currentValue: +stock.timestamps[0].close, min: +stock.timestamps[0].low, max: +stock.timestamps[0].high}
    });
  }
}
