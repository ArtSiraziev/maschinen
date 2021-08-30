import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { combineLatest, map, switchMap, take } from 'rxjs';
import { CouchDBService } from './services/couchdb.service';
import { StockService } from './services/stock.service';
import { stock1, stock2, stock3 } from './models/stock.const';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AppService {

  constructor(
    private readonly couchDBService: CouchDBService,
    private readonly stockService: StockService,
    private readonly httpService: HttpService,
  ) { }
  
  createDBs() {
    this.createDB(stock1);
    this.createDB(stock2);
    this.createDB(stock3);
  }

  createDB(stock: {name: string, url: string}) {
    this.couchDBService.createDb(stock.name)
      .then( () => this.couchDBService.createDesignDocument(stock.name) )
      .then( (value) => value.subscribe() )
      .then( () => this.insertData(stock))
      .catch((error) => console.log(error) )
      .finally(() => this.updateDB());
  }

  insertData({ name, url }): void {
    this.httpService.get(url)
      .pipe(
        map(({ data }) => this.couchDBService.createDocumentData(data)),
      )
      .subscribe(
        (refinedData) => this.updateOrinserData(name, refinedData)
      )
  }

  updateOrinserData(dbName: string, data) {
    this.couchDBService.isDocExists(dbName).then(
      (value) => {
        value ? this.couchDBService.updateDocument(dbName, data) : this.couchDBService.insertDocument(dbName, data)
      }
    )
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  updateDB() {
    combineLatest([
      this.getNewData(stock1),
      this.getNewData(stock2),
      this.getNewData(stock3)
    ]).pipe(take(1)).subscribe();
  }

  getNewData({ name, url }) {
    return this.stockService.getStockApiData(url)
      .pipe(
        map( ({ data }) => this.couchDBService.createDocumentData(data)),
        switchMap((data) => this.couchDBService.updateDocument(name, data))
      )
  }
}
