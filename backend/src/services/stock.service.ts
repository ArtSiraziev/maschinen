import { Injectable } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';

@Injectable()
export class StockService {
    
    constructor(private readonly httpService: HttpService) { }

    getStockApiData(url: string) {
        return this.httpService.get(url)
    }

}