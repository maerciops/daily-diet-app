import { z } from 'zod'

export const CreateUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  password: z.string(),
})

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  hashedPassword: z.string(),
})

export const BodyUserSchema = z.object({
  name: z.string(),
  password: z.string().min(6),
})
