import { Injectable } from "@nestjs/common";
import { combineLatest, interval, map, switchMap, take } from "rxjs";
import { stock1, stock2, stock3 } from "src/models/stock.const";
import { CouchDBService } from "./couchdb.service";
import { StockService } from "./stock.service";

@Injectable()
export class UpdateService {

    constructor(private readonly stockService: StockService, private readonly couchDBService: CouchDBService,) { }

    updateDB() {
      interval(10000).pipe(
        switchMap(() => combineLatest([
          this.getNewData(stock1),
          this.getNewData(stock2),
          this.getNewData(stock3)
        ]))
      ).subscribe();
    }

    getNewData({ name, url }) {
        return this.stockService.getStockApiData(url)
          .pipe(
            map( ({ data }) => this.couchDBService.createDocumentData(data)),
            switchMap((data) => this.couchDBService.updateDocument(name, data))
          )
    }
}