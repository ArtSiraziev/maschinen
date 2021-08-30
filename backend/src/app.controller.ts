import { Controller } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AppService } from './app.service';
import { switchMap, take, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cron, CronExpression } from '@nestjs/schedule';
import { stock1, stock2, stock3 } from './models/stock.const';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    this.appService.createDBs();
  }
}
