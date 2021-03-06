import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import config from "./configuration"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(config.port)
  console.log(`Listening on ${config.port}`)
  //register on LB
}
bootstrap()
