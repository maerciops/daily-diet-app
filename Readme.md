# RA

[x] Deve ser possível criar um usuário
[x] Deve ser possível identificar o usuário entre as requisições
[x] Deve ser possível registrar uma refeição feita, com as seguintes informações:
    *As refeições devem ser relacionadas a um usuário.*
    *Nome
    *Descrição
    *Data e Hora
    *Está dentro ou não da dieta
[] Deve ser possível editar uma refeição, podendo alterar todos os dados acima
[] Deve ser possível apagar uma refeição
[] Deve ser possível listar todas as refeições de um usuário
[] Deve ser possível visualizar uma única refeição
[] Deve ser possível recuperar as métricas de um usuário
    *Quantidade total de refeições registradas
    *Quantidade total de refeições dentro da dieta
    *Quantidade total de refeições fora da dieta
    *Melhor sequência de refeições dentro da dieta
[] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou.

## Rotas

(POST) /users - Deve ser possível criar um usuário no banco de dados, enviando os campos name e password por meio do body da requisição. Preencher um id automatico.
(POST) /meals - Deve ser possível criar uma refeição no banco de dados, enviando os campos name, description, date, hour, in_diet por meio do body da requisição. Preencher um id automatico e preencher o campo id_user que será gravado o user a quem pertence essa refeição.
(PUT) /meals/:id - Deve ser possível alterar uma refeição no banco de dados, para isso precisa verificar se ela existe, checar se os campos name, description, date, hour, in_diet enviados por meio do body da requisição estão em branco (Campos são obrigatórios).
(DELETE) /meals/:id - Deve ser possível remover uma refeição do usuário logado pelo id da refeição.
(GET) /meals/ - Deve ser possível listar todas as refeições de um usuário usando o seu id.
(GET) /meals/:id - Deve ser possível listar uma única refeição do usuário logado usando o id da refeição.
(GET) /meals/ - Deve ser possível listar todas as métrica das refeições de um usuário usando o seu id. As métricas são: Total de registros de refeições, total de registros de refeições com in_diet = true, total de registros de refeições com in_diet = false e melhor sequencia de refeições dentro da dieta.

## Controller

[] Implementar rotina de auth para o usuário logado, pois todas as rotas sobre refeição só poderão ser acessadas com um usuário autenticado.

## Tecnologias

- Node.js
- Typescript
- Fastify
- Knex
- Zod
- JWT
