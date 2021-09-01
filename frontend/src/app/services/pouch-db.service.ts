import { from } from 'rxjs';
import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb-browser';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PouchDBService {

  constructor() { }

  getStocks(dbName: string) {
    const db = new PouchDB(`http://localhost:5984/${dbName}`);

    const localDB = new PouchDB(dbName);

    return from(db.get('stock')).pipe(
      tap((stock) => {
        localDB.get('_local/chartData').then((doc) => localDB.remove(doc)).then(
          () => localDB.put({
          _id: '_local/chartData',
          stock
          })
        );
      }),
      catchError(() => {
        console.log(localDB.get('_local/chartData'))
        return from(localDB.get('_local/chartData')).pipe(map((data: any) => data.stock));
      })
    )
  }
}
