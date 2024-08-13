import { FastifyInstance } from 'fastify'
import { UserController } from '../controllers/UserController'
import { MealsController } from '../controllers/MealsController'
import { knex } from '../database'
import { authMiddleware } from '../middlewares/auth-middleware'

const User = new UserController()
const Meals = new MealsController()

export async function userRoutes(app: FastifyInstance) {
  //USERS
  app.post('/api/users/', async (request, reply) => {
    const aUser = await User.addUser(request, reply)

    return { aUser }
  })

  app.get('/api/users/', async (request) => {
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
  app.post('/api/meals/', { preHandler: [ authMiddleware ] }, async (request, reply) => {
    const aMeal = await Meals.addMeal(request, reply)

    return { aMeal }
  })

  app.delete('/api/meals/truncate/', async () => {
    await knex('meals').truncate()
  })  

}
