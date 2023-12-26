import "dotenv/config";
import "reflect-metadata";
import { Sequelize } from 'sequelize-typescript';
import express, { Express } from "express";
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import UserResolver from './graphql/User';
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { createContext } from "./context";
import TodoResolver from "./graphql/Todo";
import cors, { CorsOptions } from 'cors';
// @ts-ignore
import XSS from 'xss-clean';
import helmet from 'helmet';
import path from "path";

const corsOptions: CorsOptions = {
  credentials: false,
  origin: process.env.ORIGIN || '*',
};

const main = async () => {
    // ? Previous used for LOCAL
    // const sequelize = new Sequelize({
    //   // * Sequelize instance is not getting initialized when left true.
    //   // ! NEED TO LOOK
    //   // repositoryMode: true,
    //   database: process.env.DB_NAME,
    //   dialect: 'postgres',
    //   username: process.env.DB_USER,
    //   password: process.env.DB_PASS,
    //   host: process.env.HOST,
    //   port: Number(process.env.DB_PORT),
    //   models: [`${__dirname}/models`],
    //   modelMatch: (filename, member) => {
    //     return (
    //       filename.substring(0, filename.indexOf('.model')).toLowerCase() ===
    //       member.toLowerCase()
    //     );
    //   },
    // });

    // * Current for PROD
    const sequelize = new Sequelize(process.env.DB_URI, {
      models: [`${__dirname}/models`],
      modelMatch: (filename, member) => {
        return (
          filename.substring(0, filename.indexOf('.model')).toLowerCase() ===
          member.toLowerCase()
        );
      },
    });

    try {
        await sequelize.sync();

        const apolloServer = new ApolloServer({
          schema: await buildSchema({
            resolvers: [UserResolver, TodoResolver],
            validate: false,
          }),
          ...(process.env.NODE_ENV === 'development' ? { plugins: [ApolloServerPluginLandingPageGraphQLPlayground()] } : {}),
          context: createContext
        });

        await apolloServer.start();

        const app: Express = express();

        // ! Set Trust Proxy to 1
        app.set('trust proxy', 1);

        // * Setting FE as base URL
        app.use(express.static(path.resolve(__dirname, '../', 'public')));

        // * Setting Helmet and XSS-CLEAN
        if(process.env.NODE_ENV === 'development') {
          app.use(helmet());
        }
        
        app.use(cors(corsOptions))
        app.use(XSS());

        app.use('*', (_, res) => {
          return res.sendFile(
            path.resolve(__dirname, '../', 'public', 'index.html')
          );
        });

        apolloServer.applyMiddleware({ app });

        app.listen(process.env.PORT, () => {
          console.log(
            `Server Started on port http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
          );
        });
    } catch (error) {
        console.log(error);
    }
}

main()