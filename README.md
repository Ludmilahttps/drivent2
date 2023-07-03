# DRIVENT
This project is an implementation of legacy code from a fictitious company, all implemented features are described in the *about* just below

## About

### 01 - TypeScript

route implementation `/enrollments/cep`
    - CEP information is sent by query parameters, in the format`cep=xxxxxxx`, for example: `/enrollments/cep?cep=1234081`
    - This route uses API from [ViaCEP](https://viacep.com.br/) to search for information about the address that will be provided by the user in the registration through the zip code.
        - The API will return a JSON with various data. The function handles this response and returns only the data as shown in the example below:
            
            ```jsx
            {
              logradouro: "Avenida Brigadeiro Faria Lima",
              complemento: "de 3252 ao fim - lado par",
              bairro: "Itaim Bibi",
              cidade: "São Paulo",
              uf: "SP",
            };
            ```
            
        - There are two error scenarios that are handled:
            - Invalid Format: The API responds with status 400.
            - Valid but nonexistent: In this case, the API returns: "error": "true"

- function adjustment `createOrUpdateEnrollmentWithAddress`
    - We verify that the zip code is valid before creating or updating an enrollment. If not, the operation cannot be completed.

### 02 - Prisma

- Implementation of ticket and payment routes.
    - All routes are authenticated.
    - All routes respond with status `401 (Unauthorized)` if authentication fails.
- **GET** `/tickets/types`
    - Returns all ticket types (`TicketType`) registered in the system.
    - Return with all types of registered tickets
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
            
    - Return without ticket types (there is no record in the system yet): Status: **`200`**
            
- **GET** `/tickets`
    - Returns all tickets (`Ticket`) for the user.
    - Based on the current business rule, the user will only have one Ticket.
    - Returns from user ticket: Status: `200`
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
            
    - Returns to user without registration/registration: Status: `404`
    - Returns to user without ticket: Status: `404`

- **POST** `/tickets`
    - Creates a new ticket (`Ticket`) for the user in the system.
    - body
        
        ```jsx
        { ticketTypeId: number }
        ```
        
    - Returns on successful ticket creation: Status: `201`
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
        
    - Returns to user without registration: Status: `404`
    - Returns when `ticketTypeId` information is not sent: Status: `400`

- **GET:**`/payments?ticketId=1`
    - Returns payment information (`Payment`) for a ticket (`Ticket`).
    - Returns success: Status: `200`
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
            
    - Returns when `ticketId` is not sent as a parameter: Status: `400`
    - Returns when `ticketId` does not exist: Status: `404`
    - Returns when `ticketId` is not associated with the user: Status: `401`

- **POST** `/payments/process`
    - Makes the payment (`Payment`) of a ticket (`Ticket`).
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
        
    - Returns success: Status: `200`
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
            
    - Returns when there is no `cardData` and/or `ticketId` in the `body`: Status: `400`
    - Returns when `ticketId` does not exist: Status: `404`
    - Returns when user does not have the `ticketId`: Status: `401`

### 03 - Tests

- Implementation of the routes:
    - All routes are authenticated.
    - The listing works for both endpoints if the respective user has a subscription with a paid ticket, which includes hosting.
        - Does not exist (registration, ticket or hotel): `404 (not found)`
        - Ticket was not paid, is remote or does not include hotel: `402 (payment required)`
        - Other errors: `400 (bad request)`
    - **GET**: `/hotels` → List all hotels.
    - **GET**: `/hotels/:hotelId` → List hotel rooms.
        
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

- Route implementation and testing:
    - All routes are authenticated.
    - List a reservation (user has already made the reservation)
        
        **GET**: `/booking`
        
        - **Success**: Should return status code `200` with:
            
            ```json
            {
            	"id": bookingId,
            	"Room": {}
            }
            ```
            
        - **Error**: User has no reservation: Must return statuscode `404`.
    - Make a reservation
        - Business rule: Only users with a face-to-face ticket, with accommodation and paid, can make reservations.
        - **POST**: `/booking`
            
            body: 
            
            ```json
            {
            	"roomId": Number
            }
            ```
            
            - **Success**: Should return status code `200` with `bookingId`
            - **Error**:
                - `roomId` non-existent: Must return status code `404`.
                - `roomId` no vacancy: Must return status code `403`.
                - Outside the business rule: Must return status code `403`. 
    - change a reservation
        - Business rule:
            - The exchange can be made for users who have reservations.
             - The exchange can only be made for free rooms.
        - **PUT**: `/booking/:bookingId`
            
            **body**: 
            
            ```json
            {
            	"roomId": Number
            }
            ```
            
            - Success: Should return status code `200` with `bookingId`
            - Error:
                - `roomId` non-existent: Must return status code `404`.
                - `roomId` no vacancy: Must return status code `403`.
                - Outside the business rule: Must return status code `403`.

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
Ludmila Silveira, 19 years old, Computer Engineering student at the Federal University of Santa Catarina (UFSC). She is currently attending a full stack development bootcamp and this is a learning project.

## When
@date MAI/2023 @copyright Copyright (c) 2023