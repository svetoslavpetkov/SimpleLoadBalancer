import { Injectable } from "@nestjs/common"
import config from "./configuration"
import * as math from "mathjs"

const wait = (ms: number): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

@Injectable()
export class AppService {
  getResponse(): string {
    return "Hello World!"
  }

  async getDelayedResponse(): Promise<string> {
    const delay = config.delayInMs
    return `REsponse delayed with ${delay}`
  }

  async getComputeResponse(): Promise<string> {
    const start = new Date()
    let end = new Date()
    const requiredComputeDelay = config.computeDelayInMs
    let iterations = 1
    let sum = 0
    do {
      for (let number = iterations; number <= 1000; number++) {
        const a = math.chain(number).pow(3).sqrt().divide(6).done()
        sum += math.sqrt(a)
      }
      iterations += 1000
      end = new Date()
    } while (end.getTime() - start.getTime() < requiredComputeDelay)
    const duration = end.getTime() - start.getTime()
    return `The sum of calculations from one to ${iterations} is ${sum}. Duration: ${duration} ms`
  }
}
