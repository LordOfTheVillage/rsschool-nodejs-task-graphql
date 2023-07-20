import {
    GraphQLArgumentConfig,
    GraphQLEnumType, GraphQLInputType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString
} from "graphql/type/index.js";
import {ContextType, userType} from "../types/user.js";
import {postType} from "../types/post.js";
import {profileType} from "../types/profile.js";
import {memberTypeType} from "../types/member-type.js";
import {UUIDType} from "../types/uuid.js";
import {memberTypeIdType} from "../types/member-type-id.js";

export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: ({
            memberTypes: {
                type: new GraphQLList(memberTypeType),
                resolve: async (source, args, { prisma }: ContextType) => (
                    await prisma.memberType.findMany()
                )
            },
            memberType: {
                type: memberTypeType,
                args: {
                    id: { type: memberTypeIdType }
                },
                resolve: async (source, { id }, { prisma }: ContextType) => (
                    await prisma.memberType.findUnique({
                        where: {
                            id
                        }
                    })
                )
            },
            users: {
                type: new GraphQLList(userType),
                resolve: async (source, args, { prisma }: ContextType) => (
                    await prisma.user.findMany()
                )
            },
            user: {
                type: userType,
                args: {
                    id: { type: userType.getFields().id.type }
                },
                resolve: async (source, { id }, { prisma }: ContextType) => (
                    await prisma.user.findUnique({
                        where: {
                            id
                        }
                    })
                )
            },
            posts: {
                type: new GraphQLList(postType),
                resolve: async (source, args, { prisma }: ContextType) => (
                    await prisma.post.findMany()
                )
            },
            post: {
                type: postType,
                args: {
                    id: { type: userType.getFields().id.type }
                },
                resolve: async (source, { id }, { prisma }: ContextType) => (
                    await prisma.post.findUnique({
                        where: {
                            id
                        }
                    })
                )
            },
            profiles: {
                type: new GraphQLList(profileType),
                resolve: async (source, args, { prisma }: ContextType) => (
                    await prisma.profile.findMany()
                )
            },
            profile: {
                type: profileType,
                args: {
                    id: { type: profileType.getFields().id.type }
                },
                resolve: async (source, { id }, { prisma }: ContextType) => (
                    await prisma.profile.findUnique({
                        where: {
                            id
                        }
                    })
                )
            },
        })
    })
})