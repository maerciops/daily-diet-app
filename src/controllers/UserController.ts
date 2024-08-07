import { randomUUID } from 'crypto'
import { knex } from '../database'
import { UserRepository, UserInput } from '../repositories/UserRepository'
import { BodyUserSchema } from '../schema/UserSchema'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

const UserRepo = new UserRepository(knex)

export class UserController {
  async addUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const createUserBodySchema = BodyUserSchema.required()

      const { name, password } = createUserBodySchema.parse(request.body)

      const userInput: UserInput = {
        id: randomUUID(),
        name,
        password,
      }

      const user = await UserRepo.addUser(userInput)

      return reply.status(200).send(user)
    } catch (error) {
      console.error(error)
      if (error instanceof z.ZodError) {
        let aMessage = ''

        error.errors.forEach((err) => {
          if (err.code === 'invalid_type') {
            aMessage = aMessage + err.path[0]
          }
        })
        return reply.code(400).send({
          error: `Erro de validaçao. O campo ${aMessage} é obrigatório.`,
          code: reply.statusCode,
        })
      } else {
        return reply.code(400).send({
          error: 'Erro inesperado na criação do usuário.',
          code: reply.statusCode,
        })
      }
    }
  }
}
