import {FastifyPluginAsyncTypebox} from '@fastify/type-provider-typebox';
import {createGqlResponseSchema, gqlResponseSchema} from './schemas.js';
import {DocumentNode, graphql, parse, validate} from 'graphql';
import {schema} from "./schema/schema.js";
import depthLimit from 'graphql-depth-limit'


const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
    const {prisma} = fastify;

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
            const {query, variables} = req.body;

            const maxDepth = 5;
            const document = parse(String(query))
            const validationErrors = validate(schema, document, [depthLimit(maxDepth)]);
            if (validationErrors.length > 0) {
                return { errors: validationErrors };
            }

            const result = await graphql({
                schema,
                source: query,
                variableValues: variables,
                contextValue: {prisma},
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
