import { randomUUID } from 'crypto'
import { knex } from '../database'
import { UserRepository, UserInput } from '../repositories/UserRepository'
import { BodyUserSchema } from '../schema/UserSchema'
import { FastifyRequest, FastifyReply } from 'fastify'

const UserRepo = new UserRepository(knex)

export class UserController {
  async addUser(request: FastifyRequest, reply: FastifyReply) {
    const createUserBodySchema = BodyUserSchema

    const { name, password } = createUserBodySchema.parse(request.body)

    const userInput: UserInput = {
      id: randomUUID(),
      name,
      password,
    }
    try {
      const user = await UserRepo.addUser(userInput)

      return reply.status(200).send(user)
    } catch (error) {
      console.error(error)
      return reply.status(500).send({ error: 'Erro ao criar usuário.' })
    }
  }
}
