import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import { userRoutes } from './routes/index'

export const app = Fastify()

app.register(cookie)
app.register(userRoutes, { prefix: 'users' })
