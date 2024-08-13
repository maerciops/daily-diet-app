import { randomUUID } from 'crypto'
import { knex } from '../database'
import { MealsInput, MealsRepository } from '../repositories/MealsRepository'
import { CreateMealsSchema } from '../schema/MealsSchema'
import { FastifyRequest, FastifyReply } from 'fastify'
//import { z } from 'zod' se precisar tratar erro do zod no trycatch

const MealsRepo = new MealsRepository(knex)

export class MealsController {
  async addMeal(request: FastifyRequest, reply: FastifyReply) {
    try {
      const createMealsSchema = CreateMealsSchema.required()
           
      const { name, description, date, time, in_diet } = createMealsSchema.parse(request.body)
      
      const user_id = (request as any).idUser
      
      const mealInput: MealsInput = {
        id: randomUUID(),
        name,
        description,
        date,
        time,
        in_diet,
        user_id,
      }

      const meal = await MealsRepo.addMeal(mealInput)

      return reply.status(200).send(meal)  
    } catch (error) {
      return reply.status(400).send(error)
    }
  }

  async editMeal(request: FastifyRequest, reply: FastifyReply) {
    try {
      const editMealSchema = CreateMealsSchema.required()

      const { name, description, date, time, in_diet } = editMealSchema.parse(request.body)
      const user_id = ''
      const id = ''
      const mealInput: MealsInput = {
        id,
        name,
        description,
        date,
        time,
        in_diet,
        user_id,
      }

      const meal = await MealsRepo.editMeal(mealInput)

      return reply.code(200).send(meal)
    } catch (error) {
      return reply.code(400).send('Erro não tratado.')
    }
  }
}