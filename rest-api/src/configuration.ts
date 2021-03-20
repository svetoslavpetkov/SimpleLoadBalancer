const key = {
  port: "PORT",
  version: "VERSION",
  delay: "DELAY_IN_MS",
  computeDelay: "COMPUTE_DELAY_IN_MS",
  logEachRequest: "LOG_EACH_REQUEST",
}

class Configuration {
  private getValue(key: string, defaultValue?: string): string {
    const value = process.env[key]
    if (!value) {
      if (defaultValue) {
        return defaultValue
      }
      throw Error(`Config key '${key}' is missing from .env file`)
    }
    return value
  }

  private getNumber(key: string): number {
    const value = this.getValue(key)

    const res: number = parseInt(value)
    if (isNaN(res)) {
      // eslint-disable-next-line prettier/prettier
      throw Error(`'${value}' is no valid port`)
    }
    return res
  }

  private getBool(key: string): boolean {
    const value = this.getValue(key)
    const res = JSON.parse(value.toLowerCase())
    return res === true
  }

  get port() {
    return this.getNumber(key.port)
  }

  get version() {
    return this.getNumber(key.version)
  }

  get delayInMs() {
    return this.getNumber(key.delay)
  }

  get computeDelayInMs() {
    return this.getNumber(key.computeDelay)
  }

  get logEachRequest() {
    return this.getBool(key.logEachRequest)
  }
}

const instance = new Configuration()

export default instance
