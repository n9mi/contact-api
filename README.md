# contact-api
A RESTful API example for simple contacts and adress CRUD operation built with Typescript, Express, and Prisma. Included with CI using Github Actions and automatic push on Dockerhub. My own version of [Programmer Zaman Now belajar-typescript-restful-api](https://github.com/ProgrammerZamanNow/belajar-typescript-restful-api/).

## Installation
- Copy .env.example to .env
```bash
cp .env.example .env
```

- Run the app with Docker
```bash
docker compose up

# or

docker-compose up

# API Endpoint : http://127.0.0.1:3000 or set the port according to your .env
# basePath is default to api/v1/
```

## Structure
```
.
├── __test__/
├── .github
├── prisma/
│   └── migrations
├── src/
│   ├── application/
│   ├── controller/
│   ├── error/
│   ├── middleware/
│   ├── model/
│   ├── router/
│   ├── service/
│   ├── types/
│   ├── validation/
│   └── main.ts
├── .env
├── package.json
├── babel.config.json
├── tsconfig.json
├── docker-compose.yml
└── Dockerfile
```

## API
#### api/v1/auth/register
* `POST`: Registering an user

#### api/v1/auth/login
* `POST`: Getting a token from registered user

#### api/v1/user/info
* `GET`: Getting an user info (username, name, password)

#### api/v1/user/update
* `GET`: Updating user info (username, name, password)

#### api/v1/contacts
* `GET`: Getting all contacts with pagination and search parameter 
* `POST`: Creatin a contact

#### api/v1/contacts/:contactId
* `GET`: Getting a contact by id 
* `PUT`: Updating a contact specified by contact id
* `DELETE`: Deleting a contact specified by id

#### api/v1/contacts/:contactId/addresses
* `GET`: Getting all address within specified contact
* `POST`: Creatin an address for specified contact

#### api/v1/contacts/:contactId/addresses/:addressId
* `PUT`: Updating an address specified by address id
* `DELETE`: Deleting an address specified by address id