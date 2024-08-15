import { randomUUID } from 'crypto'
import { knex } from '../database'
import { MealsInput, MealsRepository } from '../repositories/MealsRepository'
import { CreateMealsSchema, GetMealsParamsSchema } from '../schema/MealsSchema'
import { FastifyRequest, FastifyReply } from 'fastify'

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

  async deleteMeal(request: FastifyRequest, reply: FastifyReply) {
    try {      
      const resultParams = GetMealsParamsSchema.safeParse(request.params)

      if (!resultParams.success) {
        throw new Error('Id da requisição inválido.')
      }

      const { id } = GetMealsParamsSchema.parse(request.params)

      const user_id = (request as any).idUser
      
      const aMeal = await MealsRepo.getMealById(id, user_id)

      if (!aMeal) {
        throw new Error('Refeição não encontrada.')
      }

      await MealsRepo.deleteMeal(id)

      return reply.code(204).send('Registro excluído com sucesso.')
    } catch (error) {
      return reply.code(400).send(error)
    }
  }

  async editMeal(request: FastifyRequest, reply: FastifyReply) {
    try {
      const editMealSchema = CreateMealsSchema.required()
      
      const resultParams = GetMealsParamsSchema.safeParse(request.params)

      if (!resultParams.success) {
        throw new Error('Id da requisição inválido.')
      }

      const { id } = GetMealsParamsSchema.parse(request.params)

      const { name, description, date, time, in_diet } = editMealSchema.parse(request.body)
      
      const user_id = (request as any).idUser

      const aMeal = await MealsRepo.getMealById(id, user_id)
      
      if (!aMeal) {
        throw new Error('Refeição não encontrada para seu usuário.')
      }      
      
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
      return reply.code(400).send(error)
    }
  }  

  async getMealByUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user_id = (request as any).idUser
      
      const meal = await MealsRepo.getMealByUser(user_id)
      
      if (meal.length === 0) {
        return reply.code(404).send('Nenhum registro encontrado.')
      }
      
      return reply.code(200).send(meal)
    } catch (error) {
      return reply.code(400).send(error) 
    }
  }

  async getMealId(request: FastifyRequest, reply: FastifyReply) {
    try {      
      const resultParams = GetMealsParamsSchema.safeParse(request.params)

      if (!resultParams.success) {
        return reply.code(400).send('Id da requisição inválido.')
      }

      const { id } = GetMealsParamsSchema.parse(request.params) 

      const user_id = (request as any).idUser
      
      const meal = await MealsRepo.getMealById(id, user_id)
      
      if (!meal) {
        return reply.code(404).send('Refeição não encontrada.')
      }
      
      return reply.code(200).send(meal)
    } catch (error) {
      return reply.code(400).send(error) 
    }
  }  

  async getMetricsMeals(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user_id = (request as any).idUser
      
      const metrics = await MealsRepo.getTotalMeal(user_id)

      if (metrics === 0) {
        return reply.code(404).send('Nenhuma refeição registrada.')
      }

      return reply.code(200).send(metrics)
    } catch (error) {
      return reply.code(400).send(error)
    } 
  }
}