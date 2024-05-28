import { beforeAll, describe, expect, it } from 'vitest'
import { setUpPipeline } from '../shared/pipeline'
import { Connection, InferSchemaType, Model, model } from 'mongoose'
import { setUpMongoose } from './setup'
import { BlogSchema } from './schemas/blog.schema'

let connection: Connection
let blogModel: Model<InferSchemaType<typeof BlogSchema>>

beforeAll(
  setUpPipeline(
    setUpMongoose(
      async _connection => {
        connection = _connection
        blogModel = model('Blog', BlogSchema)
      },
      {
        dbName: 'test',
      },
    ),
  ),
  1000 * 60 * 3,
)

it('ping', async () => {
  const ping = await connection.db.admin().ping()
  expect(ping.ok).toBeTruthy()
})

describe('Optimistic Lock', () => {
  it('create test', async () => {
    const blog = await blogModel.create({ title: 'title', content: 'content' })
    expect(blog.title).toBe('title')
    expect(blog.content).toBe('content')
  })
})
