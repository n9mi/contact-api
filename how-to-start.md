# How to start Typescript, Express, Prisma RESTful API

## Initialization
```
npm init

```

## Prisma, typescript, and nodemon installation
```
npm i typescript ts-node @types/node prisma nodemon concurrently --save-dev
```

## Installing other packages
```
npm i zod express winston bcrypt uuid
```

## Adding typescript types to installed packages
```
npm i @types/express @types/bcrypt @types/uuid --save-dev
```

## Adding testing related packages 
```
npm i jest @types/jest @jest/globals babel-jest @babel/preset-env @babel/preset-typescript supertest --save-dev
```

## Initiating typescript
```
npx tsc init
```

## Editing tsconfig.json
### Add src folder at the top of the file
```json
{
    "include": [
        "src/**/*"
    ],
}
```

### Add or make sure commonjs set as module
```json
{
    "module": "commonjs",
}
```

### Set output dir as .dist
```json
{
    "outDir": "./dist",   
}
```

## Setup prisma
### Initializing prisma
This command will output a ./prisma folder which contains prisma schema (schema.prisma). Make sure to install prisma extension to enable syntax highlighting in .prisma file
```
npx prisma init
```

### Adding database and set generated .env according to the database creds
In this step, define DB_DATABASE, DB_USERNAME, DB_PASSWORD to .env file and `docker compose up` it. Then edit the DB_URL on .env according to the newly created database

### Adding schema to schema.prisma
Define `model` on schema.prisma. Refer to [this docs](https://www.prisma.io/docs/orm/prisma-schema/data-model/models)

### Migrate the prisma schema
```
npx prisma migrate dev
```

### Installing prisma client
```
npm install @prisma/client
```