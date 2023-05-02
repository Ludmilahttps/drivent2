# DRIVENT
Esse projeto é uma implementação de código legado de uma empresa ficticia, todas as features implementadas estão descritas no *about* logo abaixo

## About

### 01 - TypeScript

Implementação da rota `/enrollments/cep`
    - A informação do CEP é enviada por query parameters, no formato `cep=xxxxxxx`, por exemplo: `/enrollments/cep?cep=1234081`
    - Esta rota usa API do [ViaCEP](https://viacep.com.br/) para buscar as informações sobre o endereço que será fornecido pelo usuário no cadastro através do CEP.
        - A API retornará um JSON com vários dados. A função trata esta resposta e retorna somente os dados conforme o exemplo abaixo:
            
            ```jsx
            {
              logradouro: "Avenida Brigadeiro Faria Lima",
              complemento: "de 3252 ao fim - lado par",
              bairro: "Itaim Bibi",
              cidade: "São Paulo",
              uf: "SP",
            };
            ```
            
        - Existem dois cenários de erros que são tratados:
            - Formato Inválido: A API responde com status 400.
            - Válido, mas inexistente: Neste caso, a API retorna: "erro": "true"
                
        - Ambos os erros são tratados nas funções do controller de enrollment. 

- Ajuste da função `createOrUpdateEnrollmentWithAddress`
    - Verificamos se o CEP é válido antes de criar ou atualizar uma enrollment. Caso não seja, a operação não pode ser concluída.

### 02 - Prisma

- Implementação das rotas de tickets e payments.
    - Todas as rotas são autenticadas.
    - Todas as rotas respondem status `401 (Unauthorized)` caso falhe a autenticação.
- **GET** `/tickets/types`
    - Retorna todos os tipos de ingresso (`TicketType`) cadastrados no sistema.
    - Retorno com todos os tipos de ingresso cadastrados
        - Status: **`200`**
        - Response
            
            ```jsx
            [
              {
                id: number,
                name: string,
                price: number,
                isRemote: boolean,
                includesHotel: boolean,
                createdAt: Date,
                updatedAt: Date,
              }
            ]
            ```
            
    - Retorno sem os tipos de ingresso (não existe cadastrado no sistema ainda)
        - Status: **`200`**
        - Response:
            
            ```jsx
            []
            ```
            
- **GET** `/tickets`
    - Retorna todos os ingressos (`Ticket`) do usuário.
    - Com base na regra de negócio atual, o usuário terá apenas um Ticket.
    - Retorna do ingresso do usuário: Status: `200`
        - Response
            
            ```jsx
            {
              id: number,
              status: string, //RESERVED | PAID
              ticketTypeId: number,
              enrollmentId: number,
              TicketType: {
                id: number,
                name: string,
                price: number,
                isRemote: boolean,
                includesHotel: boolean,
                createdAt: Date,
                updatedAt: Date,
              },
              createdAt: Date,
              updatedAt: Date,
            }
            ```
            
    - Retorna para usuário sem cadastro/inscrição: Status: ****`404`
    - Retorna para usuário sem ingresso: Status: `404`

- **POST** `/tickets`
    - Cria no sistema um novo ingresso (`Ticket`) para o usuário.
    - body
        
        ```jsx
        { ticketTypeId: number }
        ```
        
    - Retorna para criação do ingresso bem sucedida: Status: `201`
        - Response:
        
        ```jsx
        {
          id: number,
          status: string, //RESERVED | PAID
          ticketTypeId: number,
          enrollmentId: number,
          TicketType: {
            id: number,
            name: string,
            price: number,
            isRemote: boolean,
            includesHotel: boolean,
            createdAt: Date,
            updatedAt: Date,
          },
          createdAt: Date,
          updatedAt: Date,
        }
        ```
        
    - Retorna para usuário sem cadastro: Status: `404`
    - Retorna quando informação do `ticketTypeId` não é enviada: Status: `400`

- **GET:**`/payments?ticketId=1`
    - Retorna informações sobre o pagamento (`Payment`) de um ingresso (`Ticket`).
    - Retorna de sucesso: Status: `200`
        - Response
            
            ```jsx
            {
              id: number,
              ticketId: number,
              value: number,
              cardIssuer: string, //VISA | MASTERCARD
              cardLastDigits: string,
              createdAt: Date,
              updatedAt: Date,
            }
            ```
            
    - Retorna quando o `ticketId` não é enviado como parâmetro: Status: `400`
    - Retorna quando o `ticketId` não existe: Status: `404`
    - Retorna quando o `ticketId` não está associado ao usuário: Status: `401`

- **POST** `/payments/process`
    - Realiza o pagamento (`Payment`) de um ingresso (`Ticket`).
    - Body
        
        ```jsx
        {
        	ticketId: number,
        	cardData: {
        		issuer: string,
            number: number,
            name: string,
            expirationDate: Date,
            cvv: number
        	}
        }
        ```
        
    - Retorna de sucesso: Status: `200`
        - Response
            
            ```jsx
            {
              id: number,
              ticketId: number,
              value: number,
              cardIssuer: string, // VISA | MASTERCARD
              cardLastDigits: string,
              createdAt: Date,
              updatedAt: Date,
            }
            ```
            
    - Retorna quando não existe `cardData` e/ou `ticketId` no `body`: Status: `400`
    - Retorna quando `ticketId` não existe: Status: `404`
    - Retorna quando usuário não possui o `ticketId`: Status: `401`

### 03 - Tests

- Implementação das seguintes rotas:
    - Todas as rotas são autenticadas.
    - A listagem funciona para ambos endpoints se para o respectivo usuário existir uma inscrição com ticket pago, que inclui hospedagem.
        - Não existe (inscrição, ticket ou hotel): `404 (not found)`
        - Ticket não foi pago, é remoto ou não inclui hotel: `402 (payment required)`
        - Outros erros: `400 (bad request)`
    - Para esta tarefa, considere a relação de 1:1 entre usuário → `Enrollment` e `Ticket`, ou seja, o usuário terá apenas uma inscrição e um ingresso (atualmente o repository já faz isso). No modelo no schema/banco está diferente.
    - **GET**: `/hotels` → Listar todos os hotéis.
    - **GET**: `/hotels/:hotelId` → Listar os quartos do hotel.
        
        ```jsx
        //retorno de Rooms com Hotel (include Rooms em Hotel)
        {
          id: hotelWithRooms.id,
          name: hotelWithRooms.name,
          image: hotelWithRooms.image,
          createdAt: hotelWithRooms.createdAt.toISOString(),
          updatedAt: hotelWithRooms.updatedAt.toISOString(),
          Rooms: [
            {
              id: hotelWithRooms.Rooms[0].id,
              name: hotelWithRooms.Rooms[0].name,
              capacity: hotelWithRooms.Rooms[0].capacity,
              hotelId: hotelWithRooms.Rooms[0].hotelId,
              createdAt: hotelWithRooms.Rooms[0].createdAt.toISOString(),
              updatedAt: hotelWithRooms.Rooms[0].updatedAt.toISOString(),
            }
          ]
        }
        ```

### 04 - Unitary Tests

- Implementação e respectivos testes das rotas:
    - Todas as rotas são autenticadas.
    - Listar uma reserva (usuário já fez a reserva)
        
        **GET**: `/booking`
        
        - **Sucesso**: Deve retornar status code `200` com:
            
            ```json
            {
            	"id": bookingId,
            	"Room": {}
            }
            ```
            
        - **Error**: Usuário não tem reserva: Deve retornar status code `404`.
    - Fazer uma reserva
        - Regra de negócio: Apenas usuários com ingresso do tipo presencial, com hospedagem e pago podem fazer reservas.
        - **POST**: `/booking`
            
            body: 
            
            ```json
            {
            	"roomId": Number
            }
            ```
            
            - **Sucesso**: Deve retornar status code `200` com `bookingId`
            - **Error**:
                - `roomId` não existente: Deve retornar status code `404`.
                - `roomId` sem vaga: Deve retornar status code `403`.
                - Fora da regra de negócio: Deve retornar status code `403`. (ex: usuário não tem nem *booking*.)
    - Trocar uma reserva
        - Regra de negócio:
            - A troca pode ser efetuada para usuários que possuem reservas.
            - A troca pode ser efetuada apenas para quartos livres.
        - **PUT**: `/booking/:bookingId`
            
            **body**: 
            
            ```json
            {
            	"roomId": Number
            }
            ```
            
            - Sucesso: Deve retornar status code `200` com `bookingId`
            - Erro:
                - `roomId` não existente: Deve retornar status code `404`.
                - `roomId` sem vaga: Deve retornar status code `403`.
                - Fora da regra de negócio: Deve retornar status code `403`.
- Requisitos:
    - **Métricas de QA (Quality Assurance)**
        
        **Cobertura de Testes:** Para verificar a cobertura de testes, execute o comando `test:coverage` do `package.json`. A pasta `coverage/` será gerada. Suba o arquivo `index.html` em um servidor local para fazer a leitura das informações.
        
        - **Booking Service:**
            - *Lines*: ≥ 90%
            - *Functions*: ≥ 90%
        - **Booking Controller:**
            - *Lines*: ≥ 90%
            - *Functions*: ≥ 90%
    - Testes de integração (quando envolve API e Banco) para todas as rotas implementadas.
    - Testes precisam validar todos os casos necessários**.**


## Tecnologies
This web site is a replica, using the tecnologies:

TypeScript
Node
Prisma
Unitary Tests

## How to run for development
1. Clone this repository
2. Install all dependencies

```bash
npm i
```

3. Create a PostgreSQL database with whatever name you want
4. Configure the `.env.development` file using the `.env.example` file (see "Running application locally or inside docker section" for details)
5. Run all migrations

```bash
npm run dev:migration:run
```

6. Seed db

```bash
npm run dev:seed
```

6. Run the back-end in a development environment:

```bash
npm run dev
```

## How to run tests

1. Follow the steps in the last section
1. Configure the `.env.test` file using the `.env.example` file (see "Running application locally or inside docker" section for details)
1. Run all migrations

```bash
npm run migration:run
```

3. Run test:
   (locally)

```bash
npm run test
```

(docker)

```bash
npm run test:docker
```

## Building and starting for production

```bash
npm run build
npm start
```

## Running migrations or generate prisma clients

Before running migrations make sure you have a postgres db running based on `.env.development` or `.env.test` file for each environment. You can start a postgres instance by typing `npm run dev:postgres` or `npm run test:postgres`. The host name is the name of the postgres container inside docker-compose file if you are running the application inside a docker container or localhost if you are running it locally.

You can operate on databases for different environments, but it is necessary to populate correct env variables for each environment first, so in order to perform db operations type the following commands:

- `npm run dev:migration:run` - run migrations for development environment by loading envs from .env.development file. It uses [dotenv-cli](https://github.com/entropitor/dotenv-cli#readme) to load envs from .env.development file.
- `npm run test:migration:run` - the same, but for test environment

- `npm run dev:migration:generate -- --name ATOMIC_OPERATION_NAME` - generate and run migration and prisma client for development environment by loading envs from .env.development file. Replace `ATOMIC_OPERATION_NAME` by the name of the migration you want to generate.

## Switching between environments

In order to switch between development and test environments you need to shutdown the current postgres instance if it is running and start the new one.

If you are in development environment:

```bash
npm run dev:postgres:down
```

And then

```bash
npm run test:postgres
```

If you are in test environment:

```bash
npm run test:postgres:down
```

And then

```bash
npm run dev:postgres
```

## Running application locally or inside docker

`.env.development` and `.env.test` must be changed if you and to run the application locally or inside docker. You can populate files based on `.env.example` file, but you need to consider the following:

- Running application locally (postgres and node):

Add your postgres credentials and make sure to create given database before running the application.

- Running application inside docker (postgres and node):

Set `POSTGRES_HOST` to `drivent-postgres-development` for `.env.development` and `drivent-postgres-test` for `.env.test` file. It is the name of the postgres container inside docker-compose file. Docker Compose will start the postgres container for you, create the database and host alias for you.

- Running application locally (node) but postgres is running inside docker:

Set `POSTGRES_HOST` to `localhost` for `.env.development` and `localhost` for `.env.test` file. Docker compose is configured to expose postgres container to your localhost.

## What to do when add new ENV VARIABLES

There are several things you need to do when you add new ENV VARIABLES:
- Add them to `.env.example` file
- Add them to your local `.env.development` and `.env.test` files
- Add them to your docker-compose.yml file (just the name, not the value). Only envs listed in the environment section will be exposed to your docker container.
- Add them (prod version) to your github repo secrets. They will be used to generate the `.env` file on deploy.
- Add them (prod version) to test.yml file on .github/workflows/test.yml.

## Who
Ludmila Silveira, 19 years old and a Computer Engineer student at Federal University of Santa Catarina (UFSC).Currently studying to be a full stack developer and this is a learning project.

## When
@date MAI/2023 @copyright Copyright (c) 2023