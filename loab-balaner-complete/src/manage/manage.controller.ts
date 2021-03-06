import { Body, Controller, Delete, Get, Post } from "@nestjs/common"
import {
  ITarget,
  ITargetWithStatus,
  TargetsService,
} from "src/targets/targets.service"

@Controller("manage")
export class ManageController {
  constructor(private readonly targetsService: TargetsService) {}

  @Get("/target")
  listTargets(): Array<ITargetWithStatus> {
    return this.targetsService.getAllTargets()
  }

  @Post("/target")
  addTarget(@Body() target: ITarget) {
    this.targetsService.registerTarget(target)
  }

  @Delete("/target")
  deleteTarget(@Body() target: ITarget) {
    this.targetsService.unRegisterTarget(target)
  }
}
