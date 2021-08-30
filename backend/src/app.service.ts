import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import { CouchDBService } from './services/couchdb.service';
import { stock1, stock2, stock3 } from './models/stock.const';
import { UpdateService } from './services/update.service';

@Injectable()
export class AppService {

  constructor(
    private readonly couchDBService: CouchDBService,
    private readonly updateService: UpdateService,
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
      .finally(() => this.updateService.updateDB());
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
}
