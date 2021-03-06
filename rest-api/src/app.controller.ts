import { Controller, Get } from "@nestjs/common"
import { AppService } from "./app.service"
import config from "./configuration"

export interface IVersionResponse<T> {
  appOnPort: number
  apiVersion: number
  response: T
}

class RequestSampling {
  samplingStarted: Date = new Date()
  currentSamplesCount = 0
  constructor(private readonly maxQueueCount: number) {}

  register() {
    this.currentSamplesCount += 1

    if (this.currentSamplesCount >= this.maxQueueCount) {
      const end = new Date()
      // eslint-disable-next-line prettier/prettier
      const durationISec = (end.getTime() - this.samplingStarted.getTime()) / 1000
      const tps = this.currentSamplesCount / durationISec
      console.log(`${end.toLocaleTimeString()} - ${tps.toFixed(2)} tps`)

      this.currentSamplesCount = 0
      this.samplingStarted = new Date()
    }
  }
}

@Controller()
export class AppController {
  reqSampling: RequestSampling = new RequestSampling(20)
  constructor(private readonly appService: AppService) {}

  getResponse<T>(res: T): IVersionResponse<T> {
    this.reqSampling.register()
    return {
      appOnPort: config.port,
      apiVersion: config.version,
      response: res,
    }
  }

  @Get()
  getHello(): IVersionResponse<string> {
    return this.getResponse(this.appService.getResponse())
  }

  @Get("/delayed")
  async delayed(): Promise<IVersionResponse<string>> {
    const response = await this.appService.getDelayedResponse()
    return this.getResponse(response)
  }

  @Get("/compute")
  async compute(): Promise<IVersionResponse<string>> {
    const response = await this.appService.getComputeResponse()
    return this.getResponse(response)
  }

  @Get("/ping")
  ping(): IVersionResponse<string> {
    return this.getResponse("OK")
  }
}
