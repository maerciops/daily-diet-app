import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { env } from '../env';

const secretKey = env.SECRET

export async function generateToken (userId: string) {
    return jwt.sign({ id: userId }, secretKey, { expiresIn: '1h' })
};

export async function getHashPassword(aPassword: string) {
  const aSaltRounds = 10
  return bcrypt.hash(aPassword, aSaltRounds)
}

export async function comparePassword(aPassword: string, aHashPassword: string) {
  return bcrypt.compare(aPassword, aHashPassword)
}
