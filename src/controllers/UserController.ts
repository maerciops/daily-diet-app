import { randomUUID } from 'crypto'
import { knex } from '../database'
import { UserRepository, UserInput } from '../repositories/UserRepository'
import { BodyUserSchema } from '../schema/UserSchema'
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { getHashPassword, comparePassword, generateToken } from '../utils/utils-function'

const UserRepo = new UserRepository(knex)

export class UserController {
  async addUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const createUserBodySchema = BodyUserSchema.required()
      
      const { name, password } = createUserBodySchema.parse(request.body)

      const hashedPassword = await getHashPassword(password)

      const userInput: UserInput = {
        id: randomUUID(),
        name,
        hashedPassword,
      }

      const user = await UserRepo.addUser(userInput)

      return reply.status(200).send(user)
    } catch (error) {
      console.error(error)
      if (error instanceof z.ZodError) {
        let aMessage = ''

        error.errors.forEach((err) => {
          if (err.code === 'invalid_type') {
            aMessage = `O campo ${err.path[0]} é obrigatório.`
          }

          if (err.code === 'too_small') {
            aMessage = 'A senha precisa ter no mínimo 6 caracteres.'
          }
        })
        return reply.code(400).send({
          error: `Erro de validaçao. ${aMessage}`,
          code: reply.statusCode,
        })
      } else {
        return reply.code(400).send({
          error:
            'Erro inesperado na criação do usuário. Mensagem original: ' +
            error,
          code: reply.statusCode,
        })
      }
    }
  }

  async getUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const getUserBodySchema = BodyUserSchema.required()
      
      const { name, password } = getUserBodySchema.parse(request.body)
      
      const user = await UserRepo.getUserByName(name)
      
      if (!user) {
        throw new Error('Usuário não cadastrado.')
      }
      
      const isPassword = await comparePassword(password, user?.hashedPassword)
      
      if (!isPassword) {
        throw new Error('Senha incorreta.')
      }
      const token = await generateToken(user.hashedPassword)
      return reply.code(200).send({token})
    } catch (error) {
      return reply.code(401).send(error)
    }
  }
}
