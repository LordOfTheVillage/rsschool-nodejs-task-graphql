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
import * as DataLoader from "dataloader";
import {MemberTypeId} from "../../member-types/schemas.js";
import {MemberType} from "./member-type.js";
import {IdTypes, mapData} from "../utils/mapping.js";

export interface User {
    id: string;
    name: string;
    balance: number;
    profile?: Profile;
    posts?: Post[];
    userSubscribedTo?: User[];
    subscribedToUser?: User[];

    subscriberId: string;
    authorId: string;
}

export interface ContextType extends FastifyInstance {
    profileByUserLoader: DataLoader<string, Profile>;
    profilesByMemberTypeLoader: DataLoader<MemberTypeId, Profile[]>;
    postsByAuthorLoader: DataLoader<string, Post[]>;
    usersLoader: DataLoader<string, User>;
    memberTypeLoader: DataLoader<string, MemberType>;
}

export const userType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: UUIDType},
        name: {type: GraphQLString},
        balance: {type: GraphQLFloat},
        profile: {
            type: profileType,
            resolve: async ({id}: User, args, {profileByUserLoader}: ContextType) => (
                await profileByUserLoader.load(id)
            )
        },
        posts: {
            type: new GraphQLList(postType),
            resolve: async ({id}, args, {postsByAuthorLoader}: ContextType) => (
                await postsByAuthorLoader.load(id)
            )
        },
        userSubscribedTo: {
            // @ts-ignore
            type: new GraphQLList(userType),
            resolve: async ({userSubscribedTo}, args, {usersLoader}: ContextType) => {
                if (userSubscribedTo) {
                    const authorIds = userSubscribedTo.map(({authorId}) => authorId);
                    return usersLoader.loadMany(authorIds);
                } else {
                    return null;
                }
            }
        },
        subscribedToUser: {
            type: new GraphQLList(userType),
            resolve: async ({subscribedToUser}, args, {prisma, usersLoader}: ContextType) => {
                if (subscribedToUser) {
                    const authorIds = subscribedToUser.map(({subscriberId}) => subscriberId);
                    return usersLoader.loadMany(authorIds);
                } else {
                    return null;
                }
            }
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

export const updateUserInputType = new GraphQLInputObjectType({
    name: 'ChangeUserInput',
    fields: () => ({
        name: {type: GraphQLString},
        balance: {type: GraphQLFloat},
    })
})

export const usersLoader = (prisma: PrismaClient) => async (ids: readonly string[]) => {
    const idsList = ids as string[];
    const users = await prisma.user.findMany({
        where: {id: {in: idsList}},
        include: {
            userSubscribedTo: true,
            subscribedToUser: true,
        },
    });

    return mapData(users, idsList, IdTypes.ID);
}