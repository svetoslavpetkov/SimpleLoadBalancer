import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { ConfigModule } from "@nestjs/config"
import { ManageController } from "./manage/manage.controller"
import { TargetsService } from "./targets/targets.service"
import { ScheduleModule } from "@nestjs/schedule"

@Module({
  imports: [ConfigModule.forRoot(), ScheduleModule.forRoot()],
  controllers: [ManageController, AppController],
  providers: [AppService, TargetsService],
})
export class AppModule {}
