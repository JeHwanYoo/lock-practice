import { GenericContainer } from 'testcontainers'
import { SetUpFunction } from '../shared/pipeline'
import mongoose, { Connection, Schema } from 'mongoose'

export const setUpMongoose: SetUpFunction<
  {
    dbName: string
    schema?: Schema
    modelName?: string
  },
  Connection
> = (cb, config) => {
  return async context => {
    const container = await new GenericContainer('mongo:latest')
      .withExposedPorts(27017)
      .withEnvironment({
        MONGO_INITDB_ROOT_USERNAME: 'mongo',
        MONGO_INITDB_ROOT_PASSWORD: 'mongo',
      })
      .start()

    const mappedPort = container.getMappedPort(27017)
    const host = container.getHost()
    const connectionString = `mongodb://mongo:mongo@${host}:${mappedPort}`
    context.set('mongoConnectionString', connectionString)

    if (config?.dbName) {
      await mongoose.connect(connectionString, { dbName: config.dbName })
    } else {
      await mongoose.connect(connectionString)
    }

    await cb(mongoose.connection)
  }
}
