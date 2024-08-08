import { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'
import { env } from '../env'

const authMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const authHeader = request.headers.authorization

        if (!authHeader) {
            reply.code(401).send({ error: 'Token missing' })
            return
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, env.SECRET)

        return decoded
    } catch (error) {
        reply.code(401).send({ error: 'Invalid token' })
    }
}
