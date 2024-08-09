import { FastifyInstance } from 'fastify'
import { UserController } from '../controllers/UserController'
import { knex } from '../database'
import { authMiddleware } from '../middlewares/auth-middleware'

const User = new UserController()

export async function userRoutes(app: FastifyInstance) {
  //USERS
  app.post('/api/users/', async (request, reply) => {
    const aUser = await User.addUser(request, reply)

    return { aUser }
  })

  app.get('/api/users/',{ preHandler: [ authMiddleware ] }, async (request) => {
    const aUser = await knex('users').select('*')
    //const aIdUser = (request as any).idUser
    return aUser
  })

  app.post('/api/users/login/', async (request, reply) => {
    const aUser = await User.getUser(request, reply)

    return aUser
  })

  app.delete('/api/users/truncate/', async () => {
    await knex('users').truncate()
  })

  //MEALS
  app.post('/api/meals/', async (request, reply) => {
    const aUser = await User.addUser(request, reply)

    return { aUser }
  })

}
