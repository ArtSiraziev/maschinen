import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NestCouchModule } from '@irieimperator/nest-couch'
import { ScheduleModule } from '@nestjs/schedule'
import { CouchDBService } from './services/couchdb.service';
import { ConnectionService } from './services/connection.service';
import { StockService } from './services/stock.service';
import { UpdateService } from './services/update.service';

@Module({
  imports: [
    HttpModule,
    NestCouchModule.register({
      nano: {
        url: `http://admin:admin@${process.env.COUCHDB_URL}`
      },
      logging: {
        level: 'INFO'
      }
    }),
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, CouchDBService, ConnectionService, StockService, UpdateService],
})
export class AppModule {}
