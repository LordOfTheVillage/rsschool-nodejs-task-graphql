import {FastifyPluginAsyncTypebox} from '@fastify/type-provider-typebox';
import {createGqlResponseSchema, gqlResponseSchema} from './schemas.js';
import {graphql, parse, validate} from 'graphql';
import {schema} from "./data/schema.js";
import depthLimit from 'graphql-depth-limit';
import DataLoader from "dataloader";
import {usersLoader} from "./types/user.js";
import {postsByAuthorLoader} from "./types/post.js";
import {profilesByMemberTypeLoader, profilesByUserLoader} from "./types/profile.js";
import {memberTypeLoader} from "./types/member-type.js";


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

            const loaders = {
                usersLoader: new DataLoader(usersLoader(prisma)),
                postsByAuthorLoader: new DataLoader(postsByAuthorLoader(prisma)),
                profileByUserLoader: new DataLoader(profilesByUserLoader(prisma)),
                memberTypeLoader: new DataLoader(memberTypeLoader(prisma)),
                profilesByMemberTypeLoader: new DataLoader(profilesByMemberTypeLoader(prisma)),
            };

            const result = await graphql({
                schema,
                source: query,
                variableValues: variables,
                contextValue: {prisma, ...loaders},
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
