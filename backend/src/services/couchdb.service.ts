import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { Observable, of } from "rxjs";
import { ConnectionService } from './connection.service';

@Injectable()
export class CouchDBService {

    constructor(
        private readonly connectionService: ConnectionService
    ) { }
    
    /* need to rewrite */
    createDocumentData(data) {
        let dataAsArray = Object.keys(data);
        let timestamps = Object.entries(data[dataAsArray[1]]).slice(0, 30).map(el => {
          let keys = Object.keys(el[1]);
          return { date: el[0], low: el[1][keys[2]], high: el[1][keys[1]] , close: el[1][keys[3]]};
        });
        let metadataKeys = Object.keys(data[dataAsArray[0]]);
        return { _id: 'stock', name: data[dataAsArray[0]][metadataKeys[1]], timestamps }
    }

    async createDb(dbName): Promise<{ok: boolean}> {
        if(!(await this.isDBExists(dbName))){
          return await this.connectionService.create(dbName);
        }
        return Promise.resolve({ ok: true });
    }

    async isDBExists(dbName: string): Promise<boolean> {
        let exists;
        try {
          exists = await this.connectionService.get(dbName); 
        } catch (error) {
          console.log('DB does not exist: ', error);
        }
        
        if(!exists) {
          return false;
        }
        return true;
    }

    async createDesignDocument(dbName: string): Promise<Observable<any>> {
        let design;
        try {
          design = await this.connectionService.getDesignDocument(dbName);      
        } catch (error) {
          console.log('Design document ERROR: ', error)
        }
    
        if(!design) {
          return this.connectionService.put(dbName);
        }
        return of(null);
    }
    
    async insertDocument(dbName: string, data: any) {
        try {
            const db = await this.connectionService.use(dbName);
            await db.insert(data)
        } catch (error) {
            console.log('Can not insert document: ', error);
        }
        return 
    }
    
    async isDocExists(dbName: string) {
        let exists;
        try {
            const db = await this.connectionService.use(dbName);
            exists = await db.get('stock');
        } catch (error) {
            console.log('Document does not exist', error); 
        }

        if(!exists) {
            return false;
        }
        return true
    }

    async updateDocument(dbName: string, data: any) {
        try {
            const db = await this.connectionService.use(dbName);
            await db.bulk({docs: [data]})
        } catch (error) {
            console.log('Can not insert document: ', error);
        }
        return 
    }
}