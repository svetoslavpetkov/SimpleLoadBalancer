import { All, Controller, Get, HttpStatus, Req, Res } from "@nestjs/common"
import axios, { Method } from "axios"
import { Response, Request } from "express"
import { TargetsService } from "./targets/targets.service"

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
  reqSampling: RequestSampling = new RequestSampling(100)
  constructor(private readonly targetService: TargetsService) {}

  @All("*")
  async getHello(@Req() req: Request, @Res() res: Response): Promise<any> {
    const target = this.targetService.getNextTarget()
    if (!target) {
      res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        message: "No available target to handle teh request",
      })
      return
    }
    const url = `http://${target.host}:${target.port}${req.baseUrl}`
    const targetResponse = await axios({
      method: req.method as Method,
      url,
    })
    this.reqSampling.register()
    res.status(targetResponse.status).json(targetResponse.data)
  }
}
