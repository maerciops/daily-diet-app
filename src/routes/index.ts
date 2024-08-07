import { FastifyInstance } from 'fastify'
import { UserController } from '../controllers/UserController'
import { knex } from '../database'

const aNewUser = new UserController()

export async function userRoutes(app: FastifyInstance) {
  app.post('/api/users/', async (request, reply) => {
    const aUser = await aNewUser.addUser(request, reply)

    return { aUser }
  })

  app.get('/api/users/', async () => {
    const aUser = await knex('users').select('*')

    return aUser
  })
}
