import {
    GraphQLBoolean,
    GraphQLList,
    GraphQLObjectType,
    GraphQLSchema
} from "graphql/type/index.js";
import {ContextType, createUserInputType, updateUserInputType, User, userType} from "../types/user.js";
import {createPostInputType, postType, updatePostInputType} from "../types/post.js";
import {createProfileInputType, profileType, updateProfileInputType} from "../types/profile.js";
import {memberTypeType} from "../types/member-type.js";
import {memberTypeIdType} from "../types/member-type-id.js";
import {CreateUserDto} from "../dto/user/create-user.dto.js";
import {DtoObject} from "../dto/dto-object.dto.js";
import {CreatePostDto} from "../dto/post/create-post.dto.js";
import {CreateProfileDto} from "../dto/profile/create-profile.dto.js";
import {UUIDType} from "../types/uuid.js";
import {UpdateUserDto} from "../dto/user/update-user.dto.js";
import {UpdatePostDto} from "../dto/post/update-post.dto.js";
import {UpdateProfileDto} from "../dto/profile/update-profile.dto.js";
import {SubscribeDto} from "../dto/user/subscribe.dto.js";
import {parseResolveInfo, ResolveTree, simplifyParsedResolveInfoFragmentWithType} from "graphql-parse-resolve-info";

interface ParsedResolveInfoFragment {
 fields: { [key in string]: ResolveTree}
}

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
                resolve: async (source, args, {prisma, usersLoader}: ContextType, resolveInfo) => {
                    const parsedResolveInfoFragment = parseResolveInfo(resolveInfo);
                    const {fields}: ParsedResolveInfoFragment = simplifyParsedResolveInfoFragmentWithType(<ResolveTree>parsedResolveInfoFragment, new GraphQLList(userType));

                    const users = (await prisma.user.findMany({
                        include: {
                            userSubscribedTo: !!fields.userSubscribedTo,
                            subscribedToUser: !!fields.subscribedToUser,
                        },
                    }))

                    users.forEach(user => {
                        usersLoader.prime(user.id, user as User);
                    });

                    return users;
                }
            },
            user: {
                type: userType,
                args: {
                    id: {type: userType.getFields().id.type}
                },
                resolve: async (source, {id}, {usersLoader}: ContextType) => (
                    await usersLoader.load(id as string)
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
            },
            changeUser: {
                type: userType,
                args: {
                    id: {type: UUIDType},
                    dto: {type: updateUserInputType}
                },
                resolve: async (source, {id, dto}: DtoObject<UpdateUserDto>, {prisma}: ContextType) => {
                    return await prisma.user.update({
                        where: {
                            id
                        },
                        data: {
                            ...dto
                        }
                    })
                }
            },
            changePost: {
                type: postType,
                args: {
                    id: {type: UUIDType},
                    dto: {type: updatePostInputType}
                },
                resolve: async (source, {id, dto}: DtoObject<UpdatePostDto>, {prisma}: ContextType) => {
                    return await prisma.post.update({
                        where: {
                            id
                        },
                        data: {
                            ...dto
                        }
                    })
                }
            },
            changeProfile: {
                type: profileType,
                args: {
                    id: {type: UUIDType},
                    dto: {type: updateProfileInputType}
                },
                resolve: async (source, {id, dto}: DtoObject<UpdateProfileDto>, {prisma}: ContextType) => {
                    return await prisma.profile.update({
                        where: {
                            id
                        },
                        data: {
                            ...dto
                        }
                    })
                }
            },
            subscribeTo: {
                type: userType,
                args: {
                    userId: {type: UUIDType},
                    authorId: {type: UUIDType}
                },
                resolve: async (source, {userId, authorId}: SubscribeDto, {prisma}: ContextType) => {
                    return await prisma.user.update({
                        where: {
                            id: userId,
                        },
                        data: {
                            userSubscribedTo: {
                                create: {
                                    authorId: authorId,
                                },
                            },
                        },
                    })
                }
            },
            unsubscribeFrom: {
                type: GraphQLBoolean,
                args: {
                    userId: {type: UUIDType},
                    authorId: {type: UUIDType}
                },
                resolve: async (source, {userId, authorId}: SubscribeDto, {prisma}: ContextType) => {
                    return !!(await prisma.subscribersOnAuthors.delete({
                        where: {
                            subscriberId_authorId: {
                                subscriberId: userId,
                                authorId: authorId,
                            },
                        },
                    }))
                }
            }
        })
    })
})