import { Injectable, Scope } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"
import axios from "axios"
import Guard from "../util/Guard"

export enum TargetStatus {
  Unknown = "Unknown",
  Ok = "Ok",
  Down = "Down",
}

export interface ITarget {
  host: string
  port: string
}

export interface ITargetWithStatus extends ITarget {
  status: TargetStatus
  statusSince: Date
}

class Target implements ITargetWithStatus {
  status: TargetStatus
  statusSince: Date
  host: string
  port: string
  constructor(target: ITarget) {
    this.host = target.host
    this.port = target.port
    this.status = TargetStatus.Unknown
    this.statusSince = new Date()
  }

  setStatus(newStatus: TargetStatus) {
    if (this.status === newStatus) {
      return
    }

    this.status = newStatus
    console.log(
      `Target ${this.host}:${this.port} changed status to ${newStatus}`,
    )
  }
}

@Injectable()
export class TargetsService {
  currentTargetIndex = 0
  targets: Array<Target> = []

  getNextTarget(): ITargetWithStatus | undefined {
    if (this.targets.length === 0) {
      return undefined
    }
    const next = this.getTargetFromIndex(this.currentTargetIndex + 1)
    if (next) {
      this.currentTargetIndex = next.index
      return next.value
    }
    return undefined
  }

  private getTargetFromIndex(
    startingIndex: number,
  ): { value: ITargetWithStatus; index: number } | undefined {
    for (let index = startingIndex; index < this.targets.length; index++) {
      const target = this.targets[index]
      if (target.status === TargetStatus.Ok) {
        return {
          index,
          value: target,
        }
      }
    }

    if (startingIndex === 0) {
      return undefined
    }

    return this.getTargetFromIndex(0)
  }

  get(target: ITarget): ITargetWithStatus | undefined {
    return this.targets.find(
      t => t.host === target.host && t.port === target.port,
    )
  }

  registerTarget(target: ITarget): void {
    Guard.notExists(
      this.get(target),
      `There is registered target ${target.host}:${target.port}`,
    )
    this.targets.push(new Target(target))
  }

  unRegisterTarget(target: ITarget): void {
    Guard.exists(
      this.get(target),
      `There is no registered target ${target.host}:${target.port}`,
    )

    this.targets = this.targets.filter(
      t => t.host != target.host && t.port != target.port,
    )
  }

  getAvailableTargets(): Array<ITargetWithStatus> {
    return this.targets.filter(t => t.status === TargetStatus.Ok)
  }

  getAllTargets(): Array<ITargetWithStatus> {
    return this.targets
  }

  //check the targets status
  @Cron(CronExpression.EVERY_5_SECONDS)
  checkTargets() {
    this.targets.forEach(t => {
      axios
        .get(`http://${t.host}:${t.port}/ping`)
        .then(() => {
          t.setStatus(TargetStatus.Ok)
        })
        .catch(e => {
          t.setStatus(TargetStatus.Down)
        })
    })
  }
}
