import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {buildSchema, graphql} from 'graphql';
import {schema} from "./schema/schema.js";
// import {getResolvers} from "./data/resolvers.js";


const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;
  // const resolvers = getResolvers(prisma)
  // const schema = buildSchema(typeDefs);

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;

      const result = await graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue: {prisma}
      });
      return {
        data: result.data,
        errors: result.errors?.map((error) => ({
          message: error.message,
        })),
      };
    },
  });
};

export default plugin;
