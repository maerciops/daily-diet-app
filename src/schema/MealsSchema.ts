import { z } from 'zod'

export const CreateMealsSchema = z.object({
  name: z.string(),
  description: z.string(),
  date: z.string().transform((str) => new Date(str)),
  time: z.string().transform((str) => new Date(str)), 
  in_diet: z.boolean()
})

export const GetMealsSchema = z.object({
  name: z.string(),
  description: z.string(),
  date: z.string().transform((str) => new Date(str)),
  time: z.string().transform((str) => new Date(str)), 
  in_diet: z.boolean(),
  user_id: z.string(),
})

export const GetMealsParamsSchema = z.object({
  id: z.string().uuid(),
})