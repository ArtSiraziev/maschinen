import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb-browser';
PouchDB.debug.enable('*')

@Injectable({
  providedIn: 'root'
})
export class PouchDBService {

  constructor() { }

  getStocks(dbName: string) {
    const db = new PouchDB(`http://localhost:5984/${dbName}`);

    db.info().then(function (info) {
      console.log(info);
    })

    return db.get('stock')
  }
}
