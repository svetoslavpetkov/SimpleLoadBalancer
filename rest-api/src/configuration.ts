const key = {
  port: "PORT",
}

class Configuration {
  private getNumber(key: string): number {
    const value = process.env[key]
    if (!value) {
      throw Error(`Config key '${key}' is missing from .env file`)
    }

    const res: number = parseInt(value)
    if (isNaN(res)) {
      // eslint-disable-next-line prettier/prettier
      throw Error(`'${value}' is no valid port`)
    }
    return res
  }

  get port() {
    return this.getNumber(key.port)
  }
}

const instance = new Configuration()

export default instance
