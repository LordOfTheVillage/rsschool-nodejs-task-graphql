import {
    GraphQLBoolean,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString
} from "graphql/type/index.js";
import {ContextType, createUserInputType, userType} from "../types/user.js";
import {createPostInputType, postType} from "../types/post.js";
import {createProfileInputType, profileType} from "../types/profile.js";
import {memberTypeType} from "../types/member-type.js";
import {memberTypeIdType} from "../types/member-type-id.js";
import {CreateUserDto} from "../dto/create-user.dto.js";
import {DtoObject} from "../dto/dto-object.dto.js";
import {CreatePostDto} from "../dto/create-post.dto.js";
import {CreateProfileDto} from "../dto/create-profile.dto.js";
import {UUIDType} from "../types/uuid.js";

export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: ({
            memberTypes: {
                type: new GraphQLList(memberTypeType),
                resolve: async (source, args, {prisma}: ContextType) => (
                    await prisma.memberType.findMany()
                )
            },
            memberType: {
                type: memberTypeType,
                args: {
                    id: {type: memberTypeIdType}
                },
                resolve: async (source, {id}, {prisma}: ContextType) => (
                    await prisma.memberType.findUnique({
                        where: {
                            id
                        }
                    })
                )
            },
            users: {
                type: new GraphQLList(userType),
                resolve: async (source, args, {prisma}: ContextType) => (
                    await prisma.user.findMany()
                )
            },
            user: {
                type: userType,
                args: {
                    id: {type: userType.getFields().id.type}
                },
                resolve: async (source, {id}, {prisma}: ContextType) => (
                    await prisma.user.findUnique({
                        where: {
                            id
                        }
                    })
                )
            },
            posts: {
                type: new GraphQLList(postType),
                resolve: async (source, args, {prisma}: ContextType) => (
                    await prisma.post.findMany()
                )
            },
            post: {
                type: postType,
                args: {
                    id: {type: userType.getFields().id.type}
                },
                resolve: async (source, {id}, {prisma}: ContextType) => (
                    await prisma.post.findUnique({
                        where: {
                            id
                        }
                    })
                )
            },
            profiles: {
                type: new GraphQLList(profileType),
                resolve: async (source, args, {prisma}: ContextType) => (
                    await prisma.profile.findMany()
                )
            },
            profile: {
                type: profileType,
                args: {
                    id: {type: profileType.getFields().id.type}
                },
                resolve: async (source, {id}, {prisma}: ContextType) => (
                    await prisma.profile.findUnique({
                        where: {
                            id
                        }
                    })
                )
            },
        })
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: ({
            createUser: {
                type: userType,
                args: {
                    dto: {type: createUserInputType}
                },
                resolve: async (source, {dto}: DtoObject<CreateUserDto>, {prisma}: ContextType) => {
                    return await prisma.user.create({
                        data: {
                            ...dto
                        }
                    })
                }
            },
            createPost: {
                type: postType,
                args: {
                    dto: {type: createPostInputType}
                },
                resolve: async (source, {dto}: DtoObject<CreatePostDto>, {prisma}: ContextType) => {
                    return await prisma.post.create({
                        data: {
                            ...dto
                        }
                    })
                }
            },
            createProfile: {
                type: profileType,
                args: {
                    dto: {type: createProfileInputType}
                },
                resolve: async (source, {dto}: DtoObject<CreateProfileDto>, {prisma}: ContextType) => {
                    return await prisma.profile.create({
                        data: {
                            ...dto
                        }
                    })
                }
            },
            deleteUser: {
                type: GraphQLBoolean,
                args: {
                    id: {type: UUIDType}
                },
                resolve: async (source, {id}, {prisma}: ContextType) => {
                    return !!(await prisma.user.delete({
                        where: {
                            id
                        }
                    }))
                }
            },
            deletePost: {
                type: GraphQLBoolean,
                args: {
                    id: {type: UUIDType}
                },
                resolve: async (source, {id}, {prisma}: ContextType) => {
                    return !!(await prisma.post.delete({
                        where: {
                            id
                        }
                    }))
                }
            },
            deleteProfile: {
                type: GraphQLBoolean,
                args: {
                    id: {type: UUIDType}
                },
                resolve: async (source, {id}, {prisma}: ContextType) => {
                    return !!(await prisma.profile.delete({
                        where: {
                            id
                        }
                    }))
                }
            }
        })
    })
})