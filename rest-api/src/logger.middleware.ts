import { Injectable, NestMiddleware } from "@nestjs/common"
import { Request, Response, NextFunction } from "express"
import config from "./configuration"

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (config.logEachRequest) {
      console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.path}`)
    }
    next()
  }
}
