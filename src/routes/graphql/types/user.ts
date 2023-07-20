import {
    GraphQLFloat,
    GraphQLInputObjectType,
    GraphQLList,
    GraphQLObjectType,
    GraphQLString
} from "graphql/type/index.js";
import {Post, postType} from "./post.js";
import {Profile, profileType} from "./profile.js";
import {UUIDType} from "./uuid.js";
import {PrismaClient} from "@prisma/client";
import {FastifyInstance} from "fastify";
import users from "../../users/index.js";

export interface User {
    id: string;
    name: string;
    balance: number;
    profile?: Profile;
    posts?: Post[];
    userSubscribedTo?: User[];
    subscribedToUser?: User[];
}

export interface ContextType extends FastifyInstance {
    prisma: PrismaClient;
}

export const userType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: UUIDType},
        name: {type: GraphQLString},
        balance: {type: GraphQLFloat},
        profile: {
            type: profileType,
            resolve: async (source, args, { prisma }: ContextType) => (
                await prisma.profile.findUnique({
                    where: {
                        userId: source.id
                    },
                    include: {
                        memberType: true
                    }
                })
            )
        },
        posts: {
            type: new GraphQLList(postType),
            resolve: async (source, args, { prisma }: ContextType) => (
                await prisma.post.findMany({
                    where: {
                        authorId: source.id
                    }
                })
            )
        },
        userSubscribedTo: {
            // @ts-ignore
            type: new GraphQLList(userType),
            resolve: async (source, args, { prisma }: ContextType) => (
                await prisma.user.findMany({
                    where: {
                        subscribedToUser: {
                            some: {
                                subscriberId: source.id,
                            },
                        },
                    },
                })
            )
        },
        subscribedToUser: {
            // @ts-ignore
            type: new GraphQLList(userType),
            resolve: async (source, args, { prisma }: ContextType) => (
                await prisma.user.findMany({
                    where: {
                        userSubscribedTo: {
                            some: {
                                authorId: source.id,
                            },
                        },
                    },
                })
            )
        }
    }),
})

export const createUserInputType = new GraphQLInputObjectType({
    name: 'CreateUserInput',
    fields: () => ({
        name: {type: GraphQLString},
        balance: {type: GraphQLFloat},
    })
})