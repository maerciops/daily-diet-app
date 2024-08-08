import { FastifyInstance } from 'fastify'
import { UserController } from '../controllers/UserController'
import { knex } from '../database'

const User = new UserController()

export async function userRoutes(app: FastifyInstance) {
  app.post('/api/users/', async (request, reply) => {
    const aUser = await User.addUser(request, reply)

    return { aUser }
  })

  app.get('/api/users/', async () => {
    const aUser = await knex('users').select('*')

    return aUser
  })

  app.post('/api/users/login/', async (request, reply) => {
    const aUser = await User.getUser(request, reply)

    return aUser
  })

  app.delete('/api/users/truncate/', async () => {
    await knex('users').truncate()
  })
}
