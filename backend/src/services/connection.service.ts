import { NEST_COUCH_CONNECTION } from "@irieimperator/nest-couch";
import { Inject, Injectable } from "@nestjs/common";
import * as designDoc from './../design.json';
import { HttpService } from '@nestjs/axios';
import { designDocumentId, designDocumentUrl } from "src/models/couchdb.const";

@Injectable()
export class ConnectionService {

    constructor(@Inject(NEST_COUCH_CONNECTION) private readonly connection, private readonly httpService: HttpService) { }

    create(dbName: string) {
        return this.connection.db.create(dbName);
    }

    get(dbName: string) {
        return this.connection.db.get(dbName)
    }

    getDesignDocument(dbName: string) {
        return this.connection.db.use(dbName).get(designDocumentId)
    }

    put(dbName: string) {
        return this.httpService.put(designDocumentUrl(dbName), designDoc)
    }

    use(dbName: string) {
        return this.connection.db.use(dbName)
    }
}