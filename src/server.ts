import { app } from './app'
import { env } from './env'

app.listen({ port: parseInt(env.PORT_SERVER) }).then(() => {
  console.log('Servidor rodando.')
})
